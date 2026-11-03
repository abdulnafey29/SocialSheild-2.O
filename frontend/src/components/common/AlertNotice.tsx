import React from 'react';
import { AlertCircle, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AlertNoticeProps {
  type?: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  children: React.ReactNode;
}

export const AlertNotice: React.FC<AlertNoticeProps> = ({
  type = 'info',
  title,
  children,
}) => {
  const styles = {
    info: {
      border: 'border-cyan-500/30 bg-cyan-950/20 text-cyan-200',
      icon: Info,
      iconColor: 'text-cyan-400',
    },
    warning: {
      border: 'border-amber-500/30 bg-amber-950/20 text-amber-200',
      icon: AlertCircle,
      iconColor: 'text-amber-400',
    },
    error: {
      border: 'border-rose-500/30 bg-rose-950/20 text-rose-200',
      icon: ShieldAlert,
      iconColor: 'text-rose-400',
    },
    success: {
      border: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
    },
  }[type];

  const Icon = styles.icon;

  return (
    <div className={`p-4 rounded-xl border text-sm flex gap-3 ${styles.border}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${styles.iconColor}`} />
      <div className="flex-1 space-y-1">
        {title && <h4 className="font-semibold text-slate-100">{title}</h4>}
        <div className="text-slate-300 leading-relaxed text-xs sm:text-sm">{children}</div>
      </div>
    </div>
  );
};
