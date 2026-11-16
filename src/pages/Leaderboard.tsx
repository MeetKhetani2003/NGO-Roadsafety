import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Flame,
  Medal,
  School,
  Search,
  Sparkles,
  Timer,
  Trophy,
  User,
  Users,
} from "lucide-react";
import { store, type Slot, type ExamAttempt } from "@/lib/store";
import { formatClock, formatDate } from "@/lib/format";
import { exportSlotToExcel } from "@/lib/export";
import { Badge, SiteFooter, SiteHeader } from "@/components/ui";

export default function Leaderboard() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [activeSlotId, setActiveSlotId] = useState<string>("");
  const [schoolFilter, setSchoolFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const allSlots = store.getSlots();
    setSlots(allSlots);
    if (allSlots.length > 0) {
      setActiveSlotId(allSlots[0].id);
    }
  }, []);

  const currentSlot = slots.find((s) => s.id === activeSlotId);
  const attempts = store.getLeaderboard(activeSlotId);

  const schoolOptions = useMemo(() => {
    return ["all", ...new Set(attempts.map((a) => a.schoolName))];
  }, [attempts]);

  const filtered = useMemo(() => {
    return attempts.filter((a) => {
      const matchSchool = schoolFilter === "all" || a.schoolName === schoolFilter;
      const matchSearch =
        !searchQuery ||
        a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.schoolName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSchool && matchSearch;
    });
  }, [attempts, schoolFilter, searchQuery]);

  const podium = filtered.slice(0, 3);
  const visibleRows = showAll ? filtered : filtered.slice(0, 10);

  const handleExport = () => {
    if (!currentSlot) return;
    exportSlotToExcel(currentSlot, filtered);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-800 border border-amber-200 mb-3">
              <Trophy className="h-4 w-4 text-amber-600" />
              <span>Reward Ranking &amp; Distinction Engine</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900">
              Session Leaderboard
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Auto-ranked by score first, with time taken (fastest completion) as tie-breaker. Top 10 participants per session qualify for certified road safety distinction kits.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleExport}
              className="btn btn-secondary text-xs py-2.5 px-4 flex items-center gap-2"
            >
              <Download className="h-4 w-4 text-slate-500" />
              <span>Export Roster (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Slot Selector Tabs */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2">
          {slots.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSlotId(s.id)}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all ${
                activeSlotId === s.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span className="block">{s.title}</span>
              <span className="block text-[10px] font-normal opacity-80 mt-0.5">{s.schoolName}</span>
            </button>
          ))}
        </div>

        {/* Filters Row */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidate or school..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-0"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Filter School:</span>
            <select
              value={schoolFilter}
              onChange={(e) => setSchoolFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500"
            >
              <option value="all">All Participating Schools</option>
              {schoolOptions
                .filter((s) => s !== "all")
                .map((school) => (
                  <option key={school} value={school}>
                    {school}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* ---------------- PODIUM (TOP 3) ---------------- */}
        {podium.length >= 3 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-3 items-end">
            
            {/* 2nd Place Silver */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card-modern order-2 sm:order-1 p-6 bg-gradient-to-t from-slate-100 via-white to-white border-2 border-slate-300 text-center shadow-md"
            >
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 shadow-inner">
                <img src="/images/badges/silver-badge.svg" alt="Silver Medal" className="h-10 w-10 object-contain" />
              </div>
              <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-slate-700">
                Rank #2 · Silver
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-slate-900 truncate">
                {podium[1].studentName}
              </h3>
              <p className="text-xs text-slate-500 truncate">{podium[1].schoolName}</p>

              <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-200 flex items-center justify-around text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Score</span>
                  <span className="text-base font-extrabold text-slate-900">{podium[1].score}/30</span>
                </div>
                <div className="border-l border-slate-200 pl-3">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Time</span>
                  <span className="text-base font-bold text-blue-600">{formatClock(podium[1].secondsTaken)}</span>
                </div>
              </div>
            </motion.div>

            {/* 1st Place Gold */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-modern order-1 sm:order-2 p-7 bg-gradient-to-t from-amber-50 via-white to-white border-2 border-amber-300 text-center shadow-xl sm:-translate-y-3"
            >
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 shadow-inner">
                <img src="/images/badges/gold-badge.svg" alt="Gold Medal" className="h-12 w-12 object-contain" />
              </div>
              <span className="rounded-full bg-amber-200 px-3 py-0.5 text-xs font-black uppercase text-amber-900">
                Champion · Gold
              </span>
              <h3 className="mt-3 font-display text-xl font-extrabold text-slate-900 truncate">
                {podium[0].studentName}
              </h3>
              <p className="text-xs text-slate-500 truncate">{podium[0].schoolName}</p>

              <div className="mt-5 rounded-xl bg-amber-50/80 p-3.5 border border-amber-200 flex items-center justify-around text-xs">
                <div>
                  <span className="text-[10px] text-amber-800 block uppercase font-bold">Highest Score</span>
                  <span className="text-lg font-black text-slate-900">{podium[0].score}/30</span>
                </div>
                <div className="border-l border-amber-200 pl-3">
                  <span className="text-[10px] text-amber-800 block uppercase font-bold">Completion</span>
                  <span className="text-lg font-bold text-emerald-600">{formatClock(podium[0].secondsTaken)}</span>
                </div>
              </div>
            </motion.div>

            {/* 3rd Place Bronze */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-modern order-3 p-6 bg-gradient-to-t from-orange-50 via-white to-white border-2 border-amber-200 text-center shadow-md"
            >
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 shadow-inner">
                <img src="/images/badges/bronze-badge.svg" alt="Bronze Medal" className="h-10 w-10 object-contain" />
              </div>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-amber-800">
                Rank #3 · Bronze
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-slate-900 truncate">
                {podium[2].studentName}
              </h3>
              <p className="text-xs text-slate-500 truncate">{podium[2].schoolName}</p>

              <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-200 flex items-center justify-around text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Score</span>
                  <span className="text-base font-extrabold text-slate-900">{podium[2].score}/30</span>
                </div>
                <div className="border-l border-slate-200 pl-3">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Time</span>
                  <span className="text-base font-bold text-blue-600">{formatClock(podium[2].secondsTaken)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* ---------------- LEADERBOARD TABLE ---------------- */}
        <div className="mt-12 card-modern overflow-hidden bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Official Session Ranking (Top 10 Qualifiers)
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Showing {visibleRows.length} of {filtered.length} ranked candidates
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/60 font-mono text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Rank</th>
                  <th className="px-6 py-3.5">Participant</th>
                  <th className="px-6 py-3.5">Institution</th>
                  <th className="px-6 py-3.5 text-center">Score (30)</th>
                  <th className="px-6 py-3.5 text-center">Accuracy</th>
                  <th className="px-6 py-3.5 text-center">Time Taken</th>
                  <th className="px-6 py-3.5 text-right">Certificate Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleRows.map((row, index) => {
                  const rank = index + 1;
                  const isTop3 = rank <= 3;
                  const pct = Math.round(((row.score ?? 0) / (row.total || 30)) * 100);
                  return (
                    <tr
                      key={row.studentId}
                      className={isTop3 ? "bg-amber-50/20 hover:bg-amber-50/40" : "hover:bg-slate-50/80"}
                    >
                      <td className="px-6 py-4 font-mono font-extrabold text-sm">
                        {rank === 1 ? (
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-slate-950 font-black">
                            1
                          </span>
                        ) : rank === 2 ? (
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 text-slate-900 font-bold">
                            2
                          </span>
                        ) : rank === 3 ? (
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-200 text-amber-900 font-bold">
                            3
                          </span>
                        ) : (
                          <span className="text-slate-400 pl-2">#{rank}</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                            {row.studentName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{row.studentName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">Class: {row.standard}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {row.schoolName}
                      </td>

                      <td className="px-6 py-4 text-center font-bold text-slate-900 font-mono text-sm">
                        {row.score}/30
                      </td>

                      <td className="px-6 py-4 text-center font-mono">
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                          {pct}%
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center font-mono text-xs font-semibold text-blue-600">
                        {formatClock(row.secondsTaken)}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {pct >= 80 ? (
                          <Badge tone="emerald">Distinction</Badge>
                        ) : pct >= 60 ? (
                          <Badge tone="blue">Merit Pass</Badge>
                        ) : (
                          <Badge tone="slate">Participant</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length > 10 && (
            <div className="border-t border-slate-100 p-4 text-center bg-slate-50">
              <button
                onClick={() => setShowAll(!showAll)}
                className="btn btn-secondary text-xs py-2 px-4"
              >
                {showAll ? "Show Top 10 Only" : `Show All ${filtered.length} Participants`}
              </button>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
