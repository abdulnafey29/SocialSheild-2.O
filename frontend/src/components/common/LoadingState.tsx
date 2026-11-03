import React from 'react';
import { Shield } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subtext?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Executing SocialShield Heuristic Engine...',
  subtext = 'Analyzing linguistic tokens, lexical entropy, and threat signatures',
}) => {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center animate-pulse">
          <Shield className="w-8 h-8 text-cyan-400" />
        </div>
        <div className="absolute -inset-1 rounded-2xl bg-cyan-500/20 blur-sm animate-ping -z-10" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-200 tracking-wide font-mono">
          {message}
        </p>
        <p className="text-xs text-slate-400 max-w-sm">
          {subtext}
        </p>
      </div>
    </div>
  );
};
