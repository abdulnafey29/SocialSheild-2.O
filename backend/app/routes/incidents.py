import random
import string
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models import IncidentReport
from app.schemas import (
    IncidentCreate,
    IncidentResponse,
    IncidentStatusUpdate
)

router = APIRouter(prefix="/api/incidents", tags=["Incident Reports"])

VALID_STATUSES = ["Submitted", "Under Review", "Investigating", "Resolved", "False Positive"]

def generate_incident_ref() -> str:
    random_token = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
    year = datetime.utcnow().year
    return f"INC-{year}-{random_token}"

@router.post("", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
def submit_incident(req: IncidentCreate, db: Session = Depends(get_db)):
    ref = generate_incident_ref()
    # Ensure uniqueness
    while db.query(IncidentReport).filter(IncidentReport.incident_ref == ref).first():
        ref = generate_incident_ref()

    now = datetime.utcnow()
    incident = IncidentReport(
        incident_ref=ref,
        category=req.category,
        description=req.description,
        channel=req.channel,
        incident_date=req.incident_date,
        clicked_link=req.clicked_link,
        shared_info=req.shared_info,
        financial_loss=req.financial_loss,
        redacted_evidence=req.redacted_evidence,
        status="Submitted",
        admin_notes="Initial triage pending.",
        created_at=now,
        updated_at=now
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident

@router.get("", response_model=List[IncidentResponse])
def list_incidents(
    skip: int = Query(0, ge=0),
    limit: int = Query(25, ge=1, le=100),
    status_filter: Optional[str] = None,
    channel_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(IncidentReport)
    if status_filter:
        query = query.filter(IncidentReport.status == status_filter)
    if channel_filter:
        query = query.filter(IncidentReport.channel == channel_filter)

    return query.order_by(desc(IncidentReport.created_at)).offset(skip).limit(limit).all()

@router.get("/{incident_id}", response_model=IncidentResponse)
def get_incident(incident_id: int, db: Session = Depends(get_db)):
    incident = db.query(IncidentReport).filter(IncidentReport.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident report not found.")
    return incident

@router.patch("/{incident_id}", response_model=IncidentResponse)
def update_incident_status(
    incident_id: int,
    req: IncidentStatusUpdate,
    db: Session = Depends(get_db)
):
    incident = db.query(IncidentReport).filter(IncidentReport.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident report not found.")

    if req.status not in VALID_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status '{req.status}'. Allowed: {', '.join(VALID_STATUSES)}"
        )

    incident.status = req.status
    if req.admin_notes is not None:
        incident.admin_notes = req.admin_notes
    incident.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(incident)
    return incident
