import React, { useState } from 'react';
import { api } from '../api/client';
import { AnalysisResponse } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { ScoreGauge } from '../components/common/ScoreGauge';
import { FindingsList } from '../components/common/FindingsList';
import { AlertNotice } from '../components/common/AlertNotice';
import { LoadingState } from '../components/common/LoadingState';
import {
  MailWarning,
  Sparkles,
  RotateCcw,
  CheckCircle,
  ShieldCheck,
  ShieldAlert,
  Info,
  Copy,
  Hash
} from 'lucide-react';

const SAMPLE_MESSAGES = [
  {
    label: '1. High Risk: Urgent IT Helpdesk MFA Reset',
    channel: 'email',
    text: `URGENT ACTION REQUIRED: Corporate IT Security Alert\n\nYour Microsoft 365 multi-factor authentication (MFA) session has expired. To avoid permanent account suspension and loss of enterprise VPN access, you must verify your identity immediately.\n\nPlease click below to re-enter your password and confirm your active 2FA security code within 2 hours:\nhttps://corp-auth.vpn-synchronization-portal.net/mfa-reset\n\nIT Service Desk Operations`,
  },
  {
    label: '2. High Risk: CEO Urgent Gift Cards Pretexting (BEC)',
    channel: 'chat',
    text: `Hi, this is David Sterling (CEO). I'm currently boarding an international flight to Zurich and cannot talk on the phone. We have a last-minute closing meeting with our top partners and I need you to purchase 10x $100 Apple gift cards right now.\n\nScratch the backs and text me clear photos of the PIN codes here. Keep this strictly confidential and do not mention it to anyone in accounting—I'll handle reimbursement on Friday.`,
  },
  {
    label: '3. Medium/High Risk: SMS Parcel Delivery Exception',
    channel: 'sms',
    text: `ExpressPost Notice: Parcel #US-98214-X cannot be delivered due to an incorrect street address and an unpaid customs handling fee of $1.85. To avoid return to sender within 24 hours, update your billing address and settle the fee immediately: https://bit.ly/exp-post-tracking98`,
  },
  {
    label: '4. High Risk: Advance-Fee Lottery & Grant Lure',
    channel: 'email',
    text: `CONGRATULATIONS LUCKY WINNER! You have been selected as the sole recipient of the Global Commonwealth Grant allocation of $1,500,000.00 (One Million Five Hundred Thousand Dollars). To claim your cash reward, please reply with your full bank account routing number, SSN, and wire a $250 processing fee via Western Union.`,
  },
  {
    label: '5. Low Risk: Normal Weekly Team Sprint Sync',
    channel: 'email',
    text: `Hi team,\n\nSharing the agenda for tomorrow's sprint retrospective meeting at 10:00 AM in Conference Room B and on Google Meet.\n\nPlease review the attached backlog burndown chart and add your feedback points to the team Miro board before the call.\n\nThanks,\nSarah Jenkins\nEngineering Lead`,
  },
];

export const MessageDetectorPage: React.FC = () => {
  const [text, setText] = useState('');
  const [channel, setChannel] = useState('email');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  const maxChars = 10000;

  const handleAnalyze = async () => {
    if (!text || text.trim().length < 3) {
      setError('Please paste or type at least 3 characters of message content to evaluate.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await api.analyzeMessage(text, channel);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Error occurred while analyzing message.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setError(null);
  };

  const loadSample = (sampleText: string, sampleChannel: string) => {
    setText(sampleText);
    setChannel(sampleChannel);
    setResult(null);
    setError(null);
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Header title */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
          <MailWarning className="w-3.5 h-3.5" />
          <span>MODULE A • HEURISTIC LINGUISTIC DETECTOR</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Phishing & Social Engineering Message Detector
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Inspect email, SMS, or chat text for artificial urgency, credential harvesting, authority impersonation, and psychological manipulation lures.
        </p>
      </div>

      {/* Input panel */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
        {/* Sample selector */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="text-xs font-mono font-semibold text-slate-300">
            LOAD FICTIONAL TEST SCENARIO:
          </label>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_MESSAGES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadSample(sample.text, sample.channel)}
                className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors"
              >
                {sample.label.split(':')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            rows={7}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste suspicious email body, SMS text message, or executive chat message here..."
            maxLength={maxChars}
            className="w-full p-4 rounded-xl border border-slate-800 bg-[#060a12] text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 font-mono transition-all custom-scrollbar"
          />
          {/* Character counter */}
          <div className="absolute bottom-3 right-3 text-[11px] font-mono text-slate-500">
            {text.length} / {maxChars} characters
          </div>
        </div>

        {/* Controls row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">Channel Vector:</span>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="email">Email</option>
              <option value="sms">SMS Text</option>
              <option value="chat">Internal Chat / Slack</option>
              <option value="voice_transcript">Voice / Call Transcript</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              disabled={loading || (!text && !result)}
              className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={handleAnalyze}
              disabled={loading || text.trim().length < 3}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs font-mono tracking-wide shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Analyzing...' : 'Analyze Message'}
            </button>
          </div>
        </div>

        {error && (
          <AlertNotice type="error" title="Input Validation Warning">
            {error}
          </AlertNotice>
        )}
      </div>

      {/* Loading state */}
      {loading && <LoadingState message="Correlating Linguistic Rules & Exploitation Signatures..." />}

      {/* Analysis Results Display */}
      {result && !loading && (
        <div className="space-y-6">
          {/* Main Score & Classification Card */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <ScoreGauge score={result.score} riskLevel={result.risk_level} size={130} />
                <div className="space-y-2">
                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <RiskBadge level={result.risk_level} size="lg" />
                    <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                      {result.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {result.risk_level === 'HIGH' && 'High Probability Social Engineering Vector'}
                    {result.risk_level === 'MEDIUM' && 'Elevated Suspicion Detected'}
                    {result.risk_level === 'LOW' && 'Low Suspicion / Normal Communication'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                    {result.findings.length > 0
                      ? `Evaluated ${result.metrics?.character_count || 0} characters and identified ${result.findings.length} threat indicator pattern(s).`
                      : 'Linguistic patterns match standard non-coercive business or personal correspondence.'}
                  </p>
                </div>
              </div>

              {/* Forensic Hash */}
              {result.metrics?.character_count && (
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 font-mono text-xs space-y-1 w-full sm:w-auto">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                    ANALYSIS METRICS
                  </div>
                  <div className="text-slate-300">
                    Words: <span className="text-white font-bold">{result.metrics.word_count}</span>
                  </div>
                  <div className="text-slate-300">
                    Synergy Bonus: <span className="text-cyan-400 font-bold">+{result.metrics.synergy_bonus_applied} pts</span>
                  </div>
                </div>
              )}
            </div>

            {/* Detected Indicators List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-cyan-400" />
                  Exact Indicators & Manipulation Tactics Detected ({result.findings.length})
                </h4>
              </div>
              <FindingsList findings={result.findings} />
            </div>

            {/* Recommended Next Steps */}
            <div className="p-5 rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-[#070b14] space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Recommended Defensive Actions
              </h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Confidence & Limitations Notice */}
            <AlertNotice type="info" title="Heuristic Model Notice & Forensic Integrity">
              {result.confidence_notice}
              <div className="mt-2 pt-2 border-t border-cyan-500/20 text-[11px] font-mono text-cyan-300/80">
                Redacted Preview: "{result.content_preview}"
              </div>
            </AlertNotice>
          </div>
        </div>
      )}
    </div>
  );
};
