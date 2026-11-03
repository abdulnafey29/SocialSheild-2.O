import {
  AnalysisResponse,
  AnalysisHistoryItem,
  DashboardSummary,
  Scenario,
  ScenarioSubmitResponse,
  LessonModule,
  QuizSubmitResponse,
  ProgressResponse,
  IncidentReport,
  AnalyticsOverview
} from '../types';

const API_BASE = '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      let errorMsg = `Server error (${res.status})`;
      try {
        const errorJson = await res.json();
        if (errorJson.detail) {
          errorMsg = typeof errorJson.detail === 'string'
            ? errorJson.detail
            : JSON.stringify(errorJson.detail);
        }
      } catch {
        // use default errorMsg
      }
      throw new Error(errorMsg);
    }

    return await res.json();
  } catch (err: any) {
    if (err.message && err.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to SocialShield backend. Ensure FastAPI server is running on port 8000.');
    }
    throw err;
  }
}

export const api = {
  // Health
  checkHealth: () => request<{ status: string; service: string }>('/health'),

  // Dashboard
  getDashboardSummary: () => request<DashboardSummary>('/dashboard/summary'),
  getSecurityTip: () => request<{ title: string; content: string; category: string; action_item: string }>('/dashboard/security-tip'),

  // Analyses
  analyzeMessage: (text: string, channel: string = 'email') =>
    request<AnalysisResponse>('/analyze/message', {
      method: 'POST',
      body: JSON.stringify({ text, channel }),
    }),

  analyzeUrl: (url: string) =>
    request<AnalysisResponse>('/analyze/url', {
      method: 'POST',
      body: JSON.stringify({ url }),
    }),

  analyzeHeader: (raw_headers: string) =>
    request<AnalysisResponse>('/analyze/email-header', {
      method: 'POST',
      body: JSON.stringify({ raw_headers }),
    }),

  getHistory: (skip = 0, limit = 20, analysisType?: string, riskLevel?: string) => {
    const params = new URLSearchParams({ skip: skip.toString(), limit: limit.toString() });
    if (analysisType) params.append('analysis_type', analysisType);
    if (riskLevel) params.append('risk_level', riskLevel);
    return request<AnalysisHistoryItem[]>(`/analysis/history?${params.toString()}`);
  },

  getAnalysisDetail: (id: number) => request<AnalysisResponse>(`/analysis/${id}`),

  // Training & Simulator
  getScenarios: () => request<Scenario[]>('/training/scenarios'),
  submitScenarioAnswer: (scenario_id: string, chosen_option_id: string) =>
    request<ScenarioSubmitResponse>('/training/submit-answer', {
      method: 'POST',
      body: JSON.stringify({ scenario_id, chosen_option_id }),
    }),

  getLessons: () => request<LessonModule[]>('/training/modules'),
  submitQuiz: (module_key: string, answers: Record<string, number>) =>
    request<QuizSubmitResponse>('/training/submit-quiz', {
      method: 'POST',
      body: JSON.stringify({ module_key, answers }),
    }),

  getProgress: () => request<ProgressResponse>('/training/progress'),
  resetTraining: () =>
    request<{ status: string; message: string }>('/training/reset', {
      method: 'POST',
    }),

  // Incidents
  getIncidents: (statusFilter?: string) => {
    const params = new URLSearchParams();
    if (statusFilter) params.append('status_filter', statusFilter);
    return request<IncidentReport[]>(`/incidents?${params.toString()}`);
  },

  createIncident: (payload: {
    category: string;
    description: string;
    channel: string;
    incident_date: string;
    clicked_link: boolean;
    shared_info: boolean;
    financial_loss: boolean;
    redacted_evidence?: string;
  }) =>
    request<IncidentReport>('/incidents', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateIncidentStatus: (id: number, status: string, admin_notes?: string) =>
    request<IncidentReport>(`/incidents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, admin_notes }),
    }),

  // Analytics
  getAnalytics: () => request<AnalyticsOverview>('/analytics'),
  getExportCsvUrl: () => `${API_BASE}/analytics/export/csv`,
};
