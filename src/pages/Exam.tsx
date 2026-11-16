import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Flag,
  HelpCircle,
  MapPin,
  Phone,
  Printer,
  RefreshCw,
  Send,
  ShieldCheck,
  Timer,
  Trophy,
  User,
  XCircle,
} from "lucide-react";
import { store, type Student, type Slot, type ExamAttempt } from "@/lib/store";
import { MOCK_QUESTIONS } from "@/lib/mockData";
import { formatClock } from "@/lib/format";
import { Badge, SiteFooter, SiteHeader, Spinner } from "@/components/ui";
import { CertificateModal } from "@/components/CertificateModal";

export default function Exam() {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(() => store.getActiveStudent());
  const [slot, setSlot] = useState<Slot | null>(() => store.getHeroSlot());

  const [attempt, setAttempt] = useState<ExamAttempt | undefined>(() =>
    slot && student ? store.getStudentAttempt(slot.id, student.id) : undefined
  );

  const [answers, setAnswers] = useState<Record<string, number>>(() => attempt?.answers || {});
  const [flagged, setFlagged] = useState<Record<string, boolean>>(() => attempt?.flagged || {});
  const [submitting, setSubmitting] = useState(false);
  const [confirmSubmitModal, setConfirmSubmitModal] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);

  // Exam timer configuration (20 minutes = 1200 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    if (attempt?.status === "submitted") return 0;
    return 1200;
  });

  const secondsTakenRef = useRef<number>(attempt?.secondsTaken || 0);

  useEffect(() => {
    if (!student) {
      navigate("/portal");
    }
  }, [student, navigate]);

  // Exam Timer Countdown
  useEffect(() => {
    if (attempt?.status === "submitted") return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        secondsTakenRef.current += 1;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [attempt?.status]);

  const handleAnswerSelect = (qId: string, optionIdx: number) => {
    if (attempt?.status === "submitted" || secondsRemaining <= 0) return;
    const nextAnswers = { ...answers, [qId]: optionIdx };
    setAnswers(nextAnswers);
    if (slot && student) {
      store.saveExamProgress(slot.id, student.id, nextAnswers, flagged);
    }
  };

  const handleToggleFlag = (qId: string) => {
    if (attempt?.status === "submitted") return;
    const nextFlagged = { ...flagged, [qId]: !flagged[qId] };
    setFlagged(nextFlagged);
    if (slot && student) {
      store.saveExamProgress(slot.id, student.id, answers, nextFlagged);
    }
  };

  const handleFinalSubmit = useCallback(
    (isAuto = false) => {
      if (!slot || !student || submitting) return;
      setSubmitting(true);

      const finishedAttempt = store.submitExam(
        slot.id,
        student.id,
        answers,
        secondsTakenRef.current || 1200 - secondsRemaining,
        isAuto
      );

      setAttempt(finishedAttempt);
      setSubmitting(false);
      setConfirmSubmitModal(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [slot, student, submitting, answers, secondsRemaining]
  );

  const handleAutoSubmit = () => {
    handleFinalSubmit(true);
  };

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;
  const totalCount = MOCK_QUESTIONS.length;
  const isUrgent = secondsRemaining < 180 && secondsRemaining > 0;

  if (!student || !slot) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <SiteHeader />
        <Spinner label="Loading examination session…" />
      </div>
    );
  }

  /* ------------------- RESULTS & REVIEW VIEW ------------------- */
  if (attempt && attempt.status === "submitted") {
    const score = attempt.score ?? 0;
    const pct = Math.round((score / totalCount) * 100);
    const isDistinction = pct >= 80;
    const isMerit = pct >= 60;

    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <SiteHeader />

        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-modern overflow-hidden bg-white border border-slate-200 shadow-xl"
          >
            {attempt.autoSubmitted && (
              <div className="flex items-center gap-2 bg-amber-500 px-6 py-2.5 text-xs font-bold text-slate-950">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Timer reached 0:00. Your exam responses were automatically submitted and scored.</span>
              </div>
            )}

            <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 sm:p-8 text-white">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-0.5 text-xs font-semibold text-blue-100">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Official Assessment Complete
                  </span>
                  <h1 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-white">
                    Examination Results &amp; Certificate
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-blue-100 font-medium">
                    Participant: <strong>{student.fullName}</strong> ({student.schoolName}) · Roll: {student.accessCode}
                  </p>
                </div>

                {/* Score Dial & Badge */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <img
                      src={
                        isDistinction
                          ? "/images/badges/gold-badge.svg"
                          : isMerit
                          ? "/images/badges/silver-badge.svg"
                          : "/images/badges/bronze-badge.svg"
                      }
                      alt="Competence Badge"
                      className="h-16 w-16 object-contain drop-shadow"
                    />
                    <span className="mt-1 block text-xs font-extrabold text-amber-300">
                      {isDistinction ? "Distinction" : isMerit ? "Merit Pass" : "Participant"}
                    </span>
                  </div>

                  <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 text-center border border-white/20">
                    <span className="text-3xl sm:text-4xl font-black font-display text-white">
                      {score}<span className="text-xl font-normal text-blue-200">/{totalCount}</span>
                    </span>
                    <span className="block text-[11px] font-bold text-blue-200 mt-0.5">{pct}% Score</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics cards */}
            <div className="grid gap-4 border-b border-slate-200 p-6 sm:grid-cols-3 bg-slate-50">
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
                <Trophy className="mx-auto h-5 w-5 text-amber-500" />
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                  Batch Rank
                </span>
                <span className="font-display text-2xl font-extrabold text-slate-900">
                  {attempt.rank ? `#${attempt.rank}` : "Top 10"}
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
                <Clock className="mx-auto h-5 w-5 text-blue-600" />
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                  Time Taken
                </span>
                <span className="font-display text-2xl font-extrabold text-slate-900">
                  {formatClock(attempt.secondsTaken)}
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
                <Award className="mx-auto h-5 w-5 text-emerald-600" />
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                  Passing Status
                </span>
                <span className="font-display text-2xl font-extrabold text-emerald-600">
                  {pct >= 60 ? "CERTIFIED PASS" : "NEEDS PRACTICE"}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="p-6 flex flex-wrap gap-3 items-center justify-between bg-white">
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => setCertModalOpen(true)}
                  className="btn btn-primary text-xs py-2.5 px-4 shadow-sm"
                >
                  <Printer className="h-4 w-4" /> View &amp; Print Official Certificate
                </button>
                <Link to="/leaderboard" className="btn btn-secondary text-xs py-2.5 px-4">
                  <Trophy className="h-4 w-4 text-amber-500" /> Check Slot Leaderboard
                </Link>
              </div>
              <Link to="/portal" className="text-xs text-blue-600 font-bold hover:underline">
                Return to Video Portal &rarr;
              </Link>
            </div>
          </motion.div>

          {/* Question by Question Detailed Rationale */}
          <div className="mt-10">
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Curriculum Review &amp; Statutory Explanations
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Green denotes correct responses, red denotes incorrect submissions. Click to expand statutory legal notes.
            </p>

            <div className="mt-6 space-y-3">
              {MOCK_QUESTIONS.map((q, idx) => {
                const chosen = attempt.answers[q.id];
                const isCorrect = chosen === q.correct;

                return (
                  <details
                    key={q.id}
                    className="card-modern group p-5 bg-white border border-slate-200 transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex cursor-pointer items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span className={`mt-0.5 shrink-0 ${isCorrect ? "text-emerald-600" : "text-rose-600"}`}>
                          {isCorrect ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 leading-snug">
                            <span className="font-mono text-xs text-slate-400 mr-2">
                              Q{idx + 1} · {q.topic.toUpperCase()}
                            </span>
                            {q.prompt}
                          </p>
                        </div>
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" />
                    </summary>

                    <div className="mt-4 border-t border-slate-100 pt-4 text-xs space-y-2">
                      {q.imageUrl && (
                        <div className="my-2 flex justify-start">
                          <img
                            src={q.imageUrl}
                            alt="Traffic Sign"
                            className="h-16 w-16 object-contain bg-slate-50 p-2 rounded-lg border border-slate-200"
                          />
                        </div>
                      )}

                      {q.options.map((opt, oi) => {
                        const isThisCorrect = oi === q.correct;
                        const isThisChosen = oi === chosen;

                        return (
                          <div
                            key={oi}
                            className={`flex items-center justify-between rounded-lg px-3.5 py-2 text-xs ${
                              isThisCorrect
                                ? "bg-emerald-50 text-emerald-900 font-bold border border-emerald-200"
                                : isThisChosen
                                ? "bg-rose-50 text-rose-900 border border-rose-200 font-semibold"
                                : "text-slate-600 bg-slate-50"
                            }`}
                          >
                            <span>
                              <span className="font-mono mr-2">{String.fromCharCode(65 + oi)}.</span>
                              {opt}
                            </span>
                            {isThisCorrect && (
                              <span className="text-[10px] uppercase font-bold text-emerald-700">Correct Answer</span>
                            )}
                            {isThisChosen && !isThisCorrect && (
                              <span className="text-[10px] uppercase font-bold text-rose-700">Your Response</span>
                            )}
                          </div>
                        );
                      })}

                      <div className="mt-3 rounded-lg bg-blue-50/70 p-3 text-slate-700 text-xs leading-relaxed border border-blue-100">
                        <strong className="text-blue-900 font-bold">Statutory legal rule:</strong> {q.explanation}
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        </div>

        {/* Certificate Modal */}
        <CertificateModal
          isOpen={certModalOpen}
          onClose={() => setCertModalOpen(false)}
          studentName={student.fullName}
          schoolName={student.schoolName}
          accessCode={student.accessCode}
          score={attempt.score || 0}
          total={totalCount}
          dateStr={new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        />
        <SiteFooter />
      </div>
    );
  }

  /* ------------------- ACTIVE CBT EXAMINATION INTERFACE ------------------- */
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      
      {/* Sticky CBT Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-display text-base font-extrabold text-slate-900">
                  Road Safety Certification Examination
                </h1>
                <span className="block text-[11px] font-medium text-slate-500">
                  {slot.title} · 30 Multiple Choice Questions
                </span>
              </div>
            </div>

            {/* Countdown Exam Timer */}
            <div
              className={`flex items-center gap-2.5 rounded-xl border px-4 py-2 font-mono ${
                isUrgent
                  ? "border-rose-400 bg-rose-50 text-rose-700 animate-pulse font-bold"
                  : "border-blue-200 bg-blue-50 text-blue-900"
              }`}
            >
              <Timer className="h-5 w-5 text-blue-600" />
              <div>
                <span className="text-[10px] font-bold block uppercase tracking-wider text-slate-500">Time Remaining</span>
                <span className="font-display text-xl font-bold leading-none">{formatClock(secondsRemaining)}</span>
              </div>
            </div>

            <button
              onClick={() => setConfirmSubmitModal(true)}
              className="btn btn-primary text-xs py-2 px-4 shadow-sm"
            >
              <Send className="h-3.5 w-3.5" /> Submit Assessment
            </button>
          </div>

          {/* Module E Requirement: Header Details Display Student Name, Cell No, Address, Riding Experience */}
          <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-2 text-xs sm:grid-cols-4">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Candidate</span>
              <strong className="text-slate-900 truncate block">{student.fullName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Mobile Number</span>
              <span className="text-slate-800 font-mono">{student.phone}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Residential Address</span>
              <span className="text-slate-800 truncate block">{student.address}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Riding Experience</span>
              <span className="font-bold text-blue-700">{student.experienceLabel}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          
          {/* Main Question Cards Section */}
          <div className="lg:col-span-8 space-y-6">
            <div className="card-modern p-4 bg-white border border-slate-200 flex items-center justify-between text-xs font-medium text-slate-600">
              <div>
                Answered: <strong className="text-emerald-600 font-bold">{answeredCount}</strong> / {totalCount} · Flagged:{" "}
                <strong className="text-amber-600 font-bold">{flaggedCount}</strong>
              </div>
              <div className="text-slate-400 hidden sm:block">
                Auto-saved on click · 1 mark per question
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {MOCK_QUESTIONS.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isFlagged = flagged[q.id];

                return (
                  <article
                    key={q.id}
                    id={`question-${q.id}`}
                    className={`card-modern overflow-hidden bg-white border p-6 transition-all duration-150 ${
                      isFlagged
                        ? "border-amber-400 ring-2 ring-amber-100"
                        : isAnswered
                        ? "border-blue-300"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                          {idx + 1}
                        </span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                          {q.topic}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleFlag(q.id)}
                        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold transition-colors ${
                          isFlagged
                            ? "border-amber-300 bg-amber-50 text-amber-800"
                            : "border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        <Flag className="h-3 w-3" />
                        <span>{isFlagged ? "Flagged" : "Flag"}</span>
                      </button>
                    </div>

                    {/* Question Prompt */}
                    <h3 className="mt-4 text-base font-bold leading-relaxed text-slate-900">
                      {q.prompt}
                    </h3>

                    {/* Optional Road Sign Image */}
                    {q.imageUrl && (
                      <div className="my-4 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <img
                          src={q.imageUrl}
                          alt="Road Safety Sign"
                          className="h-20 w-20 object-contain drop-shadow-sm"
                        />
                      </div>
                    )}

                    {/* 4 Choices */}
                    <div className="mt-5 space-y-2.5">
                      {q.options.map((opt, oi) => {
                        const selected = answers[q.id] === oi;
                        return (
                          <label
                            key={oi}
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-xs sm:text-sm transition-all duration-150 ${
                              selected
                                ? "border-blue-600 bg-blue-50 text-blue-950 font-semibold shadow-xs"
                                : "border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 hover:bg-slate-100/50"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`q-${q.id}`}
                              checked={selected}
                              onChange={() => handleAnswerSelect(q.id, oi)}
                              className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="font-mono text-xs font-bold text-slate-400">
                              {String.fromCharCode(65 + oi)}.
                            </span>
                            <span className="flex-1 leading-relaxed">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Sticky 30-Question Grid Palette Sidebar */}
          <aside className="lg:col-span-4 sticky top-28 space-y-5">
            <div className="card-modern p-6 bg-white border border-slate-200 shadow-md">
              <h4 className="font-display text-base font-bold text-slate-900">Question Palette</h4>
              <p className="mt-0.5 text-xs text-slate-500">Quick jump across 30 MCQs</p>

              {/* Progress Bar */}
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300"
                  style={{ width: `${(answeredCount / totalCount) * 100}%` }}
                />
              </div>

              {/* Palette 30 Question Pills */}
              <div className="mt-5 grid grid-cols-5 gap-2 text-xs">
                {MOCK_QUESTIONS.map((q, idx) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isFlagged = flagged[q.id];

                  let pillClass = "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100";
                  if (isFlagged) {
                    pillClass = "border-amber-400 bg-amber-100 text-amber-900 font-bold";
                  } else if (isAnswered) {
                    pillClass = "border-blue-600 bg-blue-600 text-white font-bold";
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        const el = document.getElementById(`question-${q.id}`);
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                      }}
                      className={`grid h-9 place-items-center rounded-lg border font-mono text-xs transition-colors ${pillClass}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded bg-blue-600" />
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded bg-amber-400" />
                  <span>Flagged for review ({flaggedCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded bg-slate-100 border border-slate-200" />
                  <span>Unanswered ({totalCount - answeredCount})</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfirmSubmitModal(true)}
                className="btn btn-primary mt-6 w-full justify-center text-xs py-3"
              >
                Submit Examination
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Confirmation Modal */}
      {confirmSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-modern max-w-md w-full p-6 bg-white shadow-2xl text-center"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-3">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900">Submit Your Exam Paper?</h3>
            <p className="mt-2 text-xs text-slate-600">
              You have answered <strong className="text-blue-600 font-bold">{answeredCount}</strong> of {totalCount} questions.
              {totalCount - answeredCount > 0 && (
                <span className="block mt-1 text-rose-600 font-bold text-xs">
                  {totalCount - answeredCount} questions are still unanswered.
                </span>
              )}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Once submitted, answers cannot be edited and your final score will be entered onto the slot leaderboard.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmSubmitModal(false)}
                className="btn btn-secondary flex-1 justify-center text-xs"
              >
                Keep Reviewing
              </button>
              <button
                type="button"
                onClick={() => handleFinalSubmit(false)}
                className="btn btn-primary flex-1 justify-center text-xs"
              >
                Yes, Final Submit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
