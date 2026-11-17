import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarClock,
  Check,
  CheckCircle2,
  Copy,
  GraduationCap,
  LogOut,
  Mail,
  Phone,
  School as SchoolIcon,
  ShieldCheck,
  Timer,
  Trophy,
  Users,
} from "lucide-react";
import { store, type School, type Slot, type Student } from "@/lib/store";
import { formatDate } from "@/lib/format";
import { Badge, SiteFooter, SiteHeader } from "@/components/ui";
import { useSession } from "@/lib/session";

export default function Coordinator() {
  const navigate = useNavigate();
  const { logout } = useSession();
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const schs = store.getSchools();
    setSchools(schs);
    if (schs.length > 0) {
      setSelectedSchoolId(schs[0].id);
    }
  }, []);

  const school = schools.find((s) => s.id === selectedSchoolId) || schools[0];
  const allStudents = store.getStudents();
  const schoolStudents = school ? allStudents.filter((s) => s.schoolId === school.id) : [];
  const schoolSlots = store.getSlots().filter((s) => !s.schoolId || s.schoolId === school?.id);
  const attempts = store.getAttempts().filter((a) => a.schoolName === school?.name);
  const completedAttempts = attempts.filter((a) => a.status === "submitted");

  const avgScore = completedAttempts.length
    ? (completedAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / completedAttempts.length).toFixed(1)
    : "0";

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  if (!school) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 p-8 text-center">
        <p>Loading Coordinator Desk…</p>
      </div>
    );
  }

  const onboardingLink = `${window.location.origin}/register?school=${school.code}`;

  const copyLink = () => {
    navigator.clipboard.writeText(onboardingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      
      {/* Top Coordinator Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <span className="font-display text-base font-extrabold text-slate-900 block leading-tight">
                  Coordinator Desk
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  {school.name}
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Switch School Dropdown */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Viewing School:</span>
              <select
                value={selectedSchoolId}
                onChange={(e) => setSelectedSchoolId(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-900 font-bold"
              >
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-secondary py-1.5 px-3 text-xs text-slate-600 hover:text-slate-900"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* School Profile & Onboarding Link Card */}
        <div className="card-modern p-6 sm:p-8 bg-white border border-slate-200 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {school.name}
                </h1>
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Code: {school.code}
                </span>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-slate-600">
                Teacher Coordinator: <strong>{school.coordinatorName}</strong> · Email: {school.coordinatorEmail} · Phone: {school.coordinatorPhone}
              </p>
            </div>

            {/* Unique Registration Link Box */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 max-w-md w-full">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-blue-900 mb-1">
                Unique Student Onboarding Link
              </span>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-slate-600 truncate">{onboardingLink}</span>
                <button
                  onClick={copyLink}
                  className="btn btn-primary text-xs py-1.5 px-3 whitespace-nowrap shadow-xs"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy Link
                    </>
                  )}
                </button>
              </div>
              <span className="block text-[10px] text-blue-700 mt-1">
                Share with class groups · Auto-fills school name on registration
              </span>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid gap-6 sm:grid-cols-3 mb-8">
          <div className="card-modern p-6 bg-white border border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Registered</span>
            <div className="mt-2 text-3xl font-black font-display text-slate-900">{schoolStudents.length}</div>
            <span className="mt-1 block text-xs text-slate-500">Class 9, 10, 11 &amp; 12</span>
          </div>

          <div className="card-modern p-6 bg-white border border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Exams Completed</span>
            <div className="mt-2 text-3xl font-black font-display text-emerald-600">{completedAttempts.length}</div>
            <span className="mt-1 block text-xs text-emerald-700 font-medium">
              {schoolStudents.length ? Math.round((completedAttempts.length / schoolStudents.length) * 100) : 0}% Completion Rate
            </span>
          </div>

          <div className="card-modern p-6 bg-white border border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Class Average Score</span>
            <div className="mt-2 text-3xl font-black font-display text-blue-600">{avgScore}/30</div>
            <span className="mt-1 block text-xs text-blue-700 font-medium">Passing Benchmark: 21 (70%)</span>
          </div>
        </div>

        {/* Student Roster Table */}
        <div className="card-modern overflow-hidden bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              School Student Roster ({schoolStudents.length})
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Live status for {school.name}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/60 font-mono text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Student Name</th>
                  <th className="px-6 py-3.5">Access Code</th>
                  <th className="px-6 py-3.5">Class &amp; Section</th>
                  <th className="px-6 py-3.5">Contact Number</th>
                  <th className="px-6 py-3.5 text-center">Score</th>
                  <th className="px-6 py-3.5 text-right">LMS Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schoolStudents.map((st) => {
                  const studentAttempt = attempts.find((a) => a.studentId === st.id);
                  const isSubmitted = studentAttempt?.status === "submitted";

                  return (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-slate-900">{st.fullName}</td>
                      <td className="px-6 py-4 font-mono font-bold text-blue-600">{st.accessCode}</td>
                      <td className="px-6 py-4 text-slate-600">Class {st.standard}-{st.section}</td>
                      <td className="px-6 py-4 font-mono text-slate-500">{st.phone}</td>
                      <td className="px-6 py-4 text-center font-mono font-bold">
                        {isSubmitted ? `${studentAttempt.score}/30` : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isSubmitted ? (
                          <Badge tone="emerald">Certified Complete</Badge>
                        ) : studentAttempt?.status === "in_progress" ? (
                          <Badge tone="amber">Writing Exam</Badge>
                        ) : (
                          <Badge tone="slate">Registered</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
