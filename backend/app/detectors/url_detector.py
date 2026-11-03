import re
import urllib.parse
import ipaddress
import hashlib
from typing import Dict, Any, List
from app.schemas import Finding

# Well-known reputable domains often targeted for lookalike / subdomain spoofing
COMMON_BRANDS = [
    "paypal", "google", "microsoft", "apple", "amazon", "netflix",
    "facebook", "instagram", "chase", "wellsfargo", "bankofamerica",
    "citibank", "dropbox", "github", "linkedin", "office365", "outlook"
]

# High-abuse TLDs frequently observed in phishing / disposable domains
SUSPICIOUS_TLDS = {
    "xyz", "top", "tk", "ml", "ga", "cf", "gq", "buzz", "club",
    "cam", "work", "stream", "icu", "loan", "men", "racing", "date"
}

# Known URL Shortener Domains
KNOWN_SHORTENERS = {
    "bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "ow.ly",
    "rb.gy", "rebrand.ly", "shorturl.at", "bl.ink", "tiny.cc"
}

# Suspicious file extensions in URL path
DANGEROUS_EXTENSIONS = {
    ".exe", ".scr", ".bat", ".vbs", ".cmd", ".msi", ".jar", ".apk",
    ".iso", ".img", ".ps1", ".hta", ".wsf"
}

class UrlDetector:
    """
    Safe, offline, deterministic URL heuristic analyzer.
    DOES NOT perform network requests, DNS queries, or content downloading to prevent SSRF and active exploitation.
    """

    def analyze(self, raw_url: str) -> Dict[str, Any]:
        raw_url = raw_url.strip()
        if not raw_url:
            return self._empty_result()

        # Prepend scheme if missing so urllib parses correctly
        has_original_scheme = bool(re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*://", raw_url))
        url_to_parse = raw_url if has_original_scheme else f"http://{raw_url}"

        try:
            parsed = urllib.parse.urlsplit(url_to_parse)
        except Exception as e:
            return {
                "analysis_type": "url",
                "score": 80.0,
                "risk_level": "HIGH",
                "category": "Malformed URL",
                "findings": [
                    Finding(
                        indicator="Invalid URL Syntax",
                        severity="HIGH",
                        explanation=f"URL failed syntactic parsing: {str(e)}",
                        snippet=raw_url[:50]
                    )
                ],
                "recommendations": ["Do not attempt to load or open malformed URLs."],
                "content_preview": raw_url[:80],
                "content_hash": hashlib.sha256(raw_url.encode()).hexdigest(),
                "confidence_notice": "Syntactically invalid URL format.",
                "metrics": {"valid_syntax": False}
            }

        hostname = (parsed.hostname or "").lower()
        scheme = parsed.scheme.lower()
        path = parsed.path or ""
        netloc = parsed.netloc or ""

        findings: List[Finding] = []
        raw_score = 0.0

        # 1. Scheme Check (HTTP vs HTTPS)
        if scheme == "http":
            raw_score += 15.0
            findings.append(Finding(
                indicator="Unencrypted Connection (HTTP)",
                severity="MEDIUM",
                explanation=(
                    "This URL uses unencrypted HTTP. Data sent to this site can be intercepted "
                    "or modified by eavesdroppers on the network. Modern legitimate login portals virtually always require HTTPS."
                ),
                snippet=scheme
            ))
        elif scheme not in ("http", "https"):
            raw_score += 35.0
            findings.append(Finding(
                indicator="Unusual Protocol Scheme",
                severity="HIGH",
                explanation=f"Non-standard web protocol detected: '{scheme}://'. Attackers use unconventional schemes to execute local handlers.",
                snippet=scheme
            ))

        # 2. IP Address as Hostname Check (prevents domain reputation lookups)
        is_ip = False
        try:
            ipaddress.ip_address(hostname)
            is_ip = True
            raw_score += 35.0
            findings.append(Finding(
                indicator="Direct IP Address Host",
                severity="HIGH",
                explanation=(
                    f"The host '{hostname}' is a raw IP address rather than a registered domain name. "
                    "Legitimate organizations rarely use bare IP addresses for public web portals; this often bypasses domain reputation filters."
                ),
                snippet=hostname
            ))
        except ValueError:
            pass

        # 3. Userinfo / @ symbol in Authority Check (credential trickery)
        if "@" in netloc:
            raw_score += 40.0
            username_part = netloc.split("@")[0]
            findings.append(Finding(
                indicator="User Information Confusion (URL Auth Trick)",
                severity="HIGH",
                explanation=(
                    f"The URL contains '@' in the authority section ('{username_part}@'). Browsers treat text "
                    "before '@' as credentials, routing to the host AFTER '@'. Attackers craft URLs like 'https://google.com@evil-site.com' to mislead users."
                ),
                snippet=f"@{hostname}"
            ))

        # 4. URL Shortener Detection
        if any(shortener in hostname for shortener in KNOWN_SHORTENERS):
            raw_score += 20.0
            findings.append(Finding(
                indicator="URL Shortening Service",
                severity="MEDIUM",
                explanation=(
                    f"'{hostname}' is a known URL shortener. Shorteners mask the actual destination server, "
                    "preventing preview inspection and often hiding phishing redirects."
                ),
                snippet=hostname
            ))

        # 5. Domain & Subdomain Structure Analysis
        domain_parts = hostname.split(".")
        tld = domain_parts[-1] if len(domain_parts) > 1 else ""

        # Excessive Subdomains
        if len(domain_parts) > 4:
            raw_score += 25.0
            findings.append(Finding(
                indicator="Excessive Subdomain Nesting",
                severity="HIGH",
                explanation=(
                    f"The hostname contains {len(domain_parts)} label segments ({hostname}). "
                    "Excessive nesting is frequently used to construct deceptive URLs where trusted brand names appear in subdomains."
                ),
                snippet=hostname
            ))

        # Suspicious / High-Abuse TLDs
        if tld in SUSPICIOUS_TLDS:
            raw_score += 22.0
            findings.append(Finding(
                indicator="High-Abuse Top-Level Domain (TLD)",
                severity="MEDIUM",
                explanation=(
                    f"The domain ends with '.{tld}', a top-level domain frequently utilized in automated spam "
                    "and disposable malicious infrastructure due to cheap or free registrar pricing."
                ),
                snippet=f".{tld}"
            ))

        # Misleading Brand in Subdomain (e.g. paypal.com.verify-user.xyz)
        registered_domain = ".".join(domain_parts[-2:]) if len(domain_parts) >= 2 else hostname
        for brand in COMMON_BRANDS:
            if brand in hostname:
                # If brand appears in hostname but registered domain does not match brand
                if not (registered_domain == f"{brand}.com" or registered_domain == f"{brand}.org" or registered_domain.startswith(f"{brand}.")):
                    raw_score += 35.0
                    findings.append(Finding(
                        indicator=f"Misleading Brand Subdomain ({brand.title()})",
                        severity="HIGH",
                        explanation=(
                            f"The trusted brand name '{brand}' is present in the subdomain or hostname, "
                            f"but the actual registered root domain is '{registered_domain}'. This is a classic brand impersonation pattern."
                        ),
                        snippet=hostname
                    ))
                    break

        # Typosquatting / Character Substitution (e.g. paypa1, micr0soft, go0gle)
        typosquat_pattern = re.search(r"(paypa[1l]|micr[0o]s[0o]ft|g[0o]{2}gle|app[1l]e|am[a4]z[0o]n)", hostname)
        if typosquat_pattern:
            matched_squat = typosquat_pattern.group(0)
            if not any(hostname.endswith(f"{b}.com") for b in COMMON_BRANDS):
                raw_score += 30.0
                findings.append(Finding(
                    indicator="Suspected Typosquatting / Lookalike Token",
                    severity="HIGH",
                    explanation=(
                        f"The token '{matched_squat}' resembles a prominent protected brand with character substitution or slight alteration."
                    ),
                    snippet=matched_squat
                ))

        # Repeated Hyphens in Hostname (common in phishing campaigns, e.g., login-secure-account-update)
        if hostname.count("-") >= 2:
            raw_score += 15.0
            findings.append(Finding(
                indicator="Multiple Hyphens in Hostname",
                severity="MEDIUM",
                explanation=f"Hostname contains {hostname.count('-')} hyphens ({hostname}), often used to mimic complex official domain paths.",
                snippet=hostname
            ))

        # Obfuscated / Encoded Characters in URL Path or Host
        if "%" in raw_url or "\\x" in raw_url:
            raw_score += 20.0
            findings.append(Finding(
                indicator="Percent-Encoded or Obfuscated Characters",
                severity="MEDIUM",
                explanation="The URL contains encoded character sequences that may be designed to evade lexical filters and disguise the true destination.",
                snippet=raw_url[:60]
            ))

        # Punycode / Internationalized Domain Names (IDN Homograph risk)
        if "xn--" in hostname:
            raw_score += 25.0
            findings.append(Finding(
                indicator="Punycode / IDN Homograph Hostname",
                severity="HIGH",
                explanation=(
                    f"Hostname uses Punycode encoding ('{hostname}'). While valid for international scripts, "
                    "Punycode is frequently abused for homograph attacks where Cyrillic or Greek glyphs visually mimic ASCII letters."
                ),
                snippet=hostname
            ))

        # Dangerous Executable File Extension in Path
        lowered_path = path.lower()
        for ext in DANGEROUS_EXTENSIONS:
            if lowered_path.endswith(ext) or f"{ext}?" in lowered_path:
                raw_score += 55.0
                findings.append(Finding(
                    indicator=f"Dangerous Executable Target ({ext})",
                    severity="HIGH",
                    explanation=f"The URL path directly points to an executable or script download file format ({ext}), presenting a direct malware delivery risk.",
                    snippet=ext
                ))
                break

        # Calculate final risk score
        final_score = min(100.0, max(0.0, raw_score))

        if final_score >= 65.0:
            risk_level = "HIGH"
        elif final_score >= 30.0:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        category = self._determine_category(findings, final_score)
        recommendations = self._generate_recommendations(risk_level, findings)

        content_hash = hashlib.sha256(raw_url.encode("utf-8")).hexdigest()

        confidence_notice = (
            "Static lexical URL analysis evaluates syntactic indicators, hostname structure, "
            "and known social engineering patterns. IMPORTANT: HTTPS indicates transport encryption, NOT site trustworthiness. "
            "SocialShield 2.0 performs 100% offline heuristic analysis; no remote connections are initiated."
        )

        return {
            "analysis_type": "url",
            "score": round(final_score, 1),
            "risk_level": risk_level,
            "category": category,
            "findings": findings,
            "recommendations": recommendations,
            "content_preview": raw_url if len(raw_url) <= 80 else raw_url[:77] + "...",
            "content_hash": content_hash,
            "confidence_notice": confidence_notice,
            "metrics": {
                "hostname": hostname,
                "scheme": scheme,
                "path": path,
                "is_ip_address": is_ip,
                "tld": tld,
                "subdomain_count": len(domain_parts) - 2 if len(domain_parts) >= 2 else 0,
                "has_https": scheme == "https",
                "indicators_count": len(findings)
            }
        }

    def _determine_category(self, findings: List[Finding], score: float) -> str:
        if score < 30.0:
            return "Low Suspicion URL"
        indicators = [f.indicator for f in findings]
        if any("Brand Subdomain" in i or "Typosquatting" in i for i in indicators):
            return "Brand Spoofing / Impersonation"
        if any("Dangerous Executable" in i for i in indicators):
            return "Malware Payload Delivery"
        if any("Direct IP" in i for i in indicators):
            return "Host Evasion (IP Address)"
        if any("Shortening" in i for i in indicators):
            return "Obfuscated / Shortened Link"
        if any("User Information" in i for i in indicators):
            return "URL Auth Phishing Trick"
        return "Suspicious URL Structure"

    def _generate_recommendations(self, risk_level: str, findings: List[Finding]) -> List[str]:
        recs = []
        if risk_level == "HIGH":
            recs.append("Do NOT visit, click, or submit credentials to this URL under any circumstance.")
            recs.append("Do not download files or run scripts if prompted by this destination.")
            recs.append("Report the URL to your network administrator or security operations team for domain blocking.")
        elif risk_level == "MEDIUM":
            recs.append("Proceed with high caution: do not enter passwords or payment details.")
            recs.append("Verify the root domain directly by searching the official organization's website.")
            recs.append("Remember: a valid green padlock / HTTPS means encryption in transit, but phishing sites use HTTPS too.")
        else:
            recs.append("Syntactic structure aligns with normal web patterns.")
            recs.append("Always verify the site address bar matches the intended service before logging in.")
        return recs

    def _empty_result(self) -> Dict[str, Any]:
        return {
            "analysis_type": "url",
            "score": 0.0,
            "risk_level": "LOW",
            "category": "Empty Input",
            "findings": [],
            "recommendations": ["Enter a URL to safely evaluate its structure."],
            "content_preview": "[Empty URL]",
            "content_hash": "",
            "confidence_notice": "No URL entered.",
            "metrics": {}
        }

url_detector = UrlDetector()
