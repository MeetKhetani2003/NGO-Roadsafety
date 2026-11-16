import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Bike,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Eye,
  FileSpreadsheet,
  Footprints,
  Gauge,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Play,
  PlayCircle,
  Radio,
  School,
  Shield,
  ShieldAlert,
  ShieldCheck,
  PhoneOff,
  Sparkles,
  Trophy,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { store, type Slot, type Campaign } from "@/lib/store";
import { formatClock, formatDate } from "@/lib/format";
import { Badge, CountUp, Marquee, MaskLine, Reveal, SectionHeading, SiteFooter, SiteHeader } from "@/components/ui";
import VolunteerForm from "@/components/VolunteerForm";

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Seatbelt Compliance",
    stat: "45% Lower Fatalities",
    body: "Belt every passenger on every journey. Unbelted rear occupants become high-speed projectiles at 50 km/h, exerting tons of lethal force on front-seat passengers.",
    tag: "Rule 125(1) CMVR",
    image: "/images/signs/seatbelt.svg",
    photoUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    color: "blue",
  },
  {
    icon: Gauge,
    title: "School Zone Speed Limits",
    stat: "30 km/h Safe Zone",
    body: "Kinetic energy doubles exponentially with speed. At 30 km/h, pedestrian survival likelihood is 90%; at 60 km/h, fatality risk jumps above 85%.",
    tag: "Statutory 30 Limit",
    image: "/images/signs/speed-30.svg",
    photoUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
    color: "amber",
  },
  {
    icon: PhoneOff,
    title: "Distracted Driving Prevention",
    stat: "4× Collision Hazard",
    body: "Glancing at a mobile screen for just 3 seconds at 60 km/h means travelling 50 metres completely blind. Voice texting impairs reaction times more than legal alcohol limits.",
    tag: "Zero Device Tolerance",
    image: "/images/signs/no-phone.svg",
    photoUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80",
    color: "rose",
  },
  {
    icon: Footprints,
    title: "Pedestrian Right of Way",
    stat: "1 in 3 Urban Casualties",
    body: "Marked zebra crossings grant pedestrians absolute statutory priority. Drivers must decelerate to 20 km/h when approaching uncontrolled school pedestrian zones.",
    tag: "Priority Right of Way",
    image: "/images/signs/pedestrian-sign.svg",
    photoUrl: "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=800&q=80",
    color: "emerald",
  },
  {
    icon: ShieldAlert,
    title: "Zero-Alcohol Driving (Sober)",
    stat: "30 mg Ceiling in India",
    body: "Section 185 MV Act strictly penalizes alcohol beyond 30mg per 100ml. Alcohol degrades peripheral vision, depth perception, and emergency braking reactions by over 300%.",
    tag: "Section 185 MV Act",
    image: "/images/signs/sober.svg",
    photoUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
    color: "purple",
  },
  {
    icon: Bike,
    title: "Certified ISI Helmet Advocacy",
    stat: "40% Head Injury Reduction",
    body: "Only full-face helmets certified under IS 4151 offer certified deceleration dissipation. An unfastened or non-standard plastic helmet dislodges before the first impact.",
    tag: "Section 129 MV Act",
    image: "/images/signs/helmet-sign.svg",
    photoUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
    color: "blue",
  },
];

const STEPS = [
  {
    step: "01",
    title: "School Link Registration",
    desc: "Students sign up via their unique teacher-assigned school link in under 90 seconds. Captures grade, contact, and two-wheeler riding experience.",
    badge: "90s Onboarding",
  },
  {
    step: "02",
    title: "Temporary Access Code",
    desc: "An 8-hour access code (e.g. RS-DEMO01) is generated instantly, granting secure single-session access without passwords or data clutter.",
    badge: "Instant Pass",
  },
  {
    step: "03",
    title: "Slot-Synchronized LMS Video",
    desc: "Official road safety training video is unlocked strictly during the scheduled time window. Once the countdown hits 0:00, video hides and exam begins.",
    badge: "Live Countdown",
  },
  {
    step: "04",
    title: "30-Question Timed Exam & Certificate",
    desc: "20-minute timed MCQ examination with instant auto-submission, instant scoring, Top 10 reward ranking, and printable verified certificate.",
    badge: "Official Certificate",
  },
];

export default function Home() {
  const [heroSlot, setHeroSlot] = useState<Slot | null>(() => store.getHeroSlot());
  const [campaigns] = useState<Campaign[]>(() => store.getCampaigns());
  const [filterCat, setFilterCat] = useState<string>("all");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
      setHeroSlot(store.getHeroSlot());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const heroTarget = heroSlot
    ? now < new Date(heroSlot.startIso).getTime()
      ? new Date(heroSlot.startIso).getTime()
      : now < new Date(heroSlot.videoEndIso).getTime()
      ? new Date(heroSlot.videoEndIso).getTime()
      : new Date(heroSlot.examEndIso).getTime()
    : 0;

  const heroRemaining = heroSlot ? Math.max(0, Math.round((heroTarget - now) / 1000)) : 0;
  const isVideoLive = heroSlot?.status === "video";
  const isExamLive = heroSlot?.status === "exam";

  const filteredCampaigns =
    filterCat === "all" ? campaigns : campaigns.filter((c) => c.category === filterCat);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      {/* ----------------- HERO SECTION ----------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200/60">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-60" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left Copy Column */}
            <div className="lg:col-span-7">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-3.5 py-1 text-xs font-bold text-blue-800 border border-blue-200 shadow-xs mb-6">
                  <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                  National Road Safety Council &amp; Timed LMS Portal
                </div>
              </Reveal>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl font-display leading-[1.12]">
                <MaskLine delay={0.05}>Empowering Young Minds.</MaskLine>
                <MaskLine delay={0.12}>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    Certified Road Safety
                  </span>
                </MaskLine>
                <MaskLine delay={0.18}>For Every Student.</MaskLine>
              </h1>

              <Reveal delay={0.22}>
                <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                  Every 3 minutes, a preventable road tragedy occurs in India. Suraksha Setu bridges the awareness gap with high schools through slot-synchronized video learning modules, a timed 30-MCQ certification engine, and automated reward leaderboards.
                </p>
              </Reveal>

              {/* CTAs */}
              <Reveal delay={0.28}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link to="/portal" className="btn btn-primary text-sm px-6 py-3 shadow-md shadow-blue-500/20">
                    <PlayCircle className="h-4 w-4" /> Enter Scheduled Slot
                  </Link>
                  <Link to="/register" className="btn btn-secondary text-sm px-5 py-3">
                    <UserPlus className="h-4 w-4 text-blue-600" /> Student Registration
                  </Link>
                  <Link to="/leaderboard" className="btn btn-secondary text-sm px-4 py-3">
                    <Trophy className="h-4 w-4 text-amber-500" /> Leaderboard
                  </Link>
                </div>
              </Reveal>

              {/* Trust Badges */}
              <Reveal delay={0.34}>
                <div className="mt-10 flex flex-wrap items-center gap-6 pt-8 border-t border-slate-200/80 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>MV Amendment Act Aligned</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>42 Partner High Schools</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Official Verified Certificates</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Live Slot Card Column */}
            <div className="lg:col-span-5">
              <Reveal delay={0.15}>
                <div className="card-modern overflow-hidden border-2 border-blue-200/80 bg-white shadow-xl shadow-blue-500/5">
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-slate-900 to-blue-950 p-5 text-white">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-200">
                        <span className={isVideoLive || isExamLive ? "h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" : "h-2.5 w-2.5 rounded-full bg-amber-400"} />
                        {isVideoLive ? "Video Slot Live" : isExamLive ? "Exam In Progress" : "Next Scheduled Batch"}
                      </span>
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-slate-200">
                        {heroSlot?.schoolName ?? "Partner Schools"}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-white line-clamp-1">
                      {heroSlot?.title ?? "Standard Road Safety Certification Slot"}
                    </h3>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    {/* Live Clock Display */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        {isVideoLive
                          ? "Video ends & Exam unlocks in"
                          : isExamLive
                          ? "Exam auto-submits in"
                          : "Scheduled Batch Starts in"}
                      </span>
                      <div className="mt-1 flex items-baseline justify-center gap-2">
                        <span className="tnum font-display text-4xl sm:text-5xl font-extrabold text-slate-900">
                          {heroSlot ? formatClock(heroRemaining) : "00:00:00"}
                        </span>
                        <span className="font-mono text-xs text-slate-500">HH:MM:SS</span>
                      </div>
                    </div>

                    {/* Slot Specifications */}
                    <div className="mt-5 grid grid-cols-3 gap-3 border-y border-slate-100 py-3 text-center text-xs">
                      <div>
                        <span className="block text-slate-400 font-medium">Video LMS</span>
                        <span className="mt-0.5 block font-bold text-slate-800">{heroSlot?.videoMinutes ?? 12} mins</span>
                      </div>
                      <div className="border-x border-slate-100">
                        <span className="block text-slate-400 font-medium">30 MCQ Exam</span>
                        <span className="mt-0.5 block font-bold text-slate-800">{heroSlot?.examMinutes ?? 20} mins</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-medium">Enrolled</span>
                        <span className="mt-0.5 block font-bold text-blue-600">
                          {heroSlot?.registeredCount ?? 45}/{heroSlot?.maxCapacity ?? 120}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
                      <Link to="/portal" className="btn btn-primary flex-1 justify-center text-sm py-2.5">
                        <span>Launch Session</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link to="/register" className="btn btn-secondary flex-1 justify-center text-sm py-2.5">
                        Get Access Code
                      </Link>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Access Code required at gate</span>
                      <span className="font-mono font-semibold text-slate-600">Demo: RS-DEMO01</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- IMPACT NUMBERS ----------------- */}
      <section className="border-b border-slate-200/80 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:gap-8">
            <div className="text-center">
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-blue-600">
                <CountUp value={48200} suffix="+" />
              </div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                Students Certified
              </div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-emerald-600">
                <CountUp value={42} suffix=" Schools" />
              </div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                Institutional Partners
              </div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-amber-500">
                <CountUp value={89} suffix="%" />
              </div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                Average Exam Score
              </div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-indigo-600">
                <CountUp value={340} suffix="+" />
              </div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                School Awareness Drives
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- SAFETY MARQUEE ----------------- */}
      <Marquee
        items={[
          "Always fasten certified ISI helmet before ignition",
          "School zones mandate strict 30 km/h ceiling",
          "Zebra crossings grant 100% legal right-of-way",
          "Hands on the wheel · Phones in the glove box",
          "Rear seatbelts prevent projectile impacts at 50 km/h",
          "Zero alcohol tolerance for all licensed motorists",
        ]}
      />

      {/* ----------------- 6 PRINCIPLES OF ROAD SAFETY ----------------- */}
      <section id="principles" className="py-20 lg:py-28 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kicker="Statutory &amp; Defensive Guidelines"
            title="The Six Pillars of Road Safety"
            blurb="Our curriculum is scientifically built upon proven behavioral safeguards recognized by the Ministry of Road Transport & Highways (MoRTH) and WHO."
          />

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p, idx) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.title} delay={idx * 0.08}>
                  <div className="card-modern group h-full overflow-hidden bg-white hover:border-blue-300">
                    {/* Realistic Photo Header with Traffic Sign Badge */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      <img
                        src={p.photoUrl}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                      
                      {/* Sign icon in corner */}
                      <div className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 p-1 shadow-md">
                        <img src={p.image} alt="Traffic Sign" className="h-7 w-7 object-contain" />
                      </div>

                      {/* Tag & Stat */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                        <span className="rounded bg-black/40 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-200">
                          {p.tag}
                        </span>
                        <span className="text-xs font-extrabold text-amber-300">
                          {p.stat}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <Icon className="h-4 w-4" />
                        </div>
                        <h3 className="font-display text-lg font-bold text-slate-900">
                          {p.title}
                        </h3>
                      </div>
                      <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ----------------- 4-STEP STUDENT JOURNEY ----------------- */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kicker="Frictionless LMS Process"
            title="How the Examination Workflow Operates"
            blurb="Engineered for school teachers and adolescent participants. Zero complex password setups, fully synchronized timers, and tamper-proof auto-submission."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, idx) => (
              <Reveal key={step.step} delay={idx * 0.1}>
                <div className="card-modern relative h-full p-6 border-slate-200 bg-slate-50/50 hover:bg-white">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-3xl font-black text-blue-600">
                      {step.step}
                    </span>
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                      {step.badge}
                    </span>
                  </div>
                  <h4 className="mt-4 font-display text-base font-bold text-slate-900">
                    {step.title}
                  </h4>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/register" className="btn btn-primary text-sm px-6 py-3">
              <span>Start Registration (Instant Code)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ----------------- CAMPAIGN SHOWCASE ----------------- */}
      <section id="campaigns" className="py-20 lg:py-28 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <SectionHeading
              align="left"
              kicker="Field Campaigns &amp; Workshops"
              title="Upcoming Awareness Drives"
              blurb="Join our active community safety camps, school seminar series, and video training workshops across campuses."
            />

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Drives" },
                { id: "school_drive", label: "School Seminars" },
                { id: "video_training", label: "Video Batches" },
                { id: "community", label: "Clinics" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCat(cat.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    filterCat === cat.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCampaigns.map((camp, idx) => (
              <Reveal key={camp.id} delay={idx * 0.08}>
                <div className="card-modern group h-full overflow-hidden bg-white flex flex-col justify-between">
                  <div>
                    {/* Visual Banner */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      <img
                        src={camp.imageUrl}
                        alt={camp.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="rounded-full bg-white/95 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold text-slate-800 shadow-sm">
                          {camp.location}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-semibold text-white">
                        <Calendar className="h-3.5 w-3.5 text-amber-400" />
                        <span>{formatDate(camp.eventDate)}</span>
                      </div>
                    </div>

                    {/* Campaign Text */}
                    <div className="p-6">
                      <h4 className="font-display text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {camp.title}
                      </h4>
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                        {camp.summary}
                      </p>
                    </div>
                  </div>

                  {/* Footer status */}
                  <div className="border-t border-slate-100 p-4 bg-slate-50 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      Capacity: <strong>{camp.seats} Students</strong>
                    </span>
                    <Link
                      to="/register"
                      className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <span>Join Slot</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- VOLUNTEER SECTION ----------------- */}
      <section id="volunteer" className="py-20 lg:py-28 bg-white border-t border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            
            {/* Left Info Panel */}
            <div className="lg:col-span-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3.5 py-1 text-xs font-bold text-rose-700 border border-rose-200 mb-4">
                <HeartHandshake className="h-4 w-4" /> Community Volunteer Drive
              </span>
              <h2 className="font-display text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Become a Suraksha Setu Safety Ambassador
              </h2>
              <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                We are mobilizing dedicated volunteers — college students, teachers, medical first-responders, and motorcycling enthusiasts — to conduct road awareness workshops and coordinate school exams.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <School className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">School Campus Education</h4>
                    <p className="text-xs text-slate-500">Conduct interactive road-safety drills and proctor timed LMS exams.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Official Certification &amp; Badge</h4>
                    <p className="text-xs text-slate-500">Earn recognized Government Volunteer Credits and field experience letter.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Flexible Scheduling</h4>
                    <p className="text-xs text-slate-500">Contribute 2–4 hours on weekends or scheduled school holiday drives.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Volunteer Form */}
            <div className="lg:col-span-7">
              <div className="card-modern p-6 sm:p-8 bg-slate-50 border border-slate-200">
                <VolunteerForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
