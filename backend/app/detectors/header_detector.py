import re
import hashlib
from typing import Dict, Any, List, Optional
from email import message_from_string
from app.schemas import Finding

class HeaderDetector:
    """
    RFC 822 / 5322 Email Header Inspector.
    Examines From, Reply-To, Return-Path, SPF, DKIM, DMARC, and Received hops.
    Explains findings transparently without fabricating absent evidence.
    """

    def analyze(self, raw_headers: str) -> Dict[str, Any]:
        raw_clean = raw_headers.strip()
        if not raw_clean:
            return self._empty_result()

        findings: List[Finding] = []
        raw_score = 0.0

        # Parse using Python's standard email parser
        msg = message_from_string(raw_clean)

        # 1. Extract Addresses
        from_hdr = msg.get("From", "")
        reply_to_hdr = msg.get("Reply-To", "")
        return_path_hdr = msg.get("Return-Path", "")
        subject_hdr = msg.get("Subject", "")

        from_email = self._extract_email_address(from_hdr)
        reply_to_email = self._extract_email_address(reply_to_hdr)
        return_path_email = self._extract_email_address(return_path_hdr)

        from_domain = from_email.split("@")[1].lower() if "@" in from_email else ""
        reply_to_domain = reply_to_email.split("@")[1].lower() if "@" in reply_to_email else ""
        return_path_domain = return_path_email.split("@")[1].lower() if "@" in return_path_email else ""

        # Check: Missing From Header
        if not from_email:
            raw_score += 30.0
            findings.append(Finding(
                indicator="Missing or Unparseable 'From' Header",
                severity="HIGH",
                explanation="RFC email standards require a valid 'From' header. Absence or corruption of this field prevents sender verification.",
                snippet=from_hdr or "[Absent]"
            ))

        # Check: From vs Reply-To Mismatch
        if from_domain and reply_to_domain and from_domain != reply_to_domain:
            raw_score += 35.0
            findings.append(Finding(
                indicator="From and Reply-To Domain Discrepancy",
                severity="HIGH",
                explanation=(
                    f"The display sender claims domain '@{from_domain}', but replies are directed to '@{reply_to_domain}'. "
                    "While legitimate bulk newsletters occasionally direct replies to ticketing systems, "
                    "this technique is frequently used by spear-phishers to spoof brand names on outgoing mail while receiving replies on attacker-controlled mailboxes."
                ),
                snippet=f"From: {from_domain} vs Reply-To: {reply_to_domain}"
            ))

        # Check: From vs Return-Path Mismatch
        if from_domain and return_path_domain and from_domain != return_path_domain:
            raw_score += 20.0
            findings.append(Finding(
                indicator="Return-Path Domain Mismatch",
                severity="MEDIUM",
                explanation=(
                    f"The 'From' domain (@{from_domain}) differs from the 'Return-Path' envelope domain (@{return_path_domain}). "
                    "This envelope address receives bounce messages (NDRs). Discrepancies can occur in marketing email relays (Sendgrid, Mailgun), "
                    "but can also indicate envelope spoofing."
                ),
                snippet=f"From: {from_domain} vs Return-Path: {return_path_domain}"
            ))

        # 2. Authentication-Results / Received-SPF
        auth_results = msg.get_all("Authentication-Results", [])
        received_spf = msg.get("Received-SPF", "")
        auth_blob = " ".join(auth_results) + " " + (received_spf or "")

        # --- SPF Analysis ---
        spf_status, spf_details = self._parse_spf(auth_blob, received_spf)
        if spf_status == "fail":
            raw_score += 35.0
            findings.append(Finding(
                indicator="SPF Authentication Hard Fail",
                severity="HIGH",
                explanation=(
                    "Sender Policy Framework (SPF) check failed (fail). The sending mail server IP address is NOT "
                    "authorized by the domain owner's DNS SPF record to deliver email for this domain."
                ),
                snippet=spf_details
            ))
        elif spf_status == "softfail":
            raw_score += 20.0
            findings.append(Finding(
                indicator="SPF Authentication Softfail (~all)",
                severity="MEDIUM",
                explanation=(
                    "SPF check resulted in 'softfail'. The sending host is probably not authorized, but the domain owner's "
                    "policy instructs receivers to accept with scrutiny rather than outright rejection."
                ),
                snippet=spf_details
            ))
        elif spf_status == "pass":
            findings.append(Finding(
                indicator="SPF Verification Succeeded",
                severity="LOW",
                explanation="SPF check passed. The sending IP is explicitly authorized in the domain's SPF DNS record.",
                snippet=spf_details
            ))
        elif spf_status == "none":
            raw_score += 10.0
            findings.append(Finding(
                indicator="SPF Record Absent or Not Evaluated",
                severity="LOW",
                explanation="No conclusive SPF verification header was found. The sender domain may lack SPF records, or intermediate relays stripped headers.",
                snippet="SPF: None found"
            ))

        # --- DKIM Analysis ---
        dkim_status, dkim_details = self._parse_dkim(auth_blob, msg.get("DKIM-Signature", ""))
        if dkim_status == "fail":
            raw_score += 35.0
            findings.append(Finding(
                indicator="DKIM Cryptographic Signature Failure",
                severity="HIGH",
                explanation=(
                    "DomainKeys Identified Mail (DKIM) verification failed. The cryptographic signature does not match "
                    "the message body or headers, suggesting message tampering in transit or signature forgery."
                ),
                snippet=dkim_details
            ))
        elif dkim_status == "pass":
            findings.append(Finding(
                indicator="DKIM Cryptographic Signature Valid",
                severity="LOW",
                explanation="DKIM signature verified successfully. The message integrity has been cryptographically preserved since dispatch.",
                snippet=dkim_details
            ))
        elif dkim_status == "none":
            raw_score += 10.0
            findings.append(Finding(
                indicator="DKIM Signature Not Present",
                severity="LOW",
                explanation="No DKIM signature was identified in the provided headers. Most modern enterprise senders sign outgoing emails with DKIM.",
                snippet="DKIM: None"
            ))

        # --- DMARC Analysis ---
        dmarc_status, dmarc_details = self._parse_dmarc(auth_blob)
        if dmarc_status == "fail":
            raw_score += 40.0
            findings.append(Finding(
                indicator="DMARC Policy Alignment Failure",
                severity="HIGH",
                explanation=(
                    "DMARC policy validation failed. The message failed alignment between the display 'From' address "
                    "and either the SPF or DKIM verified domains."
                ),
                snippet=dmarc_details
            ))
        elif dmarc_status == "pass":
            findings.append(Finding(
                indicator="DMARC Validation Succeeded",
                severity="LOW",
                explanation="DMARC passed. The sender's identity aligns with domain owner security policies.",
                snippet=dmarc_details
            ))
        elif dmarc_status == "none":
            raw_score += 5.0
            findings.append(Finding(
                indicator="DMARC Verification Unspecified",
                severity="LOW",
                explanation="DMARC evaluation was not present in the Authentication-Results header.",
                snippet="DMARC: None"
            ))

        # 3. Received Headers / Hop Count Analysis
        received_headers = msg.get_all("Received", [])
        hop_count = len(received_headers)
        hops_info = []
        for i, h in enumerate(reversed(received_headers)):
            hop_clean = re.sub(r"\s+", " ", h).strip()
            hops_info.append(f"Hop #{i+1}: {hop_clean[:90]}...")

        if hop_count == 0:
            raw_score += 15.0
            findings.append(Finding(
                indicator="No 'Received' Routing Headers Present",
                severity="MEDIUM",
                explanation="Headers lack 'Received:' trace lines. Complete email headers typically record the MTA relay chain.",
                snippet="Hop count: 0"
            ))
        elif hop_count > 8:
            raw_score += 10.0
            findings.append(Finding(
                indicator="Unusually Long Relay Chain",
                severity="LOW",
                explanation=f"Email traversed {hop_count} mail transfer hops. Complex routing can be an artifact of relay proxies, remailers, or complex forwarding.",
                snippet=f"Total hops: {hop_count}"
            ))

        final_score = min(100.0, max(0.0, raw_score))

        if final_score >= 60.0:
            risk_level = "HIGH"
            category = "Email Header Spoofing / Auth Failure"
        elif final_score >= 25.0:
            risk_level = "MEDIUM"
            category = "Inconsistent Email Headers"
        else:
            risk_level = "LOW"
            category = "Authentic / Verified Headers"

        recommendations = self._generate_recommendations(risk_level, findings)

        content_hash = hashlib.sha256(raw_clean.encode("utf-8")).hexdigest()

        confidence_notice = (
            "Email header analysis relies strictly on data explicitly present in the pasted headers. "
            "SocialShield 2.0 does not fabricate absent authentication verdicts. Note that headers "
            "copied from forwarded messages or client exports may be truncated."
        )

        preview_text = f"From: {from_email or 'Unknown'} | Subject: {subject_hdr[:40] or 'N/A'}"

        return {
            "analysis_type": "email_header",
            "score": round(final_score, 1),
            "risk_level": risk_level,
            "category": category,
            "findings": findings,
            "recommendations": recommendations,
            "content_preview": preview_text,
            "content_hash": content_hash,
            "confidence_notice": confidence_notice,
            "metrics": {
                "from_email": from_email,
                "reply_to_email": reply_to_email,
                "return_path_email": return_path_email,
                "subject": subject_hdr,
                "spf_status": spf_status,
                "dkim_status": dkim_status,
                "dmarc_status": dmarc_status,
                "hop_count": hop_count,
                "hops_summary": hops_info[:5]
            }
        }

    def _extract_email_address(self, raw_header: str) -> str:
        if not raw_header:
            return ""
        match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", raw_header)
        return match.group(0).lower() if match else ""

    def _parse_spf(self, auth_blob: str, received_spf: str) -> tuple[str, str]:
        combined = f"{auth_blob} {received_spf}".lower()
        if "spf=fail" in combined or "spf: fail" in combined:
            return "fail", "spf=fail"
        if "spf=softfail" in combined or "spf: softfail" in combined:
            return "softfail", "spf=softfail"
        if "spf=pass" in combined or "spf: pass" in combined:
            return "pass", "spf=pass"
        if "spf=neutral" in combined:
            return "neutral", "spf=neutral"
        return "none", "Not specified"

    def _parse_dkim(self, auth_blob: str, dkim_sig: str) -> tuple[str, str]:
        combined = auth_blob.lower()
        if "dkim=fail" in combined:
            return "fail", "dkim=fail"
        if "dkim=pass" in combined:
            return "pass", "dkim=pass"
        if dkim_sig:
            return "present", "DKIM-Signature header present"
        return "none", "Not specified"

    def _parse_dmarc(self, auth_blob: str) -> tuple[str, str]:
        combined = auth_blob.lower()
        if "dmarc=fail" in combined:
            return "fail", "dmarc=fail"
        if "dmarc=pass" in combined:
            return "pass", "dmarc=pass"
        return "none", "Not specified"

    def _generate_recommendations(self, risk_level: str, findings: List[Finding]) -> List[str]:
        recs = []
        if risk_level == "HIGH":
            recs.append("Treat this email as untrusted and potentially spoofed. Do not act on its contents.")
            recs.append("Sender authenticity checks (SPF/DKIM/DMARC) or header addresses exhibit critical inconsistencies.")
            recs.append("Cross-check the purported sender through an official phone call or instant message before opening links or attachments.")
        elif risk_level == "MEDIUM":
            recs.append("Header inconsistencies detected. Note that legitimate newsletters or CRM relays sometimes cause mild mismatches.")
            recs.append("Inspect sender details and verify the domain identity if sensitive information or financial action is requested.")
        else:
            recs.append("Headers show proper authentication alignment and valid cryptographic signatures.")
            recs.append("Remember: compromised legitimate accounts can still send malicious messages with valid headers. Always inspect the content.")
        return recs

    def _empty_result(self) -> Dict[str, Any]:
        return {
            "analysis_type": "email_header",
            "score": 0.0,
            "risk_level": "LOW",
            "category": "Empty Input",
            "findings": [],
            "recommendations": ["Paste RFC 822 / 5322 email headers to initiate inspection."],
            "content_preview": "[Empty Headers]",
            "content_hash": "",
            "confidence_notice": "No header content provided.",
            "metrics": {}
        }

header_detector = HeaderDetector()
