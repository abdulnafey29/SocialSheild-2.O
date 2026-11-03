import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { IncidentReport } from '../types';
import { LoadingState } from '../components/common/LoadingState';
import { AlertNotice } from '../components/common/AlertNotice';
import {
  AlertTriangle,
  Send,
  CheckCircle2,
  Clock,
  Filter,
  Shield,
  Edit3,
  X,
  MessageSquare,
  Lock,
  Search,
  Tag
} from 'lucide-react';

const CATEGORIES = [
  'Phishing Email',
  'Smishing SMS',
  'Vishing Phone Call',
  'Malicious Website / Link',
  'Business Email Compromise (BEC)',
  'Credential Harvesting',
  'Other Social Engineering',
];

const CHANNELS = [
  'Email',
  'SMS',
  'Phone Call',
  'Messaging App (Slack/WhatsApp)',
  'Web Browser',
  'Physical / In-Person',
  'Other',
];

const STATUS_OPTIONS = [
  'Submitted',
  'Under Review',
  'Investigating',
  'Resolved',
  'False Positive',
];

export const IncidentsPage: React.FC = () => {
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form state
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [channel, setChannel] = useState(CHANNELS[0]);
  const [description, setDescription] = useState('');
  const [incidentDate, setIncidentDate] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16).replace('T', ' ');
  });
  const [clickedLink, setClickedLink] = useState(false);
  const [sharedInfo, setSharedInfo] = useState(false);
  const [financialLoss, setFinancialLoss] = useState(false);
  const [redactedEvidence, setRedactedEvidence] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<IncidentReport | null>(null);

  // Admin / Triage Modal State
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);
  const [modalStatus, setModalStatus] = useState('Submitted');
  const [modalNotes, setModalNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getIncidents();
      setIncidents(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch incident reports.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || description.trim().length < 10) {
      setError('Please provide a detailed incident narrative of at least 10 characters.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const newInc = await api.createIncident({
        category,
        channel,
        description,
        incident_date: incidentDate,
        clicked_link: clickedLink,
        shared_info: sharedInfo,
        financial_loss: financialLoss,
        redacted_evidence: redactedEvidence || undefined,
      });

      setSubmissionSuccess(newInc);
      setIncidents((prev) => [newInc, ...prev]);

      // Reset form fields
      setDescription('');
      setClickedLink(false);
      setSharedInfo(false);
      setFinancialLoss(false);
      setRedactedEvidence('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit incident report.');
    } finally {
      setSubmitting(false);
    }
  };

  const openAdminModal = (inc: IncidentReport) => {
    setSelectedIncident(inc);
    setModalStatus(inc.status);
    setModalNotes(inc.admin_notes || '');
  };

  const handleUpdateStatus = async () => {
    if (!selectedIncident) return;
    try {
      setUpdatingStatus(true);
      const updated = await api.updateIncidentStatus(selectedIncident.id, modalStatus, modalNotes);
      setIncidents((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setSelectedIncident(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update incident status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Under Review':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Investigating':
        return 'bg-violet-500/10 text-violet-400 border-violet-500/30';
      case 'Resolved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'False Positive':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const filteredIncidents = incidents.filter((inc) => {
    if (filterStatus === 'all') return true;
    return inc.status === filterStatus;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-mono mb-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>MODULE F • SECURITY OPERATIONS REPORTING PORTAL</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Security Incident Reporting & Triage Portal
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Submit suspicious messages or potential social engineering compromises for internal SOC review. Features simulated administrator triage and status lifecycle tracking.
        </p>
      </div>

      <AlertNotice type="info" title="Educational Demo Environment Notice">
        This is a local college demonstration reporting portal. It is strictly for academic and simulation purposes and does not connect to real institutional law enforcement or corporate ticketing backends. Never submit real passwords or active credentials.
      </AlertNotice>

      {/* Grid: Reporting Form + Incident Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Submit New Incident */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Send className="w-4 h-4 text-cyan-400" />
              Report Suspicious Incident
            </h3>

            {submissionSuccess && (
              <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-xs text-emerald-200 space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold font-mono text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  INCIDENT SUBMITTED SUCCESSFULLY!
                </div>
                <div>
                  Reference ID: <span className="font-mono font-bold text-white">{submissionSuccess.incident_ref}</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Your report has been logged and assigned to the triage queue.
                </p>
              </div>
            )}

            {error && (
              <AlertNotice type="error" title="Submission Error">
                {error}
              </AlertNotice>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              {/* Category */}
              <div>
                <label className="text-slate-300 block mb-1.5 font-semibold">
                  Incident Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-[#060a12] text-slate-200 focus:outline-none focus:border-cyan-500 font-sans text-xs"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Channel & Approximate Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1.5 font-semibold">
                    Delivery Channel
                  </label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-800 bg-[#060a12] text-slate-200 focus:outline-none focus:border-cyan-500 font-sans text-xs"
                  >
                    {CHANNELS.map((ch) => (
                      <option key={ch} value={ch}>
                        {ch}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1.5 font-semibold">
                    Approx Date & Time
                  </label>
                  <input
                    type="text"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    placeholder="YYYY-MM-DD HH:MM"
                    className="w-full p-2.5 rounded-xl border border-slate-800 bg-[#060a12] text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
              </div>

              {/* Description narrative */}
              <div>
                <label className="text-slate-300 block mb-1.5 font-semibold">
                  Incident Narrative & Description *
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what occurred, who the message claimed to be, and any unusual requests..."
                  required
                  className="w-full p-3 rounded-xl border border-slate-800 bg-[#060a12] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans text-xs"
                />
              </div>

              {/* Compromise Assessment Checkboxes */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
                <span className="text-[11px] text-slate-400 uppercase font-bold block">
                  Potential Exposure Checklist:
                </span>
                <div className="space-y-1.5 text-xs text-slate-300 font-sans">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={clickedLink}
                      onChange={(e) => setClickedLink(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0"
                    />
                    <span>Clicked any link or opened an attachment</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sharedInfo}
                      onChange={(e) => setSharedInfo(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0"
                    />
                    <span>Entered passwords, credentials, or personal info</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={financialLoss}
                      onChange={(e) => setFinancialLoss(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0"
                    />
                    <span>Financial funds or gift cards were sent</span>
                  </label>
                </div>
              </div>

              {/* Optional Redacted Evidence */}
              <div>
                <label className="text-slate-300 block mb-1.5 font-semibold">
                  Redacted Evidence / Message Snippet (Optional)
                </label>
                <textarea
                  rows={2}
                  value={redactedEvidence}
                  onChange={(e) => setRedactedEvidence(e.target.value)}
                  placeholder="Paste sanitized text or URL (do NOT include sensitive personal data)..."
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-[#060a12] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? 'Submitting Report...' : 'Submit Incident Report'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Log: Incident Triage Queue */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Incident Triage Queue
                </h3>
                <p className="text-xs text-slate-400">
                  Click an incident to open the administrative review modal
                </p>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 text-xs font-mono"
                >
                  <option value="all">All Statuses</option>
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <LoadingState message="Loading incident queue..." />
            ) : filteredIncidents.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No incident reports found matching this criteria.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredIncidents.map((inc) => (
                  <div
                    key={inc.id}
                    onClick={() => openAdminModal(inc)}
                    className="p-4 rounded-xl border border-slate-800/80 bg-[#060a12]/80 hover:border-slate-700 hover:bg-slate-900/60 transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-cyan-400 font-bold text-xs">
                          {inc.incident_ref}
                        </span>
                        <span className="text-slate-400 text-xs">• {inc.category}</span>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getStatusBadge(inc.status)}`}>
                        {inc.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2">
                      {inc.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                      <div className="flex items-center gap-3">
                        <span>Channel: {inc.channel}</span>
                        {(inc.clicked_link || inc.shared_info || inc.financial_loss) && (
                          <span className="text-rose-400 font-semibold">
                            ⚠️ Exposure Flags Present
                          </span>
                        )}
                      </div>
                      <span className="group-hover:text-cyan-400 transition-colors flex items-center gap-1">
                        <Edit3 className="w-3 h-3" /> Triage
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Triage Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#090e1c] border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                  ADMINISTRATIVE DEMO TRIAGE
                </span>
                <h3 className="text-base font-bold text-white">
                  {selectedIncident.incident_ref} • {selectedIncident.category}
                </h3>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-800 bg-[#060a12] space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">
                  INCIDENT DESCRIPTION
                </span>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {selectedIncident.description}
                </p>
              </div>

              {selectedIncident.redacted_evidence && (
                <div className="p-3 rounded-xl border border-slate-800 bg-[#060a12] space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">
                    REDACTED EVIDENCE
                  </span>
                  <p className="text-slate-300 font-mono text-[11px] truncate">
                    {selectedIncident.redacted_evidence}
                  </p>
                </div>
              )}

              {/* Status Update Selection */}
              <div>
                <label className="text-slate-300 block mb-1.5 font-semibold font-mono">
                  Update Incident Status:
                </label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Triage Notes */}
              <div>
                <label className="text-slate-300 block mb-1.5 font-semibold font-mono">
                  SOC Analyst Notes / Resolution Summary:
                </label>
                <textarea
                  rows={3}
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="Enter containment actions, domain blacklist confirmation, or triage comments..."
                  className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-500 text-xs font-sans focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-mono hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={updatingStatus}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold shadow-lg shadow-cyan-600/20"
              >
                {updatingStatus ? 'Updating...' : 'Save Triage Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
