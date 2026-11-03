import React from 'react';
import { Finding } from '../../types';
import { RiskBadge } from './RiskBadge';
import { AlertCircle, Tag } from 'lucide-react';

interface FindingsListProps {
  findings: Finding[];
}

export const FindingsList: React.FC<FindingsListProps> = ({ findings }) => {
  if (!findings || findings.length === 0) {
    return (
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 text-center">
        <p className="text-sm text-slate-400">
          No suspicious attack indicators or malicious patterns were identified.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {findings.map((f, idx) => (
        <div
          key={idx}
          className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/60 hover:border-slate-700 transition-colors space-y-2.5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <h4 className="text-sm font-semibold text-slate-100">
                {f.indicator}
              </h4>
            </div>
            <RiskBadge level={f.severity} size="sm" />
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {f.explanation}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            {f.snippet && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 text-cyan-300 font-mono text-[11px] border border-slate-700/60">
                <span className="text-slate-400">Matched:</span>
                <span className="font-semibold">{f.snippet}</span>
              </div>
            )}
            {f.category && (
              <div className="inline-flex items-center gap-1 text-slate-400">
                <Tag className="w-3 h-3 text-slate-500" />
                <span>{f.category}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
