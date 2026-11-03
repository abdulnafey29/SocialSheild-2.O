import React, { useEffect, useState } from 'react';
import { Shield, Sun, Moon, Menu, Wifi, WifiOff } from 'lucide-react';
import { api } from '../../api/client';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu, activeTab }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark') || true;
  });
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const checkApi = async () => {
      try {
        await api.checkHealth();
        setBackendOnline(true);
      } catch {
        setBackendOnline(false);
      }
    };
    checkApi();
    const interval = setInterval(checkApi, 25000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Threat Overview Dashboard';
      case 'messages': return 'Module A: Phishing Message Detector';
      case 'urls': return 'Module B: Suspicious URL Analyzer';
      case 'simulator': return 'Module C: Interactive SE Simulator';
      case 'headers': return 'Module D: Email Trust & Header Analyzer';
      case 'training': return 'Module E: Cybersecurity Awareness Training';
      case 'incidents': return 'Module F: Incident Reporting Portal';
      case 'analytics': return 'Module G: Analytics & Intelligence Reports';
      default: return 'Security Operations Platform';
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-[#090d18]/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-bold tracking-tight text-white font-mono text-sm">
            SocialShield <span className="text-cyan-400">2.0</span>
          </span>
        </div>

        {/* Page Breadcrumb for desktop */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">SOC Console</span>
          <span className="text-slate-600">/</span>
          <span className="text-cyan-400 font-semibold">{getPageTitle(activeTab)}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Backend Connectivity Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/60 text-[11px] font-mono">
          {backendOnline === true ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              <span className="text-emerald-400 flex items-center gap-1">
                <Wifi className="w-3 h-3" /> API CONNECTED
              </span>
            </>
          ) : backendOnline === false ? (
            <>
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="text-rose-400 flex items-center gap-1">
                <WifiOff className="w-3 h-3" /> BACKEND OFFLINE
              </span>
            </>
          ) : (
            <span className="text-slate-400">CONNECTING...</span>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark SOC Mode"}
          className="p-2 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-cyan-300 hover:border-slate-700 transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Version Badge */}
        <div className="px-2.5 py-1 rounded border border-cyan-500/20 bg-cyan-950/30 text-cyan-400 text-[11px] font-mono font-semibold">
          v2.0-SEC
        </div>
      </div>
    </header>
  );
};
