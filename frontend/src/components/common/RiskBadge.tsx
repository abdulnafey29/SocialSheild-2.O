import React from 'react';
import { RiskLevel } from '../../types';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = 'md',
  showIcon = true,
}) => {
  const normalized = (level || 'LOW').toUpperCase();

  const config = {
    LOW: {
      label: 'LOW RISK',
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.2)]',
      icon: ShieldCheck,
    },
    MEDIUM: {
      label: 'MEDIUM RISK',
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.2)]',
      icon: AlertTriangle,
    },
    HIGH: {
      label: 'HIGH RISK',
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      glow: 'shadow-[0_0_12px_rgba(239,68,68,0.25)]',
      icon: ShieldAlert,
    },
  }[normalized] || {
    label: normalized,
    bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    glow: '',
    icon: ShieldCheck,
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  }[size];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-wide uppercase font-mono ${config.bg} ${config.glow} ${sizeClasses}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      {config.label}
    </span>
  );
};
