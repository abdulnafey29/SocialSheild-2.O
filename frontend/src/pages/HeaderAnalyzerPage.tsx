import React, { useState } from 'react';
import { api } from '../api/client';
import { AnalysisResponse } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { ScoreGauge } from '../components/common/ScoreGauge';
import { FindingsList } from '../components/common/FindingsList';
import { AlertNotice } from '../components/common/AlertNotice';
import { LoadingState } from '../components/common/LoadingState';
import {
  FileSearch,
  Sparkles,
  RotateCcw,
  CheckCircle,
  ShieldCheck,
  ShieldAlert,
  Server,
  ArrowRight,
  GitCommit
} from 'lucide-react';

const SAMPLE_HEADERS = [
  {
    label: 'Spoofed Bank Header (SPF & DMARC Fail)',
    headers: `Delivered-To: victim-student@college.edu
Received: by 2002:a05:6512:21a2:b0:4f1:5542:332 with SMTP id e2csp1928231
Received: from mail.compromised-cloud-node.net (mail.compromised-cloud-node.net. [198.51.100.84])
        by mx.google.com with ESMTPS id o18si892482plm.12
        for <victim-student@college.edu>;
        Wed, 28 Oct 2026 09:14:22 -0700 (PDT)
Authentication-Results: mx.google.com;
       spf=fail (google.com: domain of chase.com does not designate 198.51.100.84 as permitted sender) smtp.mailfrom=chase.com;
       dkim=fail header.i=@chase.com;
       dmarc=fail (p=REJECT sp=REJECT dis=NONE) header.from=chase.com
From: Chase Fraud Alert Team <security-alert@chase.com>
Reply-To: support@external-ticket-routing.net
Return-Path: <bounce@unrelated-server-host.org>
To: victim-student@college.edu
Subject: URGENT: Fraudulent Wire Transfer Detected on Your Account
Date: Wed, 28 Oct 2026 09:14:15 -0700`,
  },
  {
    label: 'Authentic Verified Enterprise Header',
    headers: `Delivered-To: recipient@company.com
Received: by 2002:a17:906:8a12:b0:7a2:1241 with SMTP id f18csp429182
Received: from mail-sor-f65.google.com (mail-sor-f65.google.com. [209.85.220.65])
        by mx.google.com with SMTPS id g14sor2841920pla.5
        for <recipient@company.com>;
        Wed, 28 Oct 2026 08:30:10 -0700 (PDT)
Authentication-Results: mx.google.com;
       spf=pass (google.com: domain of github.com designates 209.85.220.65 as permitted sender) smtp.mailfrom=support@github.com;
       dkim=pass header.i=@github.com header.s=s202610 header.b=X9b2Lq8;
       dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=github.com
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=github.com; s=s202610;
From: GitHub Support <support@github.com>
Reply-To: support@github.com
Return-Path: <support@github.com>
To: recipient@company.com
Subject: [GitHub] Security advisory alert for your repository
Date: Wed, 28 Oct 2026 08:30:00 -0700`,
  },
];

export const HeaderAnalyzerPage: React.FC = () => {
  const [headers, setHeaders] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!headers || headers.trim().length < 10) {
      setError('Please paste at least 10 characters of RFC 822 / 5322 email headers.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await api.analyzeHeader(headers);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Error occurred during email header inspection.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setHeaders('');
    setResult(null);
    setError(null);
  };

  const loadSample = (sampleText: string) => {
    setHeaders(sampleText);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-mono mb-2">
          <FileSearch className="w-3.5 h-3.5" />
          <span>MODULE D • RFC 822 / 5322 EMAIL TRUST & HEADER INSPECTOR</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Email Trust & Header Authentication Analyzer
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Inspect raw message headers to identify sender address spoofing, From vs. Reply-To domain divergence, SPF record failures, DKIM signature breaches, and DMARC alignment status.
        </p>
      </div>

      {/* Input panel */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
        {/* Sample selector */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="text-xs font-mono font-semibold text-slate-300">
            TEST HEADERS (SAFE FICTIONAL DEMO SAMPLES):
          </label>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_HEADERS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadSample(sample.headers)}
                className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <textarea
          rows={8}
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          placeholder="Paste raw email headers (From:, Reply-To:, Authentication-Results:, Received:, etc.)..."
          className="w-full p-4 rounded-xl border border-slate-800 bg-[#060a12] text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40 font-mono transition-all custom-scrollbar"
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-mono text-slate-500">
            {headers.length} characters
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              disabled={loading || (!headers && !result)}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={handleAnalyze}
              disabled={loading || headers.trim().length < 10}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-xs font-mono tracking-wide shadow-lg shadow-amber-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Analyzing Headers...' : 'Inspect Headers'}
            </button>
          </div>
        </div>

        {error && (
          <AlertNotice type="error" title="Header Parsing Error">
            {error}
          </AlertNotice>
        )}
      </div>

      {/* Loading */}
      {loading && <LoadingState message="Extracting SPF/DKIM/DMARC Vectors and Relay Trace..." />}

      {/* Result */}
      {result && !loading && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-6">
            {/* Top Score */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <ScoreGauge score={result.score} riskLevel={result.risk_level} size={130} />
                <div className="space-y-2">
                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <RiskBadge level={result.risk_level} size="lg" />
                    <span className="text-xs font-mono text-amber-400 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30">
                      {result.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {result.risk_level === 'HIGH' && 'Critical Authentication Failure / Spoofing Detected'}
                    {result.risk_level === 'MEDIUM' && 'Header Inconsistencies Identified'}
                    {result.risk_level === 'LOW' && 'Headers Cryptographically Verified & Aligned'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                    Evaluated message envelope addresses and email authentication protocols.
                  </p>
                </div>
              </div>

              {/* Protocol Triad Badges */}
              {result.metrics && (
                <div className="grid grid-cols-3 gap-2 w-full sm:w-auto text-center font-mono text-xs">
                  <div className={`p-3 rounded-xl border ${result.metrics.spf_status === 'pass' ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-400' : result.metrics.spf_status === 'fail' ? 'border-rose-500/40 bg-rose-950/30 text-rose-400' : 'border-slate-800 bg-slate-900 text-slate-400'}`}>
                    <div className="text-[10px] uppercase">SPF</div>
                    <div className="font-bold text-sm uppercase">{result.metrics.spf_status || 'none'}</div>
                  </div>
                  <div className={`p-3 rounded-xl border ${result.metrics.dkim_status === 'pass' || result.metrics.dkim_status === 'present' ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-400' : result.metrics.dkim_status === 'fail' ? 'border-rose-500/40 bg-rose-950/30 text-rose-400' : 'border-slate-800 bg-slate-900 text-slate-400'}`}>
                    <div className="text-[10px] uppercase">DKIM</div>
                    <div className="font-bold text-sm uppercase">{result.metrics.dkim_status || 'none'}</div>
                  </div>
                  <div className={`p-3 rounded-xl border ${result.metrics.dmarc_status === 'pass' ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-400' : result.metrics.dmarc_status === 'fail' ? 'border-rose-500/40 bg-rose-950/30 text-rose-400' : 'border-slate-800 bg-slate-900 text-slate-400'}`}>
                    <div className="text-[10px] uppercase">DMARC</div>
                    <div className="font-bold text-sm uppercase">{result.metrics.dmarc_status || 'none'}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Address Alignment Breakdown */}
            {result.metrics && (
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2 text-xs font-mono">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  Envelope Address Alignment
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-500 block">From:</span>
                    <span className="text-cyan-400 font-semibold">{result.metrics.from_email || 'None'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Reply-To:</span>
                    <span className="text-amber-400 font-semibold">{result.metrics.reply_to_email || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Return-Path:</span>
                    <span className="text-slate-300 font-semibold">{result.metrics.return_path_email || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Findings List */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Authentication Evidence & Discrepancy Findings ({result.findings.length})
              </h4>
              <FindingsList findings={result.findings} />
            </div>

            {/* Received Hop Chain Summary */}
            {result.metrics?.hops_summary && result.metrics.hops_summary.length > 0 && (
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2 text-xs font-mono">
                <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5">
                  <GitCommit className="w-3.5 h-3.5 text-cyan-400" />
                  <span>MTA Relay Hop Trace ({result.metrics.hop_count} total hops)</span>
                </div>
                <div className="space-y-1">
                  {result.metrics.hops_summary.map((h: string, idx: number) => (
                    <div key={idx} className="text-slate-300 truncate">
                      {h}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="p-5 rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-[#070b14] space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Actionable Next Steps
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

            <AlertNotice type="info" title="Header Evidence Notice">
              {result.confidence_notice}
            </AlertNotice>
          </div>
        </div>
      )}
    </div>
  );
};
