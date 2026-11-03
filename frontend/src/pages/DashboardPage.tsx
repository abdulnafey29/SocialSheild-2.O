import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { DashboardSummary } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { LoadingState } from '../components/common/LoadingState';
import { AlertNotice } from '../components/common/AlertNotice';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  MailWarning,
  Globe,
  Gamepad2,
  FileSearch,
  GraduationCap,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Activity,
  Lightbulb
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const summary = await api.getDashboardSummary();
      setData(summary);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Connecting to SOC Telemetry Engine..." />;
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <AlertNotice type="error" title="Dashboard Telemetry Error">
          {error || 'Unable to retrieve dashboard metrics.'}
        </AlertNotice>
        <button
          onClick={fetchDashboard}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs font-mono"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const pieData = [
    { name: 'Low Risk', value: data.low_risk_count, color: '#10b981' },
    { name: 'Medium Risk', value: data.medium_risk_count, color: '#f59e0b' },
    { name: 'High Risk', value: data.high_risk_count, color: '#ef4444' },
  ];

  const quickActions = [
    {
      tab: 'messages',
      title: 'Phishing Message Detector',
      desc: 'Evaluate pasted emails, SMS, or chat text for coercion & credential harvesting.',
      icon: MailWarning,
      color: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30',
    },
    {
      tab: 'urls',
      title: 'Suspicious URL Analyzer',
      desc: 'Safe, offline syntactic inspection for typosquatting & brand lookalikes.',
      icon: Globe,
      color: 'from-violet-500/20 to-purple-500/10 text-violet-400 border-violet-500/30',
    },
    {
      tab: 'simulator',
      title: 'Interactive SE Simulator',
      desc: '6 scenario labs training you to defeat BEC, vishing, and IT impersonation.',
      icon: Gamepad2,
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
      tab: 'headers',
      title: 'Email Header Inspector',
      desc: 'Dissect SPF, DKIM, DMARC alignments and MTA routing trace hops.',
      icon: FileSearch,
      color: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Hero Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-[#0d1629] to-[#070b14] relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACADEMIC CYBERSECURITY CAPSTONE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            SocialShield <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">2.0</span> Operations Console
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
            Deterministic social engineering detection, heuristic threat correlation, and interactive cybersecurity awareness.
          </p>
        </div>

        <div className="flex items-center gap-2 z-10">
          <button
            onClick={() => onNavigate('simulator')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
          >
            <Gamepad2 className="w-4 h-4" />
            Launch SE Simulator
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>TOTAL ANALYSES</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white">
              {data.total_analyzed}
            </span>
            <span className="text-xs text-slate-400">scans logged</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
            <span className="text-emerald-400">{data.low_risk_count} low</span>
            <span>•</span>
            <span className="text-amber-400">{data.medium_risk_count} med</span>
            <span>•</span>
            <span className="text-rose-400">{data.high_risk_count} high</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl border border-rose-950/60 bg-gradient-to-br from-rose-950/30 to-slate-900/80 hover:border-rose-900/80 transition-all">
          <div className="flex items-center justify-between text-rose-300 text-xs font-mono">
            <span>HIGH RISK THREATS</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-rose-400">
              {data.high_risk_count}
            </span>
            <span className="text-xs text-rose-300/80">critical patterns</span>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">
            Phishing, BEC & lookalike domain hits
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>QUIZ AVERAGE</span>
            <GraduationCap className="w-4 h-4 text-violet-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-violet-400">
              {data.quiz_average_score}%
            </span>
            <span className="text-xs text-slate-400">mastery</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            {data.quiz_completed_count} awareness modules completed
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>REPORTED INCIDENTS</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-amber-400">
              {data.total_incidents}
            </span>
            <span className="text-xs text-slate-400">triaged reports</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            Local educational reporting portal
          </div>
        </div>
      </div>

      {/* Visual Charts & Security Tip Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Threat Classification Distribution
              </h3>
              <p className="text-xs text-slate-400">
                Breakdown of analyzed messages, URLs, and headers by heuristic risk severity
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 px-2 py-1 rounded bg-slate-800">
              Heuristic Engine
            </span>
          </div>

          <div className="h-64 flex items-center justify-center">
            {data.total_analyzed === 0 ? (
              <p className="text-sm text-slate-500">No analyses recorded yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 text-xs font-mono">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300">{item.name}:</span>
                <span className="font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Tip Card */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-[#0b1222] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono">
              <Lightbulb className="w-4 h-4" />
              <span>SECURITY TIP OF THE DAY</span>
            </div>
            <h3 className="text-base font-bold text-white leading-snug">
              {data.security_tip.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {data.security_tip.content}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-cyan-500/20 bg-cyan-950/20 space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold">
              RECOMMENDED ACTION
            </div>
            <p className="text-xs text-slate-200">
              {data.security_tip.action_item}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white tracking-tight">
          Security Operations Modules
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.tab}
                onClick={() => onNavigate(action.tab)}
                className="text-left p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} border flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {action.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-mono text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Analysis Log Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight">
            Recent Analysis Log
          </h3>
          <button
            onClick={() => onNavigate('analytics')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View Full History & CSV</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Preview</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4 text-center">Risk Level</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {data.recent_analyses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No analyses recorded yet.
                    </td>
                  </tr>
                ) : (
                  data.recent_analyses.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-cyan-400 uppercase">
                        {item.analysis_type.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-slate-300">
                        {item.content_preview}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {item.category}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-200">
                        {Math.round(item.score)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <RiskBadge level={item.risk_level} size="sm" />
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                        {new Date(item.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
