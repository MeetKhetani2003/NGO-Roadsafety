import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, GraduationCap, Lock, Mail, ShieldCheck, UserCheck } from "lucide-react";
import { store } from "@/lib/store";
import { useSession } from "@/lib/session";

export default function Login() {
  const navigate = useNavigate();
  const { loginStaff } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const performLogin = async (role: "admin" | "coordinator", em: string) => {
    await loginStaff(role, em);
    navigate(role === "admin" ? "/admin" : "/coordinator", { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const em = email.trim().toLowerCase();

    if (em === "admin@surakshasetu.org" && password === "admin123") {
      await performLogin("admin", em);
      return;
    }

    if (em === "meera@greenvalley.edu.in" && password === "teacher123") {
      await performLogin("coordinator", em);
      return;
    }

    // Friendly demo auto-routing
    if (em.includes("admin")) {
      await performLogin("admin", em);
      return;
    }

    if (em.includes("teacher") || em.includes("coordinator")) {
      await performLogin("coordinator", em);
      return;
    }

    setError("Invalid credentials. Please use the 1-click evaluation buttons below.");
  };

  const quickLogin = async (em: string, _pass: string, role: "admin" | "coordinator") => {
    await performLogin(role, em);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md transition-transform group-hover:scale-105">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <span className="font-display text-2xl font-black tracking-tight text-slate-900">
            SURAKSHA SETU
          </span>
        </Link>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
          Staff &amp; Coordinator Sign In
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          Restricted access for NGO Operations and School Faculty Coordinators
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-modern p-6 sm:p-8 bg-white border border-slate-200 shadow-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@surakshasetu.org"
                  required
                  className="w-full rounded-xl border border-slate-300 pl-9 pr-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-300 pl-9 pr-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full py-3 text-sm">
              <span>Sign In to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* 1-Click Demo Accounts */}
          <div className="mt-8 border-t border-slate-100 pt-6">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
              1-Click Fast Evaluation Logins:
            </span>

            <div className="grid gap-2.5">
              <button
                type="button"
                onClick={() => quickLogin("admin@surakshasetu.org", "admin123", "admin")}
                className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-left transition-all hover:bg-blue-100/70 hover:border-blue-300"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-blue-950 block">Super Admin (Operations)</span>
                    <span className="text-[10px] text-blue-700 font-mono">admin@surakshasetu.org</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-600">&rarr;</span>
              </button>

              <button
                type="button"
                onClick={() => quickLogin("meera@greenvalley.edu.in", "teacher123", "coordinator")}
                className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-left transition-all hover:bg-emerald-100/70 hover:border-emerald-300"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-emerald-950 block">School Coordinator (Teacher)</span>
                    <span className="text-[10px] text-emerald-700 font-mono">meera@greenvalley.edu.in</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600">&rarr;</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center border-t border-slate-100 pt-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Return to Public Portal
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
