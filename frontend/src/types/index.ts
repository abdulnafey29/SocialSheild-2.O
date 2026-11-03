export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Finding {
  indicator: string;
  severity: RiskLevel;
  explanation: string;
  snippet?: string;
  category?: string;
}

export interface AnalysisMetrics {
  character_count?: number;
  word_count?: number;
  indicators_detected?: number;
  hostname?: string;
  scheme?: string;
  path?: string;
  is_ip_address?: boolean;
  tld?: string;
  from_email?: string;
  reply_to_email?: string;
  return_path_email?: string;
  subject?: string;
  spf_status?: string;
  dkim_status?: string;
  dmarc_status?: string;
  hop_count?: number;
  hops_summary?: string[];
  [key: string]: any;
}

export interface AnalysisResponse {
  id?: number;
  analysis_type: 'message' | 'url' | 'email_header';
  score: number;
  risk_level: RiskLevel;
  category: string;
  findings: Finding[];
  recommendations: string[];
  content_preview: string;
  confidence_notice: string;
  created_at: string;
  metrics?: AnalysisMetrics;
}

export interface AnalysisHistoryItem {
  id: number;
  analysis_type: string;
  content_preview: string;
  score: number;
  risk_level: RiskLevel;
  category: string;
  findings_count: number;
  created_at: string;
}

export interface SecurityTip {
  title: string;
  content: string;
  category: string;
  action_item: string;
}

export interface DashboardSummary {
  total_analyzed: number;
  low_risk_count: number;
  medium_risk_count: number;
  high_risk_count: number;
  quiz_completed_count: number;
  quiz_average_score: number;
  total_incidents: number;
  recent_analyses: AnalysisHistoryItem[];
  security_tip: SecurityTip;
}

export interface ScenarioOption {
  id: string;
  text: string;
  is_safe: boolean;
  score: number;
  feedback: string;
  manipulation_tactics: string;
  red_flags: string[];
}

export interface Scenario {
  id: string;
  title: string;
  channel: 'email' | 'sms' | 'phone' | 'chat' | 'job_portal' | 'pretexting';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  sender_name: string;
  sender_contact: string;
  subject_or_prompt?: string;
  message_content: string;
  context_info: string;
  options: ScenarioOption[];
  key_takeaway: string;
}

export interface ScenarioSubmitResponse {
  scenario_id: string;
  chosen_option_id: string;
  is_safe: boolean;
  score_awarded: number;
  feedback: string;
  manipulation_tactics: string;
  red_flags: string[];
  safest_response: string;
  overall_simulator_score?: number;
  completed_scenarios_count?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_option_index: number;
  explanation: string;
}

export interface LessonModule {
  key: string;
  title: string;
  category: string;
  read_time_minutes: number;
  summary: string;
  threat_anatomy: string;
  fictional_case_study: string;
  warning_signs: string[];
  prevention_checklist: string[];
  quiz: QuizQuestion[];
}

export interface QuizSubmitResponse {
  module_key: string;
  score: number;
  total_questions: number;
  passed: boolean;
  details: {
    question_id: string;
    question_text: string;
    user_choice: number;
    correct_choice: number;
    is_correct: boolean;
    explanation: string;
  }[];
}

export interface ProgressResponse {
  modules: Record<string, {
    completed: boolean;
    quiz_score: number;
    attempts: number;
    last_attempt_at: string | null;
  }>;
  total_completed: number;
  average_score: number;
  total_modules: number;
}

export interface IncidentReport {
  id: number;
  incident_ref: string;
  category: string;
  description: string;
  channel: string;
  incident_date: string;
  clicked_link: boolean;
  shared_info: boolean;
  financial_loss: boolean;
  redacted_evidence?: string;
  status: 'Submitted' | 'Under Review' | 'Investigating' | 'Resolved' | 'False Positive';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsOverview {
  risk_distribution: { name: string; value: number; color: string }[];
  analysis_types: { type: string; count: number }[];
  timeline: { date: string; high: number; medium: number; low: number; total: number }[];
  incident_channels: { channel: string; count: number }[];
  incident_statuses: { status: string; count: number }[];
  quiz_performance: { lesson: string; score: number; completed: boolean }[];
}
