import csv
import io
import json
from datetime import datetime
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import AnalysisRecord, IncidentReport, UserProgress
from app.schemas import AnalyticsOverview
from app.data.lessons import LESSONS

router = APIRouter(prefix="/api/analytics", tags=["Analytics & Reports"])

@router.get("", response_model=AnalyticsOverview)
def get_analytics(db: Session = Depends(get_db)):
    # 1. Risk distribution
    risk_counts = (
        db.query(AnalysisRecord.risk_level, func.count(AnalysisRecord.id))
        .group_by(AnalysisRecord.risk_level)
        .all()
    )
    risk_dict = {"LOW": 0, "MEDIUM": 0, "HIGH": 0}
    for level, count in risk_counts:
        if level in risk_dict:
            risk_dict[level] = count

    risk_distribution = [
        {"name": "Low Risk", "value": risk_dict["LOW"], "color": "#10b981"},
        {"name": "Medium Risk", "value": risk_dict["MEDIUM"], "color": "#f59e0b"},
        {"name": "High Risk", "value": risk_dict["HIGH"], "color": "#ef4444"},
    ]

    # 2. Analysis Types
    type_counts = (
        db.query(AnalysisRecord.analysis_type, func.count(AnalysisRecord.id))
        .group_by(AnalysisRecord.analysis_type)
        .all()
    )
    analysis_types = [
        {"type": t.replace("_", " ").title(), "count": c}
        for t, c in type_counts
    ]

    # 3. Timeline / Activity (grouped by date)
    recent_records = (
        db.query(AnalysisRecord)
        .order_by(AnalysisRecord.created_at.asc())
        .all()
    )
    date_map = {}
    for r in recent_records:
        d_str = r.created_at.strftime("%b %d")
        if d_str not in date_map:
            date_map[d_str] = {"date": d_str, "high": 0, "medium": 0, "low": 0, "total": 0}
        date_map[d_str]["total"] += 1
        if r.risk_level == "HIGH":
            date_map[d_str]["high"] += 1
        elif r.risk_level == "MEDIUM":
            date_map[d_str]["medium"] += 1
        else:
            date_map[d_str]["low"] += 1

    timeline = list(date_map.values())[-10:] if date_map else []

    # 4. Incident channels
    channel_counts = (
        db.query(IncidentReport.channel, func.count(IncidentReport.id))
        .group_by(IncidentReport.channel)
        .all()
    )
    incident_channels = [
        {"channel": c, "count": cnt} for c, cnt in channel_counts
    ]

    # 5. Incident statuses
    status_counts = (
        db.query(IncidentReport.status, func.count(IncidentReport.id))
        .group_by(IncidentReport.status)
        .all()
    )
    incident_statuses = [
        {"status": s, "count": cnt} for s, cnt in status_counts
    ]

    # 6. Quiz Performance across lessons
    progress_records = {p.module_key: p for p in db.query(UserProgress).all()}
    quiz_performance = []
    for l in LESSONS:
        p = progress_records.get(l["key"])
        score = p.quiz_score if p else 0
        quiz_performance.append({
            "lesson": l["title"][:20] + "...",
            "score": score,
            "completed": p.completed if p else False
        })

    return AnalyticsOverview(
        risk_distribution=risk_distribution,
        analysis_types=analysis_types,
        timeline=timeline,
        incident_channels=incident_channels,
        incident_statuses=incident_statuses,
        quiz_performance=quiz_performance
    )

@router.get("/export/csv")
def export_summary_csv(db: Session = Depends(get_db)):
    records = db.query(AnalysisRecord).order_by(AnalysisRecord.created_at.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)

    # Header row (sanitized, non-sensitive)
    writer.writerow([
        "Record ID",
        "Analysis Type",
        "Category",
        "Risk Level",
        "Score",
        "Findings Count",
        "Created At (UTC)"
    ])

    for r in records:
        try:
            f_count = len(json.loads(r.findings_json)) if r.findings_json else 0
        except Exception:
            f_count = 0

        writer.writerow([
            r.id,
            r.analysis_type,
            r.category,
            r.risk_level,
            f"{r.score:.1f}",
            f_count,
            r.created_at.strftime("%Y-%m-%d %H:%M:%S")
        ])

    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=socialshield_analysis_export_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.csv"
        }
    )
