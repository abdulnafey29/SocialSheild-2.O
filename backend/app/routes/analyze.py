import json
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models import AnalysisRecord
from app.schemas import (
    MessageAnalysisRequest,
    UrlAnalysisRequest,
    HeaderAnalysisRequest,
    AnalysisResponse,
    AnalysisHistoryItem,
    Finding
)
from app.detectors.message_detector import message_detector
from app.detectors.url_detector import url_detector
from app.detectors.header_detector import header_detector

router = APIRouter(prefix="/api", tags=["Analysis"])

@router.post("/analyze/message", response_model=AnalysisResponse)
def analyze_message(req: MessageAnalysisRequest, db: Session = Depends(get_db)):
    if not req.text or len(req.text.strip()) < 3:
        raise HTTPException(status_code=400, detail="Message text is too short to analyze.")

    result = message_detector.analyze(req.text, channel=req.channel or "email")

    # Save to database
    record = AnalysisRecord(
        analysis_type=result["analysis_type"],
        content_hash=result["content_hash"],
        content_preview=result["content_preview"],
        score=result["score"],
        risk_level=result["risk_level"],
        category=result["category"],
        findings_json=json.dumps([f.model_dump() for f in result["findings"]]),
        recommendations_json=json.dumps(result["recommendations"]),
        created_at=datetime.utcnow()
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return AnalysisResponse(
        id=record.id,
        analysis_type=result["analysis_type"],
        score=result["score"],
        risk_level=result["risk_level"],
        category=result["category"],
        findings=result["findings"],
        recommendations=result["recommendations"],
        content_preview=result["content_preview"],
        confidence_notice=result["confidence_notice"],
        created_at=record.created_at,
        metrics=result["metrics"]
    )

@router.post("/analyze/url", response_model=AnalysisResponse)
def analyze_url(req: UrlAnalysisRequest, db: Session = Depends(get_db)):
    if not req.url or len(req.url.strip()) < 3:
        raise HTTPException(status_code=400, detail="URL is too short to analyze.")

    result = url_detector.analyze(req.url)

    record = AnalysisRecord(
        analysis_type=result["analysis_type"],
        content_hash=result["content_hash"],
        content_preview=result["content_preview"],
        score=result["score"],
        risk_level=result["risk_level"],
        category=result["category"],
        findings_json=json.dumps([f.model_dump() for f in result["findings"]]),
        recommendations_json=json.dumps(result["recommendations"]),
        created_at=datetime.utcnow()
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return AnalysisResponse(
        id=record.id,
        analysis_type=result["analysis_type"],
        score=result["score"],
        risk_level=result["risk_level"],
        category=result["category"],
        findings=result["findings"],
        recommendations=result["recommendations"],
        content_preview=result["content_preview"],
        confidence_notice=result["confidence_notice"],
        created_at=record.created_at,
        metrics=result["metrics"]
    )

@router.post("/analyze/email-header", response_model=AnalysisResponse)
def analyze_email_header(req: HeaderAnalysisRequest, db: Session = Depends(get_db)):
    if not req.raw_headers or len(req.raw_headers.strip()) < 10:
        raise HTTPException(status_code=400, detail="Raw headers too short to evaluate.")

    result = header_detector.analyze(req.raw_headers)

    record = AnalysisRecord(
        analysis_type=result["analysis_type"],
        content_hash=result["content_hash"],
        content_preview=result["content_preview"],
        score=result["score"],
        risk_level=result["risk_level"],
        category=result["category"],
        findings_json=json.dumps([f.model_dump() for f in result["findings"]]),
        recommendations_json=json.dumps(result["recommendations"]),
        created_at=datetime.utcnow()
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return AnalysisResponse(
        id=record.id,
        analysis_type=result["analysis_type"],
        score=result["score"],
        risk_level=result["risk_level"],
        category=result["category"],
        findings=result["findings"],
        recommendations=result["recommendations"],
        content_preview=result["content_preview"],
        confidence_notice=result["confidence_notice"],
        created_at=record.created_at,
        metrics=result["metrics"]
    )

@router.get("/analysis/history", response_model=List[AnalysisHistoryItem])
def get_analysis_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    analysis_type: Optional[str] = None,
    risk_level: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(AnalysisRecord)

    if analysis_type:
        query = query.filter(AnalysisRecord.analysis_type == analysis_type)
    if risk_level:
        query = query.filter(AnalysisRecord.risk_level == risk_level.upper())

    records = query.order_by(desc(AnalysisRecord.created_at)).offset(skip).limit(limit).all()

    items = []
    for r in records:
        try:
            findings = json.loads(r.findings_json) if r.findings_json else []
        except Exception:
            findings = []
        items.append(
            AnalysisHistoryItem(
                id=r.id,
                analysis_type=r.analysis_type,
                content_preview=r.content_preview,
                score=r.score,
                risk_level=r.risk_level,
                category=r.category,
                findings_count=len(findings),
                created_at=r.created_at
            )
        )
    return items

@router.get("/analysis/{record_id}", response_model=AnalysisResponse)
def get_analysis_detail(record_id: int, db: Session = Depends(get_db)):
    record = db.query(AnalysisRecord).filter(AnalysisRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis record not found.")

    findings_raw = json.loads(record.findings_json) if record.findings_json else []
    findings = [Finding(**f) for f in findings_raw]
    recommendations = json.loads(record.recommendations_json) if record.recommendations_json else []

    return AnalysisResponse(
        id=record.id,
        analysis_type=record.analysis_type,
        score=record.score,
        risk_level=record.risk_level,
        category=record.category,
        findings=findings,
        recommendations=recommendations,
        content_preview=record.content_preview,
        confidence_notice="Stored forensic analysis result.",
        created_at=record.created_at,
        metrics={"archived_id": record.id}
    )
