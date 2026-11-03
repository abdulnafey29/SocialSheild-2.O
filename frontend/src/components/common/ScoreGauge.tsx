import React from 'react';
import { RiskLevel } from '../../types';

interface ScoreGaugeProps {
  score: number;
  riskLevel: RiskLevel | string;
  size?: number;
  label?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  riskLevel,
  size = 140,
  label = 'RISK SCORE',
}) => {
  const normalized = (riskLevel || 'LOW').toUpperCase();
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  const color = {
    LOW: '#10b981', // emerald
    MEDIUM: '#f59e0b', // amber
    HIGH: '#ef4444', // rose/red
  }[normalized] || '#38bdf8';

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} viewBox="0 0 140 140" className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="currentColor"
          strokeWidth="10"
          className="text-slate-800/80 dark:text-slate-800"
          fill="transparent"
        />
        {/* Animated score arc */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Centered Score readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-extrabold tracking-tight font-mono text-slate-100">
          {Math.round(score)}
        </span>
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-0.5">
          {label}
        </span>
      </div>
    </div>
  );
};
