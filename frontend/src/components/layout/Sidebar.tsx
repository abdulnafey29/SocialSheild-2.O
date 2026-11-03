import React from 'react';
import {
  Shield,
  LayoutDashboard,
  MailWarning,
  Globe,
  Gamepad2,
  FileSearch,
  GraduationCap,
  AlertTriangle,
  BarChart3,
  X,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Main Dashboard',
      subtitle: 'SOC Overview & Metrics',
      icon: LayoutDashboard,
      badge: 'LIVE',
    },
    {
      id: 'messages',
      label: 'Phishing Detector',
      subtitle: 'Module A • Text Analysis',
      icon: MailWarning,
    },
    {
      id: 'urls',
      label: 'URL Analyzer',
      subtitle: 'Module B • Safe Lexical Scan',
      icon: Globe,
    },
    {
      id: 'simulator',
      label: 'SE Simulator Lab',
      subtitle: 'Module C • 6 Scenarios',
      icon: Gamepad2,
      badge: 'INTERACTIVE',
    },
    {
      id: 'headers',
      label: 'Header Inspector',
      subtitle: 'Module D • SPF / DKIM / DMARC',
      icon: FileSearch,
    },
    {
      id: 'training',
      label: 'Awareness Academy',
      subtitle: 'Module E • 8 Lessons & Quizzes',
      icon: GraduationCap,
    },
    {
      id: 'incidents',
      label: 'Incident Portal',
      subtitle: 'Module F • Reporting & Triage',
      icon: AlertTriangle,
    },
    {
      id: 'analytics',
      label: 'Reports & Analytics',
      subtitle: 'Module G • Charts & Export',
      icon: BarChart3,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar aside */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-[#080c16] border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo and Brand */}
        <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-white font-mono text-base">
                  SocialShield
                </span>
                <span className="text-cyan-400 font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                  2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">
                CYBERSECURITY PLATFORM
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
            Security Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900 border border-cyan-500/40 text-white shadow-lg shadow-cyan-950/40'
                    : 'text-slate-300 hover:bg-slate-900/60 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'bg-slate-800/60 text-slate-400 group-hover:text-cyan-300 group-hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold tracking-wide truncate">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                      item.badge === 'LIVE'
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                        : 'bg-violet-950/60 text-violet-400 border-violet-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Academic Project Footer Info */}
        <div className="p-4 border-t border-slate-800/80 bg-[#060a12]/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Project Scope</span>
            <span className="text-cyan-400 font-semibold">College Cyber Capstone</span>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/50 text-[11px] text-slate-400 leading-relaxed">
            Deterministic rule-based heuristics & offline inspection architecture.
          </div>
        </div>
      </aside>
    </>
  );
};
