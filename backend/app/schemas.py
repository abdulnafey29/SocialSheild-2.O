from datetime import datetime
from typing import Optional, List, Any, Dict
from pydantic import BaseModel, Field, ConfigDict

# --- Common & Detection Schemas ---

class Finding(BaseModel):
    indicator: str
    severity: str  # "LOW", "MEDIUM", "HIGH"
    explanation: str
    snippet: Optional[str] = None
    category: Optional[str] = None

class MessageAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=3, max_length=10000, description="Pasted message or email content")
    channel: Optional[str] = Field("email", description="email, sms, chat, voice_transcript")

class UrlAnalysisRequest(BaseModel):
    url: str = Field(..., min_length=3, max_length=2048, description="URL to safely analyze offline")

class HeaderAnalysisRequest(BaseModel):
    raw_headers: str = Field(..., min_length=10, max_length=50000, description="Raw RFC 822 email headers")

class AnalysisResponse(BaseModel):
    id: Optional[int] = None
    analysis_type: str
    score: float
    risk_level: str  # "LOW", "MEDIUM", "HIGH"
    category: str
    findings: List[Finding]
    recommendations: List[str]
    content_preview: str
    confidence_notice: str
    created_at: datetime
    metrics: Optional[Dict[str, Any]] = None

class AnalysisHistoryItem(BaseModel):
    id: int
    analysis_type: str
    content_preview: str
    score: float
    risk_level: str
    category: str
    findings_count: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# --- Incident Schemas ---

class IncidentCreate(BaseModel):
    category: str = Field(..., min_length=2, max_length=100)
    description: str = Field(..., min_length=10, max_length=5000)
    channel: str = Field(..., min_length=2, max_length=50)
    incident_date: str = Field(..., min_length=4, max_length=50)
    clicked_link: bool = False
    shared_info: bool = False
    financial_loss: bool = False
    redacted_evidence: Optional[str] = Field(None, max_length=5000)

class IncidentStatusUpdate(BaseModel):
    status: str = Field(..., description="Submitted, Under Review, Investigating, Resolved, False Positive")
    admin_notes: Optional[str] = None

class IncidentResponse(BaseModel):
    id: int
    incident_ref: str
    category: str
    description: str
    channel: str
    incident_date: str
    clicked_link: bool
    shared_info: bool
    financial_loss: bool
    redacted_evidence: Optional[str]
    status: str
    admin_notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# --- Simulator & Training Schemas ---

class ScenarioOption(BaseModel):
    id: str
    text: str
    is_safe: bool
    score: int
    feedback: str
    manipulation_tactics: str
    red_flags: List[str]

class Scenario(BaseModel):
    id: str
    title: str
    channel: str  # "email", "sms", "phone", "chat", "job_portal", "pretexting"
    difficulty: str  # "Beginner", "Intermediate", "Advanced"
    sender_name: str
    sender_contact: str
    subject_or_prompt: Optional[str] = None
    message_content: str
    context_info: str
    options: List[ScenarioOption]
    key_takeaway: str

class ScenarioSubmitRequest(BaseModel):
    scenario_id: str
    chosen_option_id: str

class ScenarioSubmitResponse(BaseModel):
    scenario_id: str
    chosen_option_id: str
    is_safe: bool
    score_awarded: int
    feedback: str
    manipulation_tactics: str
    red_flags: List[str]
    safest_response: str
    overall_simulator_score: Optional[int] = None
    completed_scenarios_count: Optional[int] = None

class QuizQuestion(BaseModel):
    id: str
    question: str
    options: List[str]
    correct_option_index: int
    explanation: str

class LessonModule(BaseModel):
    key: str
    title: str
    category: str
    read_time_minutes: int
    summary: str
    threat_anatomy: str
    fictional_case_study: str
    warning_signs: List[str]
    prevention_checklist: List[str]
    quiz: List[QuizQuestion]

class QuizSubmitRequest(BaseModel):
    module_key: str
    answers: Dict[str, int]  # question_id -> chosen_index

class QuizSubmitResponse(BaseModel):
    module_key: str
    score: int
    total_questions: int
    passed: bool
    details: List[Dict[str, Any]]

class ProgressResponse(BaseModel):
    modules: Dict[str, Any]
    total_completed: int
    average_score: float
    total_modules: int

# --- Dashboard & Analytics Schemas ---

class SecurityTip(BaseModel):
    title: str
    content: str
    category: str
    action_item: str

class DashboardSummary(BaseModel):
    total_analyzed: int
    low_risk_count: int
    medium_risk_count: int
    high_risk_count: int
    quiz_completed_count: int
    quiz_average_score: float
    total_incidents: int
    recent_analyses: List[AnalysisHistoryItem]
    security_tip: SecurityTip

class AnalyticsOverview(BaseModel):
    risk_distribution: List[Dict[str, Any]]
    analysis_types: List[Dict[str, Any]]
    timeline: List[Dict[str, Any]]
    incident_channels: List[Dict[str, Any]]
    incident_statuses: List[Dict[str, Any]]
    quiz_performance: List[Dict[str, Any]]
