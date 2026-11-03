import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Scenario, ScenarioSubmitResponse } from '../types';
import { LoadingState } from '../components/common/LoadingState';
import { AlertNotice } from '../components/common/AlertNotice';
import {
  Gamepad2,
  Mail,
  MessageSquare,
  PhoneCall,
  Briefcase,
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Trophy,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const SimulatorPage: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Interaction state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<ScenarioSubmitResponse | null>(null);
  const [scenarioResults, setScenarioResults] = useState<Record<string, ScenarioSubmitResponse>>({});
  const [isCompletedAll, setIsCompletedAll] = useState(false);

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getScenarios();
      setScenarios(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load simulator scenarios.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = async (optionId: string) => {
    if (feedback || submitting) return; // already answered
    setSelectedOptionId(optionId);
    setSubmitting(true);

    try {
      const current = scenarios[currentIndex];
      const res = await api.submitScenarioAnswer(current.id, optionId);
      setFeedback(res);
      setScenarioResults((prev) => ({ ...prev, [current.id]: res }));
    } catch (err: any) {
      setError(err.message || 'Failed to submit response.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setFeedback(null);
    } else {
      setIsCompletedAll(true);
    }
  };

  const handleRestart = async () => {
    try {
      await api.resetTraining();
    } catch {
      // ignore
    }
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setFeedback(null);
    setScenarioResults({});
    setIsCompletedAll(false);
  };

  if (loading) {
    return <LoadingState message="Configuring Interactive Social Engineering Lab..." />;
  }

  if (error || scenarios.length === 0) {
    return (
      <div className="space-y-4">
        <AlertNotice type="error" title="Simulation Initialization Failure">
          {error || 'No scenarios available.'}
        </AlertNotice>
        <button
          onClick={fetchScenarios}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs"
        >
          Retry
        </button>
      </div>
    );
  }

  const currentScenario = scenarios[currentIndex];
  const totalScore = Object.values(scenarioResults).reduce((sum, r) => sum + r.score_awarded, 0);
  const maxPossibleScore = scenarios.length * 100;
  const scorePct = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

  const getChannelIcon = (ch: string) => {
    switch (ch) {
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'phone': return PhoneCall;
      case 'job_portal': return Briefcase;
      default: return UserCheck;
    }
  };

  const ChannelIcon = getChannelIcon(currentScenario?.channel || 'email');

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-2">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>MODULE C • INTERACTIVE SOCIAL ENGINEERING LAB</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Social Engineering Incident Simulator
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Make real-time decisions against 6 realistic social engineering attacks. Receive instant tactical feedback dissecting cognitive manipulation techniques and red flags.
        </p>
      </div>

      {/* Progress & Score Bar */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-slate-400">
            SCENARIO <span className="text-white font-bold">{currentIndex + 1}</span> OF{' '}
            <span className="text-white font-bold">{scenarios.length}</span>
          </div>
          {/* Progress dots */}
          <div className="flex gap-1.5">
            {scenarios.map((s, idx) => {
              const res = scenarioResults[s.id];
              return (
                <div
                  key={s.id}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    res
                      ? res.is_safe
                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                        : 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.5)]'
                      : idx === currentIndex
                      ? 'bg-cyan-400 ring-2 ring-cyan-400/40'
                      : 'bg-slate-700'
                  }`}
                />
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            Current Score:{' '}
            <span className="text-emerald-400 font-bold">{totalScore}</span> / {maxPossibleScore} pts
          </div>
          <button
            onClick={handleRestart}
            className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Final Summary Card when all complete */}
      {isCompletedAll ? (
        <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/70 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white">
              Simulator Lab Completed!
            </h2>
            <p className="text-sm text-slate-300">
              You scored <span className="font-bold text-cyan-400">{totalScore} points</span> ({scorePct}%) across all 6 attack scenarios.
            </p>
          </div>

          <div className="inline-block p-4 rounded-xl border border-slate-800 bg-[#060a12] text-left max-w-md w-full space-y-2">
            <div className="text-xs font-mono text-slate-400">DEFENSIVE EVALUATION:</div>
            <div className="text-sm font-bold text-white">
              {scorePct >= 90 && '🛡️ Cyber Sentinel (Expert Resilience)'}
              {scorePct >= 70 && scorePct < 90 && '⚡ Vigilant Defender (Solid Awareness)'}
              {scorePct < 70 && '⚠️ Vulnerable to Social Coercion (Review Modules)'}
            </div>
            <p className="text-xs text-slate-400">
              {scorePct >= 80
                ? 'Excellent skepticism! You systematically neutralized psychological pressure and verified out-of-band.'
                : 'Key area for improvement: Remember never to execute financial or credential requests without independent verification.'}
            </p>
          </div>

          <div>
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold shadow-lg shadow-cyan-600/20"
            >
              Restart Simulation Lab
            </button>
          </div>
        </div>
      ) : (
        /* Active Scenario Card */
        <div className="space-y-6">
          {/* Scenario Context & Realistic Mockup */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <ChannelIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {currentScenario.title}
                  </h3>
                  <div className="text-[11px] font-mono text-slate-400">
                    Vector: <span className="uppercase text-cyan-400">{currentScenario.channel}</span> • Difficulty: {currentScenario.difficulty}
                  </div>
                </div>
              </div>

              <div className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                Context: {currentScenario.context_info.slice(0, 45)}...
              </div>
            </div>

            {/* Realistic Communication Mockup UI */}
            <div className="rounded-xl border border-slate-700/80 bg-[#060a12] p-5 space-y-3 font-sans shadow-inner">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800 text-slate-400 font-mono">
                <div>
                  <span className="text-slate-500">From:</span>{' '}
                  <span className="text-slate-200 font-semibold">{currentScenario.sender_name}</span>{' '}
                  <span className="text-cyan-400/80">({currentScenario.sender_contact})</span>
                </div>
                <span className="text-[10px] text-slate-500">Incoming Dispatch</span>
              </div>

              {currentScenario.subject_or_prompt && (
                <div className="text-xs font-bold text-slate-200 font-mono">
                  Subject: {currentScenario.subject_or_prompt}
                </div>
              )}

              <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-mono bg-slate-950/40 p-4 rounded-lg border border-slate-800/80 select-none">
                {currentScenario.message_content}
              </div>
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Choose your tactical response:
              </label>

              <div className="space-y-2.5">
                {currentScenario.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  let optStyle = 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-800/40 text-slate-200';

                  if (feedback) {
                    if (opt.is_safe) {
                      optStyle = 'border-emerald-500/50 bg-emerald-950/30 text-emerald-200';
                    } else if (isSelected && !opt.is_safe) {
                      optStyle = 'border-rose-500/50 bg-rose-950/30 text-rose-200';
                    } else {
                      optStyle = 'border-slate-800/40 opacity-50 bg-slate-950/20 text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={feedback !== null || submitting}
                      className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${optStyle}`}
                    >
                      <div className="mt-0.5">
                        {feedback ? (
                          opt.is_safe ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : isSelected ? (
                            <XCircle className="w-4 h-4 text-rose-400" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-600" />
                          )
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center">
                            {isSelected && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 leading-relaxed">
                        {opt.text}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback & Tactics Breakdown Card (Revealed after answer) */}
            {feedback && (
              <div className="p-6 rounded-xl border border-slate-800 bg-[#070d18] space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {feedback.is_safe ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> CORRECT DEFENSIVE ACTION (+{feedback.score_awarded} pts)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950 text-rose-400 border border-rose-500/40 text-xs font-mono font-bold">
                        <XCircle className="w-3.5 h-3.5" /> SECURITY COMPROMISE (+{feedback.score_awarded} pts)
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {feedback.feedback}
                </p>

                {/* Tactical Manipulation breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">
                      Psychological Exploitation Mechanism
                    </span>
                    <p className="text-xs text-slate-300">
                      {feedback.manipulation_tactics}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 space-y-1">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">
                      Key Red Flags
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                      {feedback.red_flags.map((rf, i) => (
                        <li key={i}>{rf}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs font-mono tracking-wide shadow-lg shadow-cyan-500/20 flex items-center gap-2"
                  >
                    <span>{currentIndex < scenarios.length - 1 ? 'Next Scenario' : 'View Final Summary'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
