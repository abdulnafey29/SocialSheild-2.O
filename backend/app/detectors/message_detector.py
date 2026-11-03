import re
import hashlib
from typing import List, Dict, Any, Tuple
from app.schemas import Finding

class PhishingRule:
    def __init__(
        self,
        code: str,
        name: str,
        category: str,
        severity: str,  # "LOW", "MEDIUM", "HIGH"
        weight: float,
        patterns: List[str],
        explanation: str,
        regex_flags: int = re.IGNORECASE,
    ):
        self.code = code
        self.name = name
        self.category = category
        self.severity = severity
        self.weight = weight
        self.patterns = patterns
        self.explanation = explanation
        self.compiled = [re.compile(p, regex_flags) for p in patterns]

    def evaluate(self, text: str) -> Tuple[bool, List[str]]:
        matches = []
        for regex in self.compiled:
            found = regex.findall(text)
            if found:
                for match in found:
                    if isinstance(match, tuple):
                        match = " ".join([m for m in match if m])
                    if match and match not in matches:
                        matches.append(match.strip())
        return len(matches) > 0, matches


# Comprehensive modular rule catalog
RULES: List[PhishingRule] = [
    # 1. Credential & Authentication Harvesting
    PhishingRule(
        code="CRED_01",
        name="Credential & Password Request",
        category="Credential Harvesting",
        severity="HIGH",
        weight=30.0,
        patterns=[
            r"\b(enter|confirm|update|verify|provide|submit|reset)\s+(your\s+)?(password|passcode|login\s+credentials|pin\s+number)\b",
            r"\b(verify|validate)\s+your\s+(credentials|account\s+access)\b",
            r"\bpassword\s+(has\s+expired|expiry|reset\s+link)\b",
        ],
        explanation="Direct requests to supply or verify login passwords or PINs are characteristic of credential harvesting attacks. Legitimate services do not ask for passwords over email or chat.",
    ),
    PhishingRule(
        code="CRED_02",
        name="OTP / 2FA Code Interception",
        category="Credential Harvesting",
        severity="HIGH",
        weight=32.0,
        patterns=[
            r"\b(one-time\s+passcode|otp|2fa|mfa|verification\s+code|security\s+code)\b",
            r"\b(share|send|provide|read\s+back|text\s+me)\s+(the|your)?\s*(code|otp|sms\s+pin)\b",
            r"\bdo\s+not\s+share\s+this\s+code\b",
        ],
        explanation="Attackers use social engineering to intercept One-Time Passwords (OTPs) and MFA tokens to defeat two-factor authentication in real-time.",
    ),
    PhishingRule(
        code="CRED_03",
        name="Sensitive Identity & Banking Info",
        category="Credential Harvesting",
        severity="HIGH",
        weight=28.0,
        patterns=[
            r"\b(social\s+security\s+number|ssn|national\s+insurance|tax\s+id)\b",
            r"\b(credit\s+card\s+number|cvv|cvc|card\s+expiration|routing\s+number|bank\s+account\s+details)\b",
            r"\b(recovery\s+phrase|seed\s+phrase|private\s+key)\b",
        ],
        explanation="Demands for sensitive identifiers, card CVVs, or bank routing information are high-risk indicators of identity theft and financial fraud.",
    ),

    # 2. Urgency & Coercive Deadlines
    PhishingRule(
        code="URG_01",
        name="Artificial Deadlines & Time Pressure",
        category="Urgency & Pressure",
        severity="MEDIUM",
        weight=16.0,
        patterns=[
            r"\b(within\s+(24|12|48|2|1|few)\s+(hours|hrs|minutes|mins))\b",
            r"\b(immediately|act\s+now|urgent\s+action\s+required|time\s+is\s+running\s+out|final\s+notice)\b",
            r"\b(deadline\s+is\s+approaching|prompt\s+response\s+is\s+mandatory)\b",
        ],
        explanation="Artificial deadlines exploit cognitive urgency bias, inducing panic so targets act precipitously before verifying the communication.",
    ),
    PhishingRule(
        code="URG_02",
        name="Threat of Account Suspension or Legal Penalty",
        category="Urgency & Pressure",
        severity="HIGH",
        weight=22.0,
        patterns=[
            r"\b(account|access|service)\s+(will\s+be|has\s+been)\s+(suspended|terminated|disabled|locked|closed|deactivated)\b",
            r"\b(legal\s+action|law\s+enforcement|subpoena|arrest\s+warrant|police\s+involvement)\b",
            r"\b(permanent\s+loss\s+of\s+access|avoid\s+service\s+interruption)\b",
        ],
        explanation="Threats of account deactivation or punitive legal measures intimidate users into complying with unauthorized instructions.",
    ),

    # 3. Financial Demands & BEC Lures
    PhishingRule(
        code="FIN_01",
        name="Unusual Financial Demands & Gift Cards",
        category="Financial Demand",
        severity="HIGH",
        weight=28.0,
        patterns=[
            r"\b(gift\s+card|apple\s+card|itunes\s+card|steam\s+card|google\s+play\s+card|vanilla\s+visa)\b",
            r"\b(wire\s+transfer|remit\s+payment|crypto|bitcoin|ethereum|western\s+union|moneygram)\b",
            r"\b(purchase\s+cards\s+for\s+clients|urgent\s+vendor\s+payment)\b",
        ],
        explanation="Demands for payment via non-standard channels like gift cards, cryptocurrency, or sudden wire changes are hallmarks of Business Email Compromise (BEC).",
    ),
    PhishingRule(
        code="FIN_02",
        name="Payroll & Direct Deposit Modification",
        category="Financial Demand",
        severity="HIGH",
        weight=25.0,
        patterns=[
            r"\b(direct\s+deposit|payroll\s+account|bank\s+details\s+for\s+paycheck|update\s+my\s+salary\s+account)\b",
            r"\b(wire\s+instructions\s+have\s+changed|new\s+invoice\s+routing)\b",
        ],
        explanation="Attempts to redirect payroll or vendor invoices to fraudulent accounts are prime objectives of spear-phishing campaigns.",
    ),

    # 4. Authority Impersonation & Pretexting
    PhishingRule(
        code="AUTH_01",
        name="Executive or High-Authority Impersonation",
        category="Authority Impersonation",
        severity="MEDIUM",
        weight=18.0,
        patterns=[
            r"\b(i\s+am\s+in\s+a\s+meeting|in\s+a\s+conference|busy\s+on\s+a\s+call|traveling\s+without\s+access)\b",
            r"\b(from\s+the\s+office\s+of\s+the\s+(ceo|director|president|executive|board))\b",
            r"\b(quick\s+favor\s+for\s+me|need\s+you\s+to\s+handle\s+this\s+discreetly)\b",
        ],
        explanation="Pretexting as an executive in an unavailable state pressures subordinates to bypass standard financial and verification controls.",
    ),
    PhishingRule(
        code="AUTH_02",
        name="IT Helpdesk / Security Team Impersonation",
        category="Authority Impersonation",
        severity="MEDIUM",
        weight=20.0,
        patterns=[
            r"\b(it\s+support|helpdesk|global\s+security\s+team|system\s+administrator|microsoft\s+365\s+team|google\s+workspace\s+admin)\b",
            r"\b(mandatory\s+security\s+patch|it\s+compliance\s+update|vpn\s+configuration\s+change|server\s+migration)\b",
        ],
        explanation="Impersonating internal IT or technical support builds false trust, facilitating credential collection or remote desktop tool installations.",
    ),

    # 5. Secrecy & Channel Diversion
    PhishingRule(
        code="SEC_01",
        name="Secrecy Requests & Process Circumvention",
        category="Secrecy Tactics",
        severity="HIGH",
        weight=24.0,
        patterns=[
            r"\b(keep\s+this\s+(confidential|secret|between\s+us))\b",
            r"\b(do\s+not\s+(call|contact|mention|discuss\s+with)\s+(anyone|other\s+staff|hr|it))\b",
            r"\b(bypass|skip)\s+the\s+(normal|standard|regular)\s+(procedure|process|approval)\b",
            r"\b(reach\s+me\s+only\s+on\s+this\s+(whatsapp|number|telegram|personal\s+email))\b",
        ],
        explanation="Social engineers instruct victims not to consult colleagues or follow official authorization channels to isolate them from second-opinion defenses.",
    ),

    # 6. Unrealistic Lures & Advance Fee Fraud
    PhishingRule(
        code="LURE_01",
        name="Unrealistic Prizes, Inheritances & Grants",
        category="Lures & Rewards",
        severity="MEDIUM",
        weight=20.0,
        patterns=[
            r"\b(congratulations|you\s+have\s+won|lottery|lucky\s+winner|unclaimed\s+funds|inheritance)\b",
            r"\b(million\s+dollars|grant\s+allocation|compensation\s+sum|exclusive\s+cash\s+reward)\b",
            r"\b(claim\s+your\s+prize|pay\s+a\s+small\s+processing\s+fee)\b",
        ],
        explanation="Advance-fee fraud tempts victims with nonexistent wealth or prizes in exchange for personal information or upfront processing fees.",
    ),

    # 7. Suspicious Links & Obfuscation
    PhishingRule(
        code="LINK_01",
        name="Suspicious Embedded Links or Shorteners",
        category="Suspicious Links",
        severity="MEDIUM",
        weight=18.0,
        patterns=[
            r"https?://(?:bit\.ly|tinyurl\.com|t\.co|is\.gd|cutt\.ly|ow\.ly)/\S+",
            r"https?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b",
            r"hxxps?://\S+",
            r"https?://\S+\.(?:xyz|top|tk|ga|cf|gq|buzz|club|cam|work)/\S*",
            r"\b(click\s+(here|this\s+link|below)|tap\s+the\s+link|open\s+the\s+attachment)\b",
        ],
        explanation="Phishing campaigns frequently disguise destination URLs using link shorteners, IP-address links, or suspicious low-reputation top-level domains.",
    ),

    # 8. Impersonal / Mismatched Salutations
    PhishingRule(
        code="GREET_01",
        name="Generic or Impersonal Greeting",
        category="Linguistic Anomalies",
        severity="LOW",
        weight=8.0,
        patterns=[
            r"\b(dear\s+(customer|user|account\s+holder|sir/madam|member|valued\s+client))\b",
            r"\b(undisclosed-recipients|attention\s+beneficiary)\b",
        ],
        explanation="Mass phishing templates often use generic salutations because the sender lacks verified personal contact details.",
    ),
]


class MessageDetector:
    """
    Modular, deterministic, explainable rule-based social engineering detector.
    Designed with hooks to plug in ML/NLP classifiers.
    """

    def __init__(self, rules: List[PhishingRule] = RULES):
        self.rules = rules

    def analyze(self, text: str, channel: str = "email") -> Dict[str, Any]:
        text_clean = text.strip()
        if not text_clean:
            return self._empty_result()

        findings: List[Finding] = []
        raw_score = 0.0
        categories_triggered = set()
        matched_rule_codes = []

        # Evaluate all modular rules
        for rule in self.rules:
            matched, snippets = rule.evaluate(text_clean)
            if matched:
                findings.append(
                    Finding(
                        indicator=rule.name,
                        severity=rule.severity,
                        explanation=rule.explanation,
                        snippet=", ".join(snippets[:3]),
                        category=rule.category,
                    )
                )
                raw_score += rule.weight
                categories_triggered.add(rule.category)
                matched_rule_codes.append(rule.code)

        # Contextual synergy adjustments (multi-indicator combos)
        # Urgency combined with Credential Harvesting is a prime phishing signature
        has_urgency = "Urgency & Pressure" in categories_triggered
        has_cred = "Credential Harvesting" in categories_triggered
        has_fin = "Financial Demand" in categories_triggered
        has_auth = "Authority Impersonation" in categories_triggered
        has_secrecy = "Secrecy Tactics" in categories_triggered

        synergy_bonus = 0.0
        if has_urgency and has_cred:
            synergy_bonus += 16.0
        if has_urgency and has_fin:
            synergy_bonus += 14.0
        if has_auth and (has_fin or has_cred or has_secrecy):
            synergy_bonus += 15.0
        if has_secrecy and (has_fin or has_auth):
            synergy_bonus += 18.0

        # Cap score at 100.0, floor at 0.0
        final_score = min(100.0, max(0.0, raw_score + synergy_bonus))

        # Risk level categorization
        if final_score >= 65.0:
            risk_level = "HIGH"
        elif final_score >= 30.0:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        # Categorize primary threat vector
        primary_category = self._determine_primary_category(categories_triggered, final_score)

        # Generate actionable, explainable recommendations
        recommendations = self._generate_recommendations(risk_level, categories_triggered)

        # Create SHA-256 hash for deduplication/tracking
        content_hash = hashlib.sha256(text_clean.encode("utf-8")).hexdigest()

        # Create privacy-preserving redacted preview
        preview = self._create_redacted_preview(text_clean)

        confidence_notice = (
            "Heuristic scoring assesses linguistic structures, psychological manipulation techniques, "
            "and threat indicators deterministically. Scores reflect risk probability based on known social "
            "engineering signatures; they do not constitute definitive forensic proof of malice."
        )

        return {
            "analysis_type": "message",
            "score": round(final_score, 1),
            "risk_level": risk_level,
            "category": primary_category,
            "findings": findings,
            "recommendations": recommendations,
            "content_preview": preview,
            "content_hash": content_hash,
            "confidence_notice": confidence_notice,
            "metrics": {
                "character_count": len(text_clean),
                "word_count": len(text_clean.split()),
                "indicators_detected": len(findings),
                "categories_triggered_count": len(categories_triggered),
                "synergy_bonus_applied": round(synergy_bonus, 1),
                "channel_evaluated": channel,
            },
        }

    def _determine_primary_category(self, categories: set, score: float) -> str:
        if score < 30.0:
            return "Benign / Low Suspicion"
        if "Credential Harvesting" in categories:
            return "Credential Phishing"
        if "Financial Demand" in categories and "Authority Impersonation" in categories:
            return "Business Email Compromise (BEC)"
        if "Financial Demand" in categories:
            return "Financial Fraud / Scam"
        if "Authority Impersonation" in categories:
            return "Executive Impersonation / Pretexting"
        if "Lures & Rewards" in categories:
            return "Advance Fee / Reward Lure"
        if "Urgency & Pressure" in categories:
            return "Coercive Phishing"
        if "Suspicious Links" in categories:
            return "Malicious Link Delivery"
        return "Suspicious Message"

    def _generate_recommendations(self, risk_level: str, categories: set) -> List[str]:
        recs = []
        if risk_level == "HIGH":
            recs.append("Do NOT click any links, open attachments, or reply to the sender.")
            if "Credential Harvesting" in categories:
                recs.append("Never provide passwords, verification codes, or MFA tokens under any circumstance.")
            if "Financial Demand" in categories:
                recs.append("Halt any payment, gift card purchase, or payroll account modification immediately.")
            recs.append("Verify the alleged request out-of-band using an officially published phone number or internal directory.")
            recs.append("Report this message directly to your organization's IT Security / SOC department.")
        elif risk_level == "MEDIUM":
            recs.append("Exercise heightened caution: verify the sender's identity before taking requested action.")
            recs.append("Inspect links carefully by hovering without clicking to observe the actual destination domain.")
            recs.append("Confirm any urgent deadlines through a separate, trusted communication channel.")
        else:
            recs.append("No immediate high-risk indicators were detected in this message.")
            recs.append("Continue to maintain standard security awareness: verify unfamiliar senders and avoid unsolicited attachments.")
        return recs

    def _create_redacted_preview(self, text: str) -> str:
        # Strip multiple whitespaces
        cleaned = re.sub(r"\s+", " ", text).strip()
        # Redact potential email addresses
        cleaned = re.sub(r"[\w\.-]+@[\w\.-]+", "[REDACTED_EMAIL]", cleaned)
        # Redact potential phone numbers
        cleaned = re.sub(r"\+?\d[\d -]{8,}\d", "[REDACTED_PHONE]", cleaned)
        if len(cleaned) > 110:
            return cleaned[:107] + "..."
        return cleaned

    def _empty_result(self) -> Dict[str, Any]:
        return {
            "analysis_type": "message",
            "score": 0.0,
            "risk_level": "LOW",
            "category": "Empty Input",
            "findings": [],
            "recommendations": ["Enter or paste message content to initiate analysis."],
            "content_preview": "[Empty]",
            "content_hash": "",
            "confidence_notice": "No content evaluated.",
            "metrics": {"character_count": 0, "indicators_detected": 0},
        }

# Singleton instance
message_detector = MessageDetector()
