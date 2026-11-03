import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.database import get_db
from app.models import AnalysisRecord, IncidentReport, UserProgress
from app.schemas import DashboardSummary, AnalysisHistoryItem, SecurityTip
from app.data.lessons import LESSONS

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

SECURITY_TIPS = [
    SecurityTip(
        title="The Five-Second Security Pause",
        content="Social engineering attacks exploit acute emotional arousal (urgency, panic, curiosity) to bypass rational skepticism. Whenever a communication demands immediate action or threatens consequences, pause for five seconds and evaluate the sender out-of-band.",
        category="Psychological Defense",
        action_item="Never click links under urgent deadlines without verifying the sender via an independent channel."
    ),
    SecurityTip(
        title="HTTPS Does Not Guarantee Trustworthiness",
        content="A padlock icon and HTTPS only encrypt the communication between your browser and the remote server. Cybercriminals register free TLS/SSL certificates for phishing domains to deceive users.",
        category="Web Safety",
        action_item="Inspect the actual root domain name, not just the padlock symbol."
    ),
    SecurityTip(
        title="Beware of MFA Fatigue & Push Bombing",
        content="If you receive dozens of unexpected MFA push approval prompts late at night, an attacker already has your password and is trying to annoy you into approving access.",
        category="Authentication",
        action_item="Deny unexpected prompts immediately, report the anomaly to the SOC, and rotate your primary password."
    ),
    SecurityTip(
        title="The Golden Rule of Inbound Tech Support",
        content="Legitimate software providers (Microsoft, Apple, Google) do not make unsolicited phone calls to warn users that their computers are sending virus beacons.",
        category="Vishing Defense",
        action_item="Hang up immediately if an unsolicited caller asks you to install remote software (e.g. AnyDesk, TeamViewer)."
    )
]

@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(db: Session = Depends(get_db)):
    # Total analyses
    total_analyzed = db.query(func.count(AnalysisRecord.id)).scalar() or 0
    low_risk = db.query(func.count(AnalysisRecord.id)).filter(AnalysisRecord.risk_level == "LOW").scalar() or 0
    med_risk = db.query(func.count(AnalysisRecord.id)).filter(AnalysisRecord.risk_level == "MEDIUM").scalar() or 0
    high_risk = db.query(func.count(AnalysisRecord.id)).filter(AnalysisRecord.risk_level == "HIGH").scalar() or 0

    # Incident count
    total_incidents = db.query(func.count(IncidentReport.id)).scalar() or 0

    # User progress & quizzes
    completed_quizzes = db.query(func.count(UserProgress.id)).filter(UserProgress.completed == True).scalar() or 0
    avg_score = db.query(func.avg(UserProgress.quiz_score)).filter(UserProgress.completed == True).scalar() or 0.0

    # Recent analysis records
    recent_records = (
        db.query(AnalysisRecord)
        .order_by(desc(AnalysisRecord.created_at))
        .limit(6)
        .all()
    )

    recent_history = []
    for r in recent_records:
        try:
            f_count = len(json.loads(r.findings_json)) if r.findings_json else 0
        except Exception:
            f_count = 0
        recent_history.append(
            AnalysisHistoryItem(
                id=r.id,
                analysis_type=r.analysis_type,
                content_preview=r.content_preview,
                score=r.score,
                risk_level=r.risk_level,
                category=r.category,
                findings_count=f_count,
                created_at=r.created_at
            )
        )

    # Educational tip (can rotate based on hour or day)
    import random
    tip = random.choice(SECURITY_TIPS)

    return DashboardSummary(
        total_analyzed=total_analyzed,
        low_risk_count=low_risk,
        medium_risk_count=med_risk,
        high_risk_count=high_risk,
        quiz_completed_count=completed_quizzes,
        quiz_average_score=round(float(avg_score), 1),
        total_incidents=total_incidents,
        recent_analyses=recent_history,
        security_tip=tip
    )

@router.get("/security-tip", response_model=SecurityTip)
def get_security_tip():
    import random
    return random.choice(SECURITY_TIPS)
