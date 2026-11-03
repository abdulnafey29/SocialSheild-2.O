import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models import AnalysisRecord, IncidentReport, UserProgress, ScenarioAttempt
from app.data.lessons import LESSONS

def seed_database_if_empty(db: Session):
    # Check if analysis records exist
    if db.query(AnalysisRecord).first():
        return

    now = datetime.utcnow()

    # 1. Seed Analysis Records (Diverse mix of High, Medium, and Low risk)
    sample_analyses = [
        AnalysisRecord(
            analysis_type="message",
            content_hash="c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2",
            content_preview="URGENT: Your Corporate Microsoft 365 Account will be terminated in 2 hours...",
            score=92.5,
            risk_level="HIGH",
            category="Credential Phishing",
            findings_json=json.dumps([
                {"indicator": "Artificial Deadlines & Time Pressure", "severity": "HIGH", "explanation": "Threat of account suspension within 2 hours.", "snippet": "within 2 hours"},
                {"indicator": "Credential & Password Request", "severity": "HIGH", "explanation": "Prompt to verify enterprise credentials.", "snippet": "verify your credentials"},
                {"indicator": "IT Helpdesk Impersonation", "severity": "MEDIUM", "explanation": "Claims to be Microsoft 365 security team.", "snippet": "Microsoft 365 Team"}
            ]),
            recommendations_json=json.dumps([
                "Do NOT click links or supply credentials.",
                "Verify through official IT Helpdesk portal.",
                "Report message to organization SOC."
            ]),
            created_at=now - timedelta(hours=36)
        ),
        AnalysisRecord(
            analysis_type="url",
            content_hash="6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
            content_preview="http://paypal.com.verification-center-portal.xyz/login.php",
            score=88.0,
            risk_level="HIGH",
            category="Brand Spoofing / Impersonation",
            findings_json=json.dumps([
                {"indicator": "Misleading Brand Subdomain (Paypal)", "severity": "HIGH", "explanation": "Brand name present in subdomain while registered domain is verification-center-portal.xyz.", "snippet": "paypal.com.verification-center-portal.xyz"},
                {"indicator": "High-Abuse Top-Level Domain (TLD)", "severity": "MEDIUM", "explanation": "Domain ends with .xyz.", "snippet": ".xyz"},
                {"indicator": "Unencrypted Connection (HTTP)", "severity": "MEDIUM", "explanation": "Uses plaintext HTTP protocol.", "snippet": "http"}
            ]),
            recommendations_json=json.dumps([
                "Do not visit or provide credentials.",
                "Navigate directly to paypal.com in browser.",
                "Report domain to anti-phishing blacklists."
            ]),
            created_at=now - timedelta(hours=28)
        ),
        AnalysisRecord(
            analysis_type="message",
            content_hash="9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
            content_preview="David Sterling: Quick favor, I'm boarding a flight. Need 5x $100 Apple gift cards...",
            score=86.0,
            risk_level="HIGH",
            category="Business Email Compromise (BEC)",
            findings_json=json.dumps([
                {"indicator": "Executive Impersonation", "severity": "MEDIUM", "explanation": "Pretexting as CEO traveling on a flight.", "snippet": "boarding a flight"},
                {"indicator": "Unusual Financial Demands & Gift Cards", "severity": "HIGH", "explanation": "Request for gift card purchases.", "snippet": "Apple gift cards"},
                {"indicator": "Secrecy Requests", "severity": "HIGH", "explanation": "Directs employee to keep transaction confidential.", "snippet": "keep this between us"}
            ]),
            recommendations_json=json.dumps([
                "Do NOT purchase gift cards or send codes.",
                "Verify executive identity through official corporate telephone directory."
            ]),
            created_at=now - timedelta(hours=22)
        ),
        AnalysisRecord(
            analysis_type="url",
            content_hash="5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
            content_preview="https://bit.ly/exp-post-tracking98",
            score=42.0,
            risk_level="MEDIUM",
            category="Obfuscated / Shortened Link",
            findings_json=json.dumps([
                {"indicator": "URL Shortening Service", "severity": "MEDIUM", "explanation": "bit.ly masks the true destination host.", "snippet": "bit.ly"}
            ]),
            recommendations_json=json.dumps([
                "Use a URL expander tool before visiting.",
                "Verify package tracking directly on carrier website."
            ]),
            created_at=now - timedelta(hours=14)
        ),
        AnalysisRecord(
            analysis_type="email_header",
            content_hash="4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
            content_preview="From: security@chase.com | Reply-To: ticket-update@external-mail-relay.net",
            score=75.0,
            risk_level="HIGH",
            category="Email Header Spoofing / Auth Failure",
            findings_json=json.dumps([
                {"indicator": "From and Reply-To Domain Discrepancy", "severity": "HIGH", "explanation": "From claims @chase.com while Reply-To routes to external-mail-relay.net.", "snippet": "From: chase.com vs Reply-To: external-mail-relay.net"},
                {"indicator": "SPF Authentication Hard Fail", "severity": "HIGH", "explanation": "Sending server IP is not authorized in chase.com SPF record.", "snippet": "spf=fail"},
                {"indicator": "DMARC Policy Alignment Failure", "severity": "HIGH", "explanation": "Header domain does not align with SPF.", "snippet": "dmarc=fail"}
            ]),
            recommendations_json=json.dumps([
                "Treat message as spoofed.",
                "Do not respond to the Reply-To address."
            ]),
            created_at=now - timedelta(hours=9)
        ),
        AnalysisRecord(
            analysis_type="message",
            content_hash="ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
            content_preview="Weekly Engineering Sync: Hi team, please review tomorrow's sprint retrospective agenda...",
            score=12.0,
            risk_level="LOW",
            category="Benign / Low Suspicion",
            findings_json=json.dumps([]),
            recommendations_json=json.dumps([
                "No high-risk indicators detected.",
                "Maintain standard security hygiene."
            ]),
            created_at=now - timedelta(hours=5)
        ),
        AnalysisRecord(
            analysis_type="url",
            content_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            content_preview="https://docs.github.com/en/get-started",
            score=8.0,
            risk_level="LOW",
            category="Low Suspicion URL",
            findings_json=json.dumps([]),
            recommendations_json=json.dumps([
                "Standard web structure observed.",
                "Verify browser URL matches intended service."
            ]),
            created_at=now - timedelta(hours=2)
        )
    ]

    for record in sample_analyses:
        db.add(record)

    # 2. Seed Incident Reports
    sample_incidents = [
        IncidentReport(
            incident_ref="INC-2026-A101",
            category="Phishing Email",
            description="Received an email claiming to be from IT asking for immediate VPN credentials under threat of account lockout.",
            channel="Email",
            incident_date=datetime.utcnow().strftime("%Y-%m-%d 11:30"),
            clicked_link=False,
            shared_info=False,
            financial_loss=False,
            redacted_evidence="Subject: Urgent VPN Certificate Expiration. Link pointed to: vpn-synchronization-portal.net",
            status="Investigating",
            admin_notes="SOC verified phishing domain. Domain blocked at mail gateway.",
            created_at=now - timedelta(hours=18)
        ),
        IncidentReport(
            incident_ref="INC-2026-B204",
            category="Executive Impersonation / BEC",
            description="WhatsApp message received from unknown number with CEO's photo asking for $500 Apple gift cards for a board meeting.",
            channel="SMS / Messaging",
            incident_date=datetime.utcnow().strftime("%Y-%m-%d 09:15"),
            clicked_link=False,
            shared_info=False,
            financial_loss=False,
            redacted_evidence="Caller phone: +1 (312) 555-0189. Pretext: Traveling on flight to Zurich.",
            status="Resolved",
            admin_notes="Alert issued to finance team regarding CEO impersonation campaign.",
            created_at=now - timedelta(hours=12)
        ),
        IncidentReport(
            incident_ref="INC-2026-C312",
            category="Smishing SMS",
            description="Parcel delivery SMS claiming unpaid customs fee of $1.85 with shortened bit.ly link.",
            channel="SMS",
            incident_date=datetime.utcnow().strftime("%Y-%m-%d 14:00"),
            clicked_link=True,
            shared_info=False,
            financial_loss=False,
            redacted_evidence="SMS: ExpressPost Alert parcel #US-98214-X is on hold. Link: bit.ly/exp-post-tracking98",
            status="Under Review",
            admin_notes="User clicked link but closed window before entering payment details. Endpoint scanned; clean.",
            created_at=now - timedelta(hours=6)
        ),
        IncidentReport(
            incident_ref="INC-2026-D409",
            category="Vishing Call",
            description="Caller claiming to be Microsoft Support claiming our department router is emitting malware beacons.",
            channel="Phone Call",
            incident_date=datetime.utcnow().strftime("%Y-%m-%d 16:45"),
            clicked_link=False,
            shared_info=False,
            financial_loss=False,
            redacted_evidence="Caller ID: +1 (415) 555-0144. Requested installation of AnyDesk.",
            status="Submitted",
            admin_notes=None,
            created_at=now - timedelta(hours=1)
        )
    ]

    for inc in sample_incidents:
        db.add(inc)

    # 3. Seed User Progress for Lessons (Demonstrating initial completed progress)
    completed_keys = ["phishing-spearphishing", "smishing-vishing", "business-email-compromise"]
    for lesson in LESSONS:
        is_completed = lesson["key"] in completed_keys
        score = 100 if is_completed else 0
        attempts = 1 if is_completed else 0
        progress = UserProgress(
            module_key=lesson["key"],
            completed=is_completed,
            quiz_score=score,
            attempts_count=attempts,
            last_attempt_at=now - timedelta(hours=8) if is_completed else now
        )
        db.add(progress)

    # 4. Seed a few initial scenario attempts
    db.add(ScenarioAttempt(
        scenario_id="scenario-it-phish",
        chosen_option_id="opt-4",
        is_safe=True,
        score_awarded=100,
        created_at=now - timedelta(hours=20)
    ))
    db.add(ScenarioAttempt(
        scenario_id="scenario-sms-parcel",
        chosen_option_id="opt-3",
        is_safe=True,
        score_awarded=100,
        created_at=now - timedelta(hours=15)
    ))

    db.commit()
