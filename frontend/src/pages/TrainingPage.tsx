import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { LessonModule, ProgressResponse, QuizSubmitResponse } from '../types';
import { LoadingState } from '../components/common/LoadingState';
import { AlertNotice } from '../components/common/AlertNotice';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  Shield,
  RotateCcw
} from 'lucide-react';

export const TrainingPage: React.FC = () => {
  const [lessons, setLessons] = useState<LessonModule[]>([]);
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [selectedLessonKey, setSelectedLessonKey] = useState<string>('phishing-spearphishing');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quiz state for the active lesson
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<QuizSubmitResponse | null>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  useEffect(() => {
    fetchLessonsAndProgress();
  }, []);

  const fetchLessonsAndProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      const [lData, pData] = await Promise.all([
        api.getLessons(),
        api.getProgress(),
      ]);
      setLessons(lData);
      setProgress(pData);
      if (lData.length > 0) {
        setSelectedLessonKey(lData[0].key);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load awareness training modules.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLesson = (key: string) => {
    setSelectedLessonKey(key);
    setQuizAnswers({});
    setQuizResult(null);
  };

  const handleSelectAnswer = (qId: string, optIdx: number) => {
    if (quizResult) return;
    setQuizAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitQuiz = async () => {
    const currentLesson = lessons.find((l) => l.key === selectedLessonKey);
    if (!currentLesson) return;

    if (Object.keys(quizAnswers).length < currentLesson.quiz.length) {
      setError('Please answer all questions before submitting the knowledge check.');
      return;
    }

    try {
      setSubmittingQuiz(true);
      setError(null);
      const res = await api.submitQuiz(selectedLessonKey, quizAnswers);
      setQuizResult(res);

      // Refresh progress
      const updatedProgress = await api.getProgress();
      setProgress(updatedProgress);
    } catch (err: any) {
      setError(err.message || 'Failed to submit quiz.');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleResetLessonQuiz = () => {
    setQuizAnswers({});
    setQuizResult(null);
  };

  if (loading) {
    return <LoadingState message="Loading Cybersecurity Awareness Academy Curriculum..." />;
  }

  const activeLesson = lessons.find((l) => l.key === selectedLessonKey) || lessons[0];
  const lessonProgress = progress?.modules?.[activeLesson?.key];
  const isCompleted = lessonProgress?.completed || false;
  const bestScore = lessonProgress?.quiz_score || 0;

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-400 text-xs font-mono mb-2">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>MODULE E • CYBERSECURITY AWARENESS ACADEMY</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Social Engineering Defense Curriculum
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Master 8 essential social engineering attack vectors through structured threat analyses, fictional case studies, and interactive knowledge checks.
        </p>
      </div>

      {/* Progress banner */}
      {progress && (
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                CURRICULUM PROGRESS: {progress.total_completed} / {progress.total_modules} MODULES COMPLETED
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Overall Quiz Average: <span className="text-emerald-400 font-bold">{progress.average_score}%</span>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-48 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${(progress.total_completed / progress.total_modules) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Grid: Sidebar of 8 modules + Active lesson body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module navigation list */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold px-1">
            Awareness Modules
          </div>

          <div className="space-y-1.5">
            {lessons.map((lesson, idx) => {
              const p = progress?.modules?.[lesson.key];
              const completed = p?.completed;
              const isActive = lesson.key === selectedLessonKey;

              return (
                <button
                  key={lesson.key}
                  onClick={() => handleSelectLesson(lesson.key)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between group ${
                    isActive
                      ? 'border-violet-500/50 bg-violet-950/30 text-white shadow-lg shadow-violet-950/40'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 mb-0.5">
                      <span>MODULE {idx + 1}</span>
                      <span>•</span>
                      <span>{lesson.read_time_minutes} MIN</span>
                    </div>
                    <div className="text-xs font-bold truncate group-hover:text-cyan-300 transition-colors">
                      {lesson.title}
                    </div>
                  </div>

                  {completed ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active lesson content */}
        {activeLesson && (
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-6">
              {/* Header */}
              <div className="pb-4 border-b border-slate-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono text-violet-400 px-2 py-0.5 rounded bg-violet-950/60 border border-violet-500/30">
                    {activeLesson.category}
                  </span>
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {activeLesson.read_time_minutes} min read
                    </span>
                    {isCompleted && (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Best Score: {bestScore}%
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  {activeLesson.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeLesson.summary}
                </p>
              </div>

              {/* Threat Anatomy */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Threat Anatomy & Mechanism
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#060a12] p-4 rounded-xl border border-slate-800/80">
                  {activeLesson.threat_anatomy}
                </p>
              </div>

              {/* Fictional Case Study */}
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/10 space-y-1.5">
                <div className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
                  PRACTICAL CASE STUDY
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{activeLesson.fictional_case_study}"
                </p>
              </div>

              {/* Warning Signs & Prevention Checklists Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    Warning Signs & Red Flags
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                    {activeLesson.warning_signs.map((sign, i) => (
                      <li key={i}>{sign}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Defensive Prevention Checklist
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                    {activeLesson.prevention_checklist.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Knowledge Check Quiz Section */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-violet-400" />
                      Knowledge Check Quiz ({activeLesson.quiz.length} Questions)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Score at least 70% to mark this module as completed.
                    </p>
                  </div>
                  {quizResult && (
                    <button
                      onClick={handleResetLessonQuiz}
                      className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Retake Quiz</span>
                    </button>
                  )}
                </div>

                {error && (
                  <AlertNotice type="warning">
                    {error}
                  </AlertNotice>
                )}

                {/* Questions */}
                <div className="space-y-4">
                  {activeLesson.quiz.map((q, qIndex) => {
                    const selectedOpt = quizAnswers[q.id];
                    const questionDetail = quizResult?.details.find((d) => d.question_id === q.id);

                    return (
                      <div
                        key={q.id}
                        className="p-4 rounded-xl border border-slate-800 bg-[#060a12] space-y-3"
                      >
                        <div className="text-xs font-bold text-slate-200">
                          Q{qIndex + 1}: {q.question}
                        </div>

                        <div className="space-y-2">
                          {q.options.map((optText, optIdx) => {
                            const isChosen = selectedOpt === optIdx;
                            let style = 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300';

                            if (quizResult) {
                              if (optIdx === q.correct_option_index) {
                                style = 'border-emerald-500/60 bg-emerald-950/30 text-emerald-300 font-semibold';
                              } else if (isChosen && optIdx !== q.correct_option_index) {
                                style = 'border-rose-500/60 bg-rose-950/30 text-rose-300';
                              } else {
                                style = 'border-slate-800/40 opacity-40 text-slate-500';
                              }
                            } else if (isChosen) {
                              style = 'border-cyan-500/60 bg-cyan-950/40 text-cyan-200 font-semibold';
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => handleSelectAnswer(q.id, optIdx)}
                                disabled={quizResult !== null}
                                className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-start gap-2.5 ${style}`}
                              >
                                <span className="font-mono text-slate-500 font-bold">
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                <span>{optText}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation when graded */}
                        {questionDetail && (
                          <div className={`p-3 rounded-lg text-xs leading-relaxed ${questionDetail.is_correct ? 'bg-emerald-950/20 text-emerald-300 border border-emerald-500/20' : 'bg-rose-950/20 text-rose-300 border border-rose-500/20'}`}>
                            <span className="font-bold font-mono">
                              {questionDetail.is_correct ? '✓ Correct! ' : '✗ Incorrect. '}
                            </span>
                            {questionDetail.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Submit Quiz button / Results Banner */}
                {!quizResult ? (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={submittingQuiz}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs font-mono tracking-wide shadow-lg shadow-violet-600/20 transition-all disabled:opacity-50"
                    >
                      {submittingQuiz ? 'Grading...' : 'Submit Knowledge Check'}
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono text-slate-400">QUIZ RESULT:</div>
                      <div className="text-base font-bold text-white">
                        Score: <span className={quizResult.passed ? 'text-emerald-400' : 'text-rose-400'}>{quizResult.score}%</span>{' '}
                        {quizResult.passed ? '• Passed & Recorded!' : '• Review and retry.'}
                      </div>
                    </div>

                    <button
                      onClick={handleResetLessonQuiz}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono"
                    >
                      Retry Quiz
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
