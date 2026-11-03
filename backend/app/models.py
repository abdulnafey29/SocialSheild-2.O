from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime
from app.database import Base

class AnalysisRecord(Base):
    __tablename__ = "analysis_records"

    id = Column(Integer, primary_key=True, index=True)
    analysis_type = Column(String(50), nullable=False, index=True)  # message, url, email_header
    content_hash = Column(String(64), index=True)
    content_preview = Column(String(255), nullable=False)
    score = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False, index=True)  # LOW, MEDIUM, HIGH
    category = Column(String(100), default="General Suspicion")
    findings_json = Column(Text, nullable=False)  # Serialized list of findings
    recommendations_json = Column(Text, nullable=False)  # Serialized list of recommendations
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

class IncidentReport(Base):
    __tablename__ = "incident_reports"

    id = Column(Integer, primary_key=True, index=True)
    incident_ref = Column(String(32), unique=True, index=True, nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    channel = Column(String(50), nullable=False)
    incident_date = Column(String(50), nullable=False)
    clicked_link = Column(Boolean, default=False)
    shared_info = Column(Boolean, default=False)
    financial_loss = Column(Boolean, default=False)
    redacted_evidence = Column(Text, nullable=True)
    status = Column(String(50), default="Submitted", index=True)  # Submitted, Under Review, Investigating, Resolved, False Positive
    admin_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ScenarioAttempt(Base):
    __tablename__ = "scenario_attempts"

    id = Column(Integer, primary_key=True, index=True)
    scenario_id = Column(String(50), nullable=False, index=True)
    chosen_option_id = Column(String(50), nullable=False)
    is_safe = Column(Boolean, nullable=False)
    score_awarded = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    module_key = Column(String(100), unique=True, nullable=False, index=True)
    completed = Column(Boolean, default=False)
    quiz_score = Column(Integer, default=0)
    attempts_count = Column(Integer, default=0)
    last_attempt_at = Column(DateTime, default=datetime.utcnow)
