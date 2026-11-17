import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart3,
  Calendar,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  FileSpreadsheet,
  GraduationCap,
  Layers,
  LayoutDashboard,
  ListChecks,
  Lock,
  LogOut,
  Mail,
  Play,
  Plus,
  Power,
  RefreshCw,
  School as SchoolIcon,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Timer,
  Trash2,
  Trophy,
  Unlock,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { store, type Slot, type School, type Student, type Volunteer, type SlotArchive, type AuditLog } from "@/lib/store";
import { formatClock, formatDate, formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui";
import { useSession } from "@/lib/session";

type AdminTab = "overview" | "slots" | "schools" | "students" | "volunteers" | "pipeline" | "audit";

export default function Admin() {
  const navigate = useNavigate();
  const { logout } = useSession();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [session, setSession] = useState(() => store.getStaffSession());

  // Data states
  const [slots, setSlots] = useState<Slot[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [archives, setArchives] = useState<SlotArchive[]>([]);
  const [audit, setAudit] = useState<AuditLog[]>([]);

  // Modals & Notices
  const [createSlotOpen, setCreateSlotOpen] = useState(false);
  const [createSchoolOpen, setCreateSchoolOpen] = useState(false);
  const [pipelineNotice, setPipelineNotice] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchStudent, setSearchStudent] = useState("");

  const refreshData = () => {
    setSlots(store.getSlots());
    setSchools(store.getSchools());
    setStudents(store.getStudents());
    setVolunteers(store.getVolunteers());
    setArchives(store.getArchives());
    setAudit(store.getAuditLogs());
  };

  useEffect(() => {
    refreshData();
    const timer = setInterval(refreshData, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  // Pipeline Module H: Finalize slot, download Excel, dispatch email, and purge
  const handleFinalizeAndPurge = (slotId: string) => {
    const res = store.finalizeSlotAndPurge(slotId);
    setPipelineNotice(
      `Workbook ${res.fileName} generated, dispatched to operations@surakshasetu.org, and buffer purged.`
    );
    refreshData();
    setTimeout(() => setPipelineNotice(null), 8000);
  };

  const handleExportVolunteers = () => {
    store.exportVolunteers();
    refreshData();
  };

  const copySchoolLink = (code: string) => {
    const url = `${window.location.origin}/register?school=${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Analytics Metrics
  const totalRegistrations = students.length;
  const attempts = store.getAttempts();
  const completedCount = attempts.filter((a) => a.status === "submitted").length;
  const activeTakers = attempts.filter((a) => a.status === "in_progress").length;
  const avgScore = completedCount
    ? (
        attempts
          .filter((a) => a.status === "submitted")
          .reduce((sum, a) => sum + (a.score || 0), 0) / completedCount
      ).toFixed(1)
    : "0";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="font-display text-base font-extrabold text-slate-900 block leading-tight">
                  Control Room
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Suraksha Setu NGO Operations
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right text-xs">
              <span className="block font-bold text-slate-900">Operations Desk</span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase">SUPER ADMIN · ACTIVE</span>
            </div>
            <Link to="/leaderboard" className="btn btn-secondary py-1.5 px-3 text-xs hidden sm:inline-flex">
              <Trophy className="h-3.5 w-3.5 text-amber-500" /> Leaderboard
            </Link>
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
        
        {/* Module H Alert Banner */}
        {pipelineNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900 shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>{pipelineNotice}</span>
            </div>
            <button onClick={() => setPipelineNotice(null)} className="text-emerald-700 hover:text-emerald-900">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-3">
          {[
            { id: "overview", label: "Overview & Analytics", icon: LayoutDashboard },
            { id: "slots", label: "Slots & Batches", icon: CalendarClock },
            { id: "schools", label: "Schools & Coordinators", icon: SchoolIcon },
            { id: "students", label: "Participants", icon: Users },
            { id: "volunteers", label: "Volunteers Roster", icon: UserPlus },
            { id: "pipeline", label: "Export & Purge (H)", icon: FileSpreadsheet },
            { id: "audit", label: "Audit Log", icon: ListChecks },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id as AdminTab)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {tab === "overview" && (
          <div className="mt-8 space-y-8">
            {/* KPI Cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="card-modern p-6 bg-white border border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Enrolled</span>
                <div className="mt-2 text-3xl font-black font-display text-slate-900">{totalRegistrations}</div>
                <span className="mt-1 block text-xs text-blue-600 font-medium">Across {schools.length} Partner Schools</span>
              </div>

              <div className="card-modern p-6 bg-white border border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Test-Takers</span>
                <div className="mt-2 text-3xl font-black font-display text-amber-500">{activeTakers}</div>
                <span className="mt-1 block text-xs text-amber-700 font-medium">In-Progress Papers</span>
              </div>

              <div className="card-modern p-6 bg-white border border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Completed &amp; Scored</span>
                <div className="mt-2 text-3xl font-black font-display text-emerald-600">{completedCount}</div>
                <span className="mt-1 block text-xs text-emerald-700 font-medium">Certificates Issued</span>
              </div>

              <div className="card-modern p-6 bg-white border border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average Score</span>
                <div className="mt-2 text-3xl font-black font-display text-blue-600">{avgScore}/30</div>
                <span className="mt-1 block text-xs text-slate-500 font-medium">Benchmark: 21/30 (70%)</span>
              </div>
            </div>

            {/* Live Active Slot Control Card */}
            <div className="card-modern overflow-hidden bg-white border border-slate-200">
              <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Active Session Real-Time Monitor
                  </h3>
                </div>
                <button
                  onClick={() => setCreateSlotOpen(true)}
                  className="btn btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Schedule New Slot
                </button>
              </div>

              <div className="p-6">
                {slots.length > 0 ? (
                  <div className="space-y-6">
                    {slots.slice(0, 2).map((slot) => (
                      <div
                        key={slot.id}
                        className="rounded-xl border border-slate-200 p-5 bg-slate-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h4 className="font-bold text-base text-slate-900">{slot.title}</h4>
                            <Badge tone={slot.accessEnabled ? "emerald" : "rose"}>
                              {slot.accessEnabled ? "Access Enabled" : "Access Paused"}
                            </Badge>
                          </div>
                          <p className="mt-1 text-xs text-slate-500">
                            School: <strong>{slot.schoolName}</strong> · Video: {slot.videoMinutes}m · Exam: {slot.examMinutes}m · Capacity: {slot.registeredCount}/{slot.maxCapacity}
                          </p>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => {
                              store.forceStartSlot(slot.id);
                              refreshData();
                            }}
                            className="btn btn-secondary text-xs py-1.5 px-3"
                          >
                            <Play className="h-3.5 w-3.5 text-blue-600" /> Start Video Now
                          </button>
                          <button
                            onClick={() => {
                              store.forceStartExam(slot.id);
                              refreshData();
                            }}
                            className="btn btn-secondary text-xs py-1.5 px-3"
                          >
                            <Clock className="h-3.5 w-3.5 text-amber-500" /> Unlock Exam Now
                          </button>
                          <button
                            onClick={() => {
                              store.toggleSlotAccess(slot.id);
                              refreshData();
                            }}
                            className="btn btn-secondary text-xs py-1.5 px-3"
                          >
                            <Power className="h-3.5 w-3.5" /> Toggle Access
                          </button>
                          <button
                            onClick={() => handleFinalizeAndPurge(slot.id)}
                            className="btn btn-primary text-xs py-1.5 px-3 bg-rose-600 hover:bg-rose-500"
                          >
                            <FileSpreadsheet className="h-3.5 w-3.5" /> End &amp; Purge (H)
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No active slots scheduled.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SLOTS & BATCHES */}
        {tab === "slots" && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-slate-900">All Scheduled Exam Slots</h3>
              <button
                onClick={() => setCreateSlotOpen(true)}
                className="btn btn-primary text-xs py-2 px-3.5"
              >
                <Plus className="h-4 w-4" /> Create New Slot
              </button>
            </div>

            <div className="card-modern overflow-hidden bg-white border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-3.5">Slot Title</th>
                    <th className="px-6 py-3.5">Target School</th>
                    <th className="px-6 py-3.5">Scheduled Time</th>
                    <th className="px-6 py-3.5 text-center">Video / Exam</th>
                    <th className="px-6 py-3.5 text-center">Enrolled</th>
                    <th className="px-6 py-3.5 text-center">Access</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {slots.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-slate-900">{s.title}</td>
                      <td className="px-6 py-4 text-slate-600">{s.schoolName}</td>
                      <td className="px-6 py-4 font-mono text-slate-500">{formatDateTime(s.startIso)}</td>
                      <td className="px-6 py-4 text-center font-mono">
                        {s.videoMinutes}m / {s.examMinutes}m
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-blue-600 font-mono">
                        {s.registeredCount}/{s.maxCapacity}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge tone={s.accessEnabled ? "emerald" : "rose"}>
                          {s.accessEnabled ? "Active" : "Paused"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            store.toggleSlotAccess(s.id);
                            refreshData();
                          }}
                          className="btn btn-secondary text-xs py-1 px-2.5"
                        >
                          {s.accessEnabled ? "Pause" : "Enable"}
                        </button>
                        <button
                          onClick={() => handleFinalizeAndPurge(s.id)}
                          className="btn btn-primary text-xs py-1 px-2.5 bg-rose-600 hover:bg-rose-500"
                        >
                          End &amp; Purge
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SCHOOLS & COORDINATORS */}
        {tab === "schools" && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-slate-900">Partner Schools &amp; Coordinators</h3>
              <button
                onClick={() => setCreateSchoolOpen(true)}
                className="btn btn-primary text-xs py-2 px-3.5"
              >
                <Plus className="h-4 w-4" /> Add Partner School
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {schools.map((sch) => (
                <div key={sch.id} className="card-modern p-6 bg-white border border-slate-200">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                        <SchoolIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-slate-900">{sch.name}</h4>
                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {sch.code}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <p>
                      <strong>Teacher Coordinator:</strong> {sch.coordinatorName}
                    </p>
                    <p>
                      <strong>Email:</strong> {sch.coordinatorEmail} · <strong>Phone:</strong> {sch.coordinatorPhone}
                    </p>
                  </div>

                  <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="truncate mr-2 font-mono text-[11px] text-slate-500">
                      /register?school={sch.code}
                    </div>
                    <button
                      onClick={() => copySchoolLink(sch.code)}
                      className="btn btn-secondary text-xs py-1 px-3 whitespace-nowrap"
                    >
                      {copiedCode === sch.code ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Copy Onboarding Link
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STUDENTS */}
        {tab === "students" && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-display text-xl font-bold text-slate-900">
                Registered Students Roster ({students.length})
              </h3>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student or phone..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs"
                />
              </div>
            </div>

            <div className="card-modern overflow-hidden bg-white border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-3.5">Student Name</th>
                    <th className="px-6 py-3.5">Access Code</th>
                    <th className="px-6 py-3.5">School</th>
                    <th className="px-6 py-3.5">Standard</th>
                    <th className="px-6 py-3.5">Contact</th>
                    <th className="px-6 py-3.5">Riding Experience</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students
                    .filter(
                      (s) =>
                        !searchStudent ||
                        s.fullName.toLowerCase().includes(searchStudent.toLowerCase()) ||
                        s.phone.includes(searchStudent)
                    )
                    .map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-bold text-slate-900">{st.fullName}</td>
                        <td className="px-6 py-4 font-mono font-bold text-blue-600">{st.accessCode}</td>
                        <td className="px-6 py-4 text-slate-600">{st.schoolName}</td>
                        <td className="px-6 py-4">Class {st.standard}-{st.section}</td>
                        <td className="px-6 py-4 font-mono text-slate-500">{st.phone}</td>
                        <td className="px-6 py-4">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                            {st.experienceLabel}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: VOLUNTEERS */}
        {tab === "volunteers" && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Registered Volunteers ({volunteers.length})
                </h3>
                <p className="text-xs text-slate-500">Community advocates and school proctors</p>
              </div>
              <button
                onClick={handleExportVolunteers}
                className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-2"
              >
                <Download className="h-4 w-4" /> Download Roster (.csv)
              </button>
            </div>

            <div className="card-modern overflow-hidden bg-white border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-3.5">Volunteer</th>
                    <th className="px-6 py-3.5">Occupation</th>
                    <th className="px-6 py-3.5">Preferred Area</th>
                    <th className="px-6 py-3.5">Availability</th>
                    <th className="px-6 py-3.5 font-mono text-right">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {volunteers.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900 block">{v.fullName}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{v.email} · {v.phone}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{v.occupation}</td>
                      <td className="px-6 py-4">
                        <Badge tone="blue">{v.area}</Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{v.availability}</td>
                      <td className="px-6 py-4 font-mono text-slate-400 text-right">{formatDate(v.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: PIPELINE MODULE H */}
        {tab === "pipeline" && (
          <div className="mt-8 space-y-6">
            <div className="card-modern p-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
              <h3 className="font-display text-xl font-bold text-white">
                Module H: Automated Excel Export, Email Dispatch &amp; Purge Pipeline
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-blue-100 max-w-3xl leading-relaxed">
                When an examination batch concludes, this automated trigger executes three pipeline actions:
                (1) Compiles student response registers into a styled Excel (.xlsx) workbook, (2) Dispatches the workbook via simulated email to operations@surakshasetu.org, and (3) Purges temporary response buffer storage while persisting high-level metrics.
              </p>
            </div>

            <div className="card-modern overflow-hidden bg-white border border-slate-200">
              <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Archived Pipeline Dispatches ({archives.length})
                </h4>
              </div>

              {archives.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {archives.map((arch) => (
                    <div key={arch.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-sm text-slate-900">{arch.slotTitle}</h5>
                          <span className="font-mono text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {arch.fileName}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          Participants: {arch.registrations} · Completed: {arch.completed} · Top Score: {arch.topScore}/30 · Purged Buffer: {arch.purgedRows} records
                        </p>
                        <p className="mt-1 text-[11px] font-mono text-emerald-700 flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Dispatched to: operations@surakshasetu.org ({formatDateTime(arch.generatedAt)})</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleFinalizeAndPurge(arch.slotId)}
                          className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                        >
                          <Download className="h-3.5 w-3.5" /> Re-Download Excel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  No batches have completed yet. Use the "End &amp; Purge" button on an active slot to trigger Module H.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: AUDIT */}
        {tab === "audit" && (
          <div className="mt-8 space-y-6">
            <h3 className="font-display text-xl font-bold text-slate-900">Immutable System Audit Log</h3>
            <div className="card-modern overflow-hidden bg-white border border-slate-200">
              <div className="divide-y divide-slate-100 font-mono text-xs">
                {audit.map((entry) => (
                  <div key={entry.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 text-[11px]">{formatDateTime(entry.timestamp)}</span>
                      <span className="rounded bg-blue-50 px-2 py-0.5 text-blue-700 font-bold text-[10px] uppercase">
                        {entry.action}
                      </span>
                      <span className="text-slate-700 font-sans text-xs">{entry.detail}</span>
                    </div>
                    <span className="text-slate-400 text-[10px] hidden sm:block">Actor: {entry.actor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* CREATE SLOT MODAL */}
      {createSlotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-modern max-w-lg w-full p-6 sm:p-8 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-display text-lg font-bold text-slate-900">Schedule Examination Slot</h3>
              <button onClick={() => setCreateSlotOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const fd = new FormData(form);
                const startMs = Date.now() + 60000;
                const vMins = Number(fd.get("videoMinutes") || 12);
                const eMins = Number(fd.get("examMinutes") || 20);
                const selectedSchool = schools.find((s) => s.id === String(fd.get("schoolId"))) || schools[0];
                store.createSlot({
                  title: String(fd.get("title") || "General Road Safety Slot"),
                  description: "Certified Road Safety Curriculum Batch",
                  schoolId: selectedSchool?.id || null,
                  schoolName: selectedSchool?.name || "Open Regional Batch",
                  startIso: new Date(startMs).toISOString(),
                  videoEndIso: new Date(startMs + vMins * 60000).toISOString(),
                  examEndIso: new Date(startMs + (vMins + eMins) * 60000).toISOString(),
                  videoMinutes: vMins,
                  examMinutes: eMins,
                  maxCapacity: Number(fd.get("maxCapacity") || 120),
                  accessEnabled: true,
                  videoUrl: "https://www.youtube.com/watch?v=n4jMF1RLyqg",
                });
                refreshData();
                setCreateSlotOpen(false);
              }}
              className="mt-4 space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Batch / Slot Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue="Senior Secondary Road Safety Certification Batch"
                  required
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Partner School</label>
                <select name="schoolId" className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-slate-900">
                  {schools.map((sch) => (
                    <option key={sch.id} value={sch.id}>
                      {sch.name} ({sch.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Video (Mins)</label>
                  <input
                    type="number"
                    name="videoMinutes"
                    defaultValue={12}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Exam (Mins)</label>
                  <input
                    type="number"
                    name="examMinutes"
                    defaultValue={20}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    name="maxCapacity"
                    defaultValue={120}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setCreateSlotOpen(false)}
                  className="btn btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs">
                  Create &amp; Publish Slot
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* CREATE SCHOOL MODAL */}
      {createSchoolOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-modern max-w-lg w-full p-6 sm:p-8 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-display text-lg font-bold text-slate-900">Register Partner School</h3>
              <button onClick={() => setCreateSchoolOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const fd = new FormData(form);
                store.createSchool({
                  name: String(fd.get("name")),
                  code: String(fd.get("code")).toUpperCase(),
                  city: "New Delhi",
                  address: "Institutional Area Campus",
                  coordinatorName: String(fd.get("coordinatorName")),
                  coordinatorEmail: String(fd.get("coordinatorEmail")),
                  coordinatorPhone: String(fd.get("coordinatorPhone")),
                });
                refreshData();
                setCreateSchoolOpen(false);
              }}
              className="mt-4 space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">School / Institute Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Modern Public Academy"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Unique School Code (for Link)</label>
                <input
                  type="text"
                  name="code"
                  required
                  placeholder="e.g. MPA-2026"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono uppercase text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Coordinator Teacher</label>
                  <input
                    type="text"
                    name="coordinatorName"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    name="coordinatorPhone"
                    required
                    placeholder="+91 98765 00000"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Coordinator Email</label>
                <input
                  type="email"
                  name="coordinatorEmail"
                  required
                  placeholder="teacher@school.edu.in"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-slate-900"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setCreateSchoolOpen(false)}
                  className="btn btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs">
                  Save School Profile
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
