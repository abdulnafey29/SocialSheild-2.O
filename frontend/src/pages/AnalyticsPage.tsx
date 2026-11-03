import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { AnalyticsOverview } from '../types';
import { LoadingState } from '../components/common/LoadingState';
import { AlertNotice } from '../components/common/AlertNotice';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  PieChart as PieIcon,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getAnalytics();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load telemetry analytics.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCsv = () => {
    window.open(api.getExportCsvUrl(), '_blank');
  };

  if (loading) {
    return <LoadingState message="Aggregating Threat Telemetry & Training Metrics..." />;
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <AlertNotice type="error" title="Analytics Loading Error">
          {error || 'Unable to retrieve telemetry overview.'}
        </AlertNotice>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs"
        >
          Retry
        </button>
      </div>
    );
  }

  const tooltipStyles = {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    borderRadius: '8px',
    color: '#f8fafc',
    fontSize: '12px',
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>MODULE G • TELEMETRY & LEARNING ANALYTICS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Threat Intelligence & Awareness Reports
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Visual metrics synthesized from real-time message scans, URL analyses, interactive simulator attempts, and incident queues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAnalytics}
            className="p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownloadCsv}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs font-mono tracking-wide shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* Row 1: Activity Timeline + Risk Distribution Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timeline Area Chart */}
        <div className="lg:col-span-8 p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Analysis Activity & Threat Severity Over Time
              </h3>
              <p className="text-xs text-slate-400">
                Daily volume of evaluated messages, URLs, and headers
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">Live DB Stream</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.timeline}>
                <defs>
                  <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={tooltipStyles} />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Area type="monotone" dataKey="total" stroke="#06b6d4" fillOpacity={1} fill="url(#colorTotal)" name="Total Analyses" />
                <Area type="monotone" dataKey="high" stroke="#ef4444" fillOpacity={1} fill="url(#colorHigh)" name="High Risk Scans" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="lg:col-span-4 p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-violet-400" />
              Overall Threat Split
            </h3>
            <p className="text-xs text-slate-400">
              Deterministic severity categories
            </p>
          </div>

          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.risk_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.risk_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyles} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            {data.risk_distribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Quiz Mastery & Incident Status Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quiz scores bar chart */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Awareness Module Quiz Mastery
            </h3>
            <p className="text-xs text-slate-400">
              Highest percentage recorded per curriculum topic
            </p>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.quiz_performance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={11} unit="%" />
                <YAxis dataKey="lesson" type="category" stroke="#94a3b8" fontSize={10} width={130} />
                <Tooltip contentStyle={tooltipStyles} />
                <Bar dataKey="score" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Score %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incident vectors / channels bar chart */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Incident Reports by Channel Vector
            </h3>
            <p className="text-xs text-slate-400">
              Breakdown of user-reported threat vectors
            </p>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.incident_channels}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="channel" stroke="#64748b" fontSize={10} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyles} />
                <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Incidents" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CSV Forensic Export Advisory Box */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-[#060a12] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center flex-shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Forensic Export & Privacy Integrity
            </h4>
            <p className="text-xs text-slate-400 max-w-xl">
              Exported CSV reports contain deterministic risk scores, timestamps, finding counts, and anonymized sha256 hashes. Raw passwords or sensitive confidential text are omitted for data privacy.
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadCsv}
          className="px-4 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-950/80 text-cyan-300 text-xs font-mono font-bold flex items-center gap-2 flex-shrink-0 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Download Telemetry CSV
        </button>
      </div>
    </div>
  );
};
