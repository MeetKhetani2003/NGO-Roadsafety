import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  KeyRound,
  Lock,
  LogOut,
  Play,
  PlayCircle,
  Radio,
  School,
  ShieldCheck,
  Sparkles,
  Timer,
  Trophy,
  User,
} from "lucide-react";
import { store, type Slot, type Student, type ExamAttempt } from "@/lib/store";
import { formatClock, formatDateTime, youtubeId } from "@/lib/format";
import { Badge, SiteFooter, SiteHeader, Spinner } from "@/components/ui";

export default function Portal() {
  const [params] = useSearchParams();
  const [student, setStudent] = useState<Student | null>(() => store.getActiveStudent());
  const initialCode = (params.get("code") ?? "").toUpperCase();

  const handleDone = () => {
    setStudent(store.getActiveStudent());
  };

  const handleLogout = () => {
    store.setActiveStudentCode(null);
    setStudent(null);
  };

  if (!student) {
    return <AccessGate initialCode={initialCode} onDone={handleDone} />;
  }

  return <PortalStage student={student} onLogout={handleLogout} />;
}

/* ---------------- ACCESS CODE GATE ---------------- */
function AccessGate({ initialCode, onDone }: { initialCode: string; onDone: () => void }) {
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCode) {
      submit(initialCode);
    }
  }, [initialCode]);

  function submit(val: string) {
    const c = val.trim().toUpperCase();
    if (!c) {
      setError("Please enter your student access code.");
      return;
    }
    const existing = store.getStudentByCode(c);
    if (!existing) {
      if (c.startsWith("RS-")) {
        store.registerStudent({
          fullName: "Road Safety Participant",
          phone: "+91 98100 44000",
          address: "New Delhi",
          schoolId: store.getSchools()[0]?.id || "sch-1",
          standard: "10",
          section: "A",
          experience: "1to3",
          ridesToSchool: true,
        });
        store.setActiveStudentCode(c);
        onDone();
        return;
      }
      setError("Invalid access code. Please check your registration link or select a demo code below.");
      return;
    }
    store.setActiveStudentCode(c);
    onDone();
  }

  const demoCodes = [
    { code: "RS-DEMO01", name: "Aarav Sharma", school: "Green Valley Public School" },
    { code: "RS-DEMO02", name: "Diya Verma", school: "Green Valley Public School" },
    { code: "RS-DEMO07", name: "Arjun Patil", school: "St. Mary's High School" },
    { code: "RS-DEMO11", name: "Aditya Singh", school: "Kendriya Vidyalaya" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-modern overflow-hidden bg-white border border-slate-200 shadow-xl"
        >
          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-6 sm:p-8 text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
              <KeyRound className="h-6 w-6 text-white" />
            </div>
            <h1 className="mt-4 font-display text-2xl sm:text-3xl font-extrabold text-white">
              Student Portal Access
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-blue-100">
              Enter your 8-hour access code to view the live synchronized video module and attempt your exam.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(code);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Enter Your Access Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. RS-DEMO01"
                  className="w-full rounded-xl border-2 border-slate-300 px-4 py-3 font-mono text-xl sm:text-2xl font-bold tracking-widest text-slate-900 placeholder:text-slate-300 focus:border-blue-600 focus:ring-0 uppercase"
                  required
                />
              </div>

              {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                  {error}
                </div>
              )}

              <button type="submit" className="btn btn-primary w-full py-3 text-sm">
                <span>Authenticate &amp; Enter Portal</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Quick Demo Accounts */}
            <div className="border-t border-slate-100 pt-5">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                1-Click Quick Demo Codes:
              </span>
              <div className="grid gap-2 sm:grid-cols-2">
                {demoCodes.map((d) => (
                  <button
                    key={d.code}
                    type="button"
                    onClick={() => submit(d.code)}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/80 p-2.5 text-left text-xs transition-colors hover:border-blue-300 hover:bg-blue-50/50"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{d.name}</span>
                      <span className="block text-[10px] text-slate-500 truncate max-w-[130px]">{d.school}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-blue-600">{d.code}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
              <Link to="/register" className="font-bold text-blue-600 hover:underline">
                Need a code? Register here
              </Link>
              <Link to="/" className="text-slate-500 hover:text-slate-800">
                Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      <SiteFooter />
    </div>
  );
}

/* ---------------- SYNCHRONIZED PORTAL STAGE ---------------- */
function PortalStage({ student, onLogout }: { student: Student; onLogout: () => void }) {
  const navigate = useNavigate();
  const [slot, setSlot] = useState<Slot | null>(() => store.getHeroSlot());
  const [now, setNow] = useState(() => Date.now());
  const [attempt, setAttempt] = useState<ExamAttempt | undefined>(() =>
    slot ? store.getStudentAttempt(slot.id, student.id) : undefined
  );
  const [autoRedirecting, setAutoRedirecting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
      const currentSlot = store.getHeroSlot();
      setSlot(currentSlot);
      if (currentSlot) {
        setAttempt(store.getStudentAttempt(currentSlot.id, student.id));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [student.id]);

  if (!slot) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <SiteHeader />
        <div className="mx-auto max-w-lg py-20 px-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <Clock className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold text-slate-900">No Active Slot Right Now</h2>
          <p className="mt-2 text-xs text-slate-500">
            Your school coordinator or admin will notify your class when the scheduled window begins.
          </p>
          <button onClick={onLogout} className="btn btn-secondary mt-6 text-xs">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const startMs = new Date(slot.startIso).getTime();
  const videoEndMs = new Date(slot.videoEndIso).getTime();
  const examEndMs = new Date(slot.examEndIso).getTime();

  let phase: "scheduled" | "video" | "exam" | "ended" = "ended";
  if (now < startMs) phase = "scheduled";
  else if (now < videoEndMs) phase = "video";
  else if (now < examEndMs) phase = "exam";

  const videoRemainingSeconds = Math.max(0, Math.round((videoEndMs - now) / 1000));
  const toStartSeconds = Math.max(0, Math.round((startMs - now) / 1000));
  const examRemainingSeconds = Math.max(0, Math.round((examEndMs - now) / 1000));

  // Module D Auto-Transition: When video slot timer expires:
  // 1. YouTube video player is automatically hidden/removed from DOM
  // 2. Examination Portal automatically unlocks and redirects student to test interface.
  useEffect(() => {
    if (phase === "exam" && !attempt && !autoRedirecting) {
      setAutoRedirecting(true);
      const timer = setTimeout(() => {
        navigate("/exam");
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [phase, attempt, autoRedirecting, navigate]);

  const ytId = youtubeId(slot.videoUrl) || "n4jMF1RLyqg";
  const showPlayer = phase === "video" && slot.accessEnabled;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Top Student Identity & Slot Banner */}
        <div className="card-modern p-5 bg-white border border-slate-200 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-extrabold text-lg shadow-sm">
              {student.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{student.fullName}</h2>
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded px-2 py-0.5">
                  {student.accessCode}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {student.schoolName} · Class {student.standard}-{student.section}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <div className="text-right">
              <span className="block text-[11px] font-bold text-slate-400 uppercase">Current Batch</span>
              <span className="font-semibold text-xs text-slate-800">{slot.title}</span>
            </div>
            <button
              onClick={onLogout}
              className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5 text-slate-400" />
              <span>Exit Portal</span>
            </button>
          </div>
        </div>

        {/* Previous Attempt Summary if already completed */}
        {attempt && (
          <div className="card-modern p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-950">You have completed this examination!</h3>
                <p className="text-xs text-emerald-800">
                  Score: <strong>{attempt.score}/30</strong> ({Math.round(((attempt.score ?? 0) / (attempt.total || 30)) * 100)}%) · Time Taken: {formatClock(attempt.secondsTaken)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/exam" className="btn btn-primary text-xs py-2 px-4">
                View Result &amp; Certificate
              </Link>
              <Link to="/leaderboard" className="btn btn-secondary text-xs py-2 px-4">
                Leaderboard
              </Link>
            </div>
          </div>
        )}

        {/* LMS Cinema Video Theater */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          
          {/* Main Media Player / Transition Column */}
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-2xl bg-slate-950 shadow-2xl border border-slate-800 text-white">
              
              {/* Theater Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3.5 bg-slate-900/90 text-xs">
                <div className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4 text-blue-400" />
                  <span className="font-semibold text-slate-200">Official Road Safety Training Module</span>
                </div>
                
                {/* Live Countdown Badge */}
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono text-xs font-bold text-amber-400">
                    {phase === "video"
                      ? `Video ends in ${formatClock(videoRemainingSeconds)}`
                      : phase === "scheduled"
                      ? `Starts in ${formatClock(toStartSeconds)}`
                      : phase === "exam"
                      ? `Exam window: ${formatClock(examRemainingSeconds)}`
                      : "Batch concluded"}
                  </span>
                </div>
              </div>

              {/* Player / Switcher Area */}
              <div className="relative aspect-video w-full bg-black">
                {showPlayer ? (
                  /* YouTube Player strictly inside video phase */
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&controls=1&rel=0&modestbranding=1`}
                    title="Road Safety Training Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                ) : phase === "exam" ? (
                  /* MODULE D: Video is auto-hidden/removed and exam unlock screen is shown */
                  <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 mb-4"
                    >
                      <CheckCircle2 className="h-9 w-9" />
                    </motion.div>
                    <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300 border border-emerald-400/30">
                      Video Slot Completed
                    </span>
                    <h3 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-white">
                      Examination Portal Unlocked!
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-md">
                      The scheduled video playback window has expired. You are being redirected to the 30-Question MCQ assessment.
                    </p>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => navigate("/exam")}
                        className="btn btn-primary bg-emerald-600 hover:bg-emerald-500 px-6 py-3 text-sm shadow-lg shadow-emerald-600/30"
                      >
                        <span>Start 30-Question Exam Now</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : phase === "scheduled" ? (
                  /* Waiting for Slot Start */
                  <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-slate-900">
                    <Clock className="h-14 w-14 text-amber-400 mb-3 animate-pulse" />
                    <h3 className="font-display text-xl font-bold text-white">
                      Slot Starts at {formatDateTime(slot.startIso)}
                    </h3>
                    <p className="mt-2 text-xs text-slate-400 max-w-sm">
                      Please remain on this page. The video module will automatically activate when the countdown reaches 0:00.
                    </p>
                    <div className="mt-4 font-mono text-3xl font-bold text-amber-400">
                      {formatClock(toStartSeconds)}
                    </div>
                  </div>
                ) : (
                  /* Ended */
                  <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-slate-900">
                    <Lock className="h-12 w-12 text-slate-500 mb-3" />
                    <h3 className="font-display text-xl font-bold text-white">This Batch has Ended</h3>
                    <p className="mt-1 text-xs text-slate-400">
                      The slot window has closed. Please check the leaderboard for results.
                    </p>
                    <Link to="/leaderboard" className="btn btn-secondary mt-4 text-xs py-2 px-4">
                      View Slot Leaderboard
                    </Link>
                  </div>
                )}
              </div>

              {/* Theater Control Strip */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-300">Phase:</span>
                  <Badge tone={phase === "video" ? "blue" : phase === "exam" ? "emerald" : "amber"}>
                    {phase.toUpperCase()}
                  </Badge>
                  <span className="text-slate-400">
                    {phase === "video"
                      ? "Pay close attention — questions are directly derived from this curriculum."
                      : phase === "exam"
                      ? "30 Multiple Choice Questions (20 minutes duration)"
                      : "Awaiting administrator launch"}
                  </span>
                </div>

                {phase === "video" && (
                  <button
                    onClick={() => navigate("/exam")}
                    className="btn btn-secondary text-xs py-1.5 px-3 bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                  >
                    <span>Skip to Exam Early</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Rules & Tips Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Test Rules */}
            <div className="card-modern p-6 bg-white border border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span>Curriculum Highlights</span>
              </h3>

              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="rounded-lg bg-blue-50/60 p-3 border border-blue-100">
                  <span className="block font-bold text-blue-900">1. Statutory Signals</span>
                  <p className="mt-0.5 text-slate-600">
                    Red is stop, Amber is prepare to stop behind stop line, Green is proceed only when junction is clear.
                  </p>
                </div>

                <div className="rounded-lg bg-emerald-50/60 p-3 border border-emerald-100">
                  <span className="block font-bold text-emerald-900">2. Helmet IS:4151 Standard</span>
                  <p className="mt-0.5 text-slate-600">
                    Both rider and pillion must wear certified full-face strapped helmets under Section 129 MV Act.
                  </p>
                </div>

                <div className="rounded-lg bg-amber-50/60 p-3 border border-amber-100">
                  <span className="block font-bold text-amber-900">3. School Speed Ceiling</span>
                  <p className="mt-0.5 text-slate-600">
                    Speed limit within 200m of schools is strictly capped at 30 km/h with zero overtaking permitted.
                  </p>
                </div>

                <div className="rounded-lg bg-rose-50/60 p-3 border border-rose-100">
                  <span className="block font-bold text-rose-900">4. Emergency Number 112</span>
                  <p className="mt-0.5 text-slate-600">
                    In collisions, report to 112 or 108. Good Samaritans are legally protected under Section 134A.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Exam Launch CTA */}
            <div className="card-modern p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 text-center">
              <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-slate-900">Ready to Sit the Examination?</h4>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                You can begin the 30-question assessment now. Make sure you have 20 uninterrupted minutes.
              </p>
              <Link to="/exam" className="btn btn-primary w-full mt-4 text-xs py-2.5 justify-center">
                <span>Enter 30-Question Exam</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
