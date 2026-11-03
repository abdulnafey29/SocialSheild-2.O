import React, { useState } from 'react';
import { api } from '../api/client';
import { AnalysisResponse } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { ScoreGauge } from '../components/common/ScoreGauge';
import { FindingsList } from '../components/common/FindingsList';
import { AlertNotice } from '../components/common/AlertNotice';
import { LoadingState } from '../components/common/LoadingState';
import {
  Globe,
  Lock,
  Unlock,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  Shield,
  Layers,
  Server
} from 'lucide-react';

const SAMPLE_URLS = [
  {
    label: 'Brand Subdomain Spoofing',
    url: 'https://paypal.com.account-verification-portal.xyz/secure/login',
  },
  {
    label: 'Direct IP Host (Unencrypted)',
    url: 'http://192.168.1.105/admin-panel/auth.php',
  },
  {
    label: 'URL Shortener Mask',
    url: 'https://bit.ly/secure-account-login382',
  },
  {
    label: 'Executable Download Payload',
    url: 'http://system-update-service.com/critical-hotfix-patch.exe',
  },
  {
    label: 'URL Auth Userinfo Trick',
    url: 'https://google.com@phishing-relay-node.com/oauth',
  },
  {
    label: 'Safe Standard URL',
    url: 'https://example.com/security/best-practices',
  },
];

export const UrlAnalyzerPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!url || url.trim().length < 3) {
      setError('Please enter a valid URL to analyze.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await api.analyzeUrl(url);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Error occurred during URL analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUrl('');
    setResult(null);
    setError(null);
  };

  const loadSample = (sampleUrl: string) => {
    setUrl(sampleUrl);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-400 text-xs font-mono mb-2">
          <Globe className="w-3.5 h-3.5" />
          <span>MODULE B • OFFLINE LEXICAL URL INSPECTOR</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Suspicious URL Structure & Lookalike Analyzer
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Perform safe, offline lexical decomposition to identify IP-address hosts, brand subdomain spoofing, typosquatting tokens, and high-abuse TLDs without visiting the destination.
        </p>
      </div>

      {/* Safety Notice Banner */}
      <AlertNotice type="info" title="100% Offline Inspection & SSRF Protection Architecture">
        For your safety, SocialShield <strong>never visits, pings, or downloads content</strong> from analyzed URLs.
        Evaluation is performed strictly via deterministic lexical parsing and structural threat heuristics.
      </AlertNotice>

      {/* Input panel */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
        {/* Sample selector */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="text-xs font-mono font-semibold text-slate-300">
            TEST SAMPLES (RFC RESERVED DOMAINS):
          </label>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_URLS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadSample(sample.url)}
                className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. https://paypal.com.verify-account.xyz/login or http://192.168.1.1/auth"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-[#060a12] text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40 font-mono transition-all"
            />
            <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              disabled={loading || (!url && !result)}
              className="px-4 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={handleAnalyze}
              disabled={loading || url.trim().length < 3}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs font-mono tracking-wide shadow-lg shadow-violet-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Inspecting...' : 'Analyze URL'}
            </button>
          </div>
        </div>

        {error && (
          <AlertNotice type="error" title="Invalid URL Input">
            {error}
          </AlertNotice>
        )}
      </div>

      {/* Loading */}
      {loading && <LoadingState message="Decomposing URL Syntax & Host Entropy..." />}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-6">
            {/* Top Score Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <ScoreGauge score={result.score} riskLevel={result.risk_level} size={130} />
                <div className="space-y-2">
                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <RiskBadge level={result.risk_level} size="lg" />
                    <span className="text-xs font-mono text-violet-400 px-2 py-0.5 rounded bg-violet-950/60 border border-violet-500/30">
                      {result.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {result.risk_level === 'HIGH' && 'High Risk Deceptive URL Structure'}
                    {result.risk_level === 'MEDIUM' && 'Suspicious URL Characteristics'}
                    {result.risk_level === 'LOW' && 'Standard Web URL Structure'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                    {result.findings.length > 0
                      ? `Detected ${result.findings.length} anomalous pattern(s) across protocol, hostname, or path tokens.`
                      : 'No brand spoofing, typosquatting, or high-risk syntactic indicators identified.'}
                  </p>
                </div>
              </div>

              {/* Protocol Badge */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2 text-xs font-mono w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  {result.metrics?.has_https ? (
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <Lock className="w-4 h-4" />
                      <span>HTTPS Encrypted</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-rose-400">
                      <Unlock className="w-4 h-4" />
                      <span>HTTP Unencrypted</span>
                    </div>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 max-w-[200px] leading-tight">
                  {result.metrics?.has_https
                    ? 'Note: HTTPS secures the channel, not the site identity!'
                    : 'Cleartext protocol vulnerable to network interception.'}
                </div>
              </div>
            </div>

            {/* Parsed Structure Breakdown Grid */}
            {result.metrics && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40">
                  <span className="text-slate-500 block text-[10px]">HOSTNAME</span>
                  <span className="text-cyan-400 font-bold truncate block" title={result.metrics.hostname}>
                    {result.metrics.hostname || 'N/A'}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40">
                  <span className="text-slate-500 block text-[10px]">TOP-LEVEL DOMAIN</span>
                  <span className="text-white font-bold">
                    .{result.metrics.tld || 'none'}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40">
                  <span className="text-slate-500 block text-[10px]">SUBDOMAIN SEGMENTS</span>
                  <span className="text-white font-bold">
                    {result.metrics.subdomain_count ?? 0}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40">
                  <span className="text-slate-500 block text-[10px]">HOST FORMAT</span>
                  <span className={result.metrics.is_ip_address ? 'text-rose-400 font-bold' : 'text-slate-300 font-bold'}>
                    {result.metrics.is_ip_address ? 'Raw IP Address' : 'Named Domain'}
                  </span>
                </div>
              </div>
            )}

            {/* Findings List */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-violet-400" />
                Syntactic Threat Indicators ({result.findings.length})
              </h4>
              <FindingsList findings={result.findings} />
            </div>

            {/* Recommendations */}
            <div className="p-5 rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-[#070b14] space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-violet-400 font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Defensive Guidance
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

            {/* Limitations Notice */}
            <AlertNotice type="warning" title="Cybersecurity Truth: HTTPS ≠ Safe Site">
              {result.confidence_notice}
            </AlertNotice>
          </div>
        </div>
      )}
    </div>
  );
};
