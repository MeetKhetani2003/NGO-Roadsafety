import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  Award,
  BookOpen,
  ChevronRight,
  GraduationCap,
  HeartHandshake,
  Layers,
  LogOut,
  Menu,
  PhoneCall,
  PlayCircle,
  ShieldCheck,
  Trophy,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/format";
import { useSession } from "@/lib/session";

/* ------------------------- Motion Primitives ------------------------- */
export function Reveal({
  children,
  delay = 0,
  y = 20,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function MaskLine({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block"
        initial={reduce ? { y: 0 } : { y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: reduce ? 0 : 0.65, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function CountUp({ value, suffix = "", duration = 1200 }: { value: number; suffix?: string; duration?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setShown(value);
      return;
    }
    const started = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - started) / duration);
      setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduce]);

  return (
    <span ref={ref} className="tnum font-bold">
      {shown.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative flex overflow-hidden py-3 bg-slate-900 text-slate-200">
      <div className={cn("flex shrink-0 items-center gap-8 pr-8", !reduce && "animate-marquee")}>
        {[...items, ...items].map((item, i) => (
          <span key={`${item}-${i}`} className="flex shrink-0 items-center gap-4 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <span>{item}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Badge({
  tone = "slate",
  children,
  className,
}: {
  tone?: "slate" | "blue" | "emerald" | "amber" | "rose" | "purple";
  children: ReactNode;
  className?: string;
}) {
  const tones: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold leading-5", tones[tone], className)}>
      {children}
    </span>
  );
}

export function SectionHeading({
  kicker,
  title,
  blurb,
  align = "center",
}: {
  kicker?: string;
  title: ReactNode;
  blurb?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      {kicker && (
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 border border-blue-100 mb-3">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
            {kicker}
          </span>
        </Reveal>
      )}
      <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
        <MaskLine>{title}</MaskLine>
      </h2>
      {blurb && (
        <Reveal delay={0.1}>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{blurb}</p>
        </Reveal>
      )}
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="grid min-h-[50vh] place-items-center px-4 text-center">
      <div>
        <div className="relative mx-auto h-12 w-12">
          <span className="block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <ShieldCheck className="absolute inset-0 m-auto h-5 w-5 text-blue-600" />
        </div>
        {label && <p className="mt-4 text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>}
      </div>
    </div>
  );
}

export function ErrorPanel({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="card-modern p-8 text-center bg-white border border-slate-200">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 border border-rose-200">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{body}</p>
        {action && <div className="mt-6 flex justify-center gap-3">{action}</div>}
      </div>
    </div>
  );
}

/* ------------------------------ Header ------------------------------ */
import { store } from "@/lib/store";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Campaigns", to: "/#campaigns" },
  { label: "Principles", to: "/#principles" },
  { label: "Video Training", to: "/portal" },
  { label: "Take Exam", to: "/exam" },
  { label: "Leaderboard", to: "/leaderboard" },
  { label: "Volunteer", to: "/#volunteer" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { staff, student, logout } = useSession();
  const location = useLocation();

  const activeStudent = student
    ? { name: student.name }
    : store.getActiveStudent()
    ? { name: store.getActiveStudent()!.fullName }
    : null;

  const activeStaff =
    staff || (store.getStaffSession().role ? { role: store.getStaffSession().role! } : null);

  const handleLogoutStudent = () => {
    store.setActiveStudentCode(null);
    logout();
    window.location.reload();
  };

  const handleLogoutStaff = () => {
    store.setStaffSession(null, null);
    logout();
    window.location.reload();
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-200",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3"
          : "bg-white/80 backdrop-blur-sm border-b border-slate-200/50 py-4"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 shadow-md shadow-blue-500/25 transition-transform duration-200 group-hover:scale-105">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                SURAKSHA SETU
              </span>
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[0.65rem] font-bold text-blue-700">NGO</span>
            </div>
            <span className="block text-[0.7rem] font-medium text-slate-500">
              National Road Safety &amp; LMS Portal
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 xl:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  isActive && item.to !== "/" && !item.to.includes("#")
                    ? "bg-blue-50 text-blue-700 font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2.5">
          {/* Live LMS status badge */}
          <div className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span>Slot Active</span>
          </div>

          {/* Student Status or Register */}
          {activeStudent ? (
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 pl-2.5 pr-1 py-1">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {activeStudent.name.charAt(0)}
                </span>
                <span className="max-w-[100px] truncate">{activeStudent.name.split(" ")[0]}</span>
              </div>
              <button
                onClick={handleLogoutStudent}
                title="Log out student"
                className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Link to="/register" className="btn btn-primary text-xs py-2 px-3.5 hidden sm:inline-flex">
              Student Register
            </Link>
          )}

          {/* Staff Login / Workspace */}
          {activeStaff ? (
            <div className="flex items-center gap-1.5">
              <Link
                to={activeStaff.role === "admin" ? "/admin" : "/coordinator"}
                className="btn btn-secondary text-xs py-2 px-3 hidden sm:inline-flex"
              >
                <GraduationCap className="h-4 w-4 text-blue-600" />
                <span>{activeStaff.role === "admin" ? "Control Room" : "Coordinator"}</span>
              </Link>
              <button
                onClick={handleLogoutStaff}
                title="Sign out staff"
                className="hidden rounded-lg border border-slate-200 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 sm:block"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-secondary text-xs py-2 px-3 hidden sm:inline-flex">
              <User className="h-3.5 w-3.5 text-slate-500" />
              <span>Staff Login</span>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 xl:hidden"
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-t border-slate-200 bg-white shadow-xl xl:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="btn btn-primary w-full justify-center text-sm"
              >
                Student Registration
              </Link>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="btn btn-secondary w-full justify-center text-sm"
              >
                Staff / Coordinator Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ------------------------------ Footer ------------------------------ */
export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-white">
      {/* Top Banner: Emergency Helplines */}
      <div className="border-b border-slate-100 bg-slate-900 py-3 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-amber-400" />
            <span>Emergency Road Traffic Helplines (24x7 Free):</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <span>National Emergency: <strong className="text-white">112</strong></span>
            <span>•</span>
            <span>Medical Ambulance: <strong className="text-white">108</strong></span>
            <span>•</span>
            <span>National Highway Helpline: <strong className="text-white">1033</strong></span>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
        {/* Col 1: Mission */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-black tracking-tight text-slate-900">
              SURAKSHA SETU
            </span>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            A registered non-profit Road Safety Council partnering with schools, teacher coordinators, and local traffic police to eradicate preventable adolescent road casualties through education and certification.
          </p>
          <div className="mt-5 flex items-center gap-2">
            <Badge tone="blue">Vision Zero India</Badge>
            <Badge tone="emerald">ISO 39001 Compliant</Badge>
          </div>
        </div>

        {/* Col 2: Education & Modules */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Training Modules</h4>
          <ul className="mt-4 space-y-2.5 text-xs text-slate-600">
            <li>
              <Link to="/portal" className="hover:text-blue-600 flex items-center gap-1.5">
                <PlayCircle className="h-3.5 w-3.5 text-blue-500" />
                <span>Scheduled Video Session</span>
              </Link>
            </li>
            <li>
              <Link to="/exam" className="hover:text-blue-600 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                <span>30-Question MCQ Exam</span>
              </Link>
            </li>
            <li>
              <Link to="/leaderboard" className="hover:text-blue-600 flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-amber-500" />
                <span>Slot Reward Leaderboard</span>
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-blue-600 flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                <span>New Student Registration</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Institutional & Staff */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Institutional Access</h4>
          <ul className="mt-4 space-y-2.5 text-xs text-slate-600">
            <li>
              <Link to="/login" className="hover:text-blue-600 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-slate-500" />
                <span>Staff / Teacher Sign In</span>
              </Link>
            </li>
            <li>
              <Link to="/coordinator" className="hover:text-blue-600 flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-emerald-600" />
                <span>School Coordinator Desk</span>
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-blue-600 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-blue-600" />
                <span>Admin Operations Room</span>
              </Link>
            </li>
            <li>
              <Link to="/#volunteer" className="hover:text-blue-600 flex items-center gap-1.5">
                <HeartHandshake className="h-3.5 w-3.5 text-rose-500" />
                <span>Volunteer Network Drive</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Council Contact */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">NGO Secretariat</h4>
          <div className="mt-4 space-y-2 text-xs text-slate-500 leading-relaxed">
            <p><strong>National Headquarters:</strong></p>
            <p>Suraksha Setu Road Safety Foundation, Sector 18, Institutional Area, New Delhi 110001</p>
            <p className="pt-1">
              <strong>Official Email:</strong><br />
              <code className="text-blue-600 font-mono">operations@surakshasetu.org</code>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Suraksha Setu National Road Safety Council. All rights reserved.</span>
          <span className="font-mono text-[11px] text-slate-400">Motor Vehicles Amendment Act 2019 Curriculum Aligned</span>
        </div>
      </div>
    </footer>
  );
}
