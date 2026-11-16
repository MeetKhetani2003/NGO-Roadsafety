import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Bike,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  GraduationCap,
  KeyRound,
  Loader2,
  Mail,
  School,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { store, type School as SchoolType } from "@/lib/store";
import { Badge, SiteFooter, SiteHeader } from "@/components/ui";

const STANDARDS = ["6", "7", "8", "9", "10", "11", "12", "College / Poly"];
const SECTIONS = ["A", "B", "C", "D", "E"];

export default function Register() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [schools, setSchools] = useState<SchoolType[]>([]);
  const [pending, setPending] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [result, setResult] = useState<{
    ok: boolean;
    message: string;
    code?: string;
    magicLink?: string;
    schoolName?: string;
  } | null>(null);

  const schoolCode = (params.get("school") ?? "").toUpperCase();

  useEffect(() => {
    setSchools(store.getSchools());
  }, []);

  const preselected = schools.find((s) => s.code === schoolCode);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setPending(true);
    try {
      const regData = {
        fullName: String(formData.get("fullName") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        address: String(formData.get("address") || "").trim(),
        schoolId: String(formData.get("schoolId") || schools[0]?.id || ""),
        standard: String(formData.get("standard") || "10"),
        section: String(formData.get("section") || "A"),
        experience: String(formData.get("experience") || "1to3"),
        ridesToSchool: (form.elements.namedItem("ridesToSchool") as HTMLInputElement)?.checked ?? false,
      };

      if (!regData.fullName) throw new Error("Please enter your full name.");
      if (!regData.phone) throw new Error("Please enter your 10-digit mobile number.");
      if (!regData.address) throw new Error("Please enter your residential address or locality.");

      const res = store.registerStudent(regData);
      setResult({
        ok: true,
        message: "Registration successful! Your 8-hour portal access code is generated below.",
        code: res.code,
        magicLink: res.magicLink,
        schoolName: res.student.schoolName,
      });
    } catch (error) {
      setResult({
        ok: false,
        message: error instanceof Error ? error.message : "Registration could not be completed.",
      });
    } finally {
      setPending(false);
    }
  }

  const handleCopyCode = () => {
    if (!result?.code) return;
    navigator.clipboard.writeText(result.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    if (!result?.magicLink) return;
    navigator.clipboard.writeText(result.magicLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          
          {/* Main Registration Form or Success Screen */}
          <div className="lg:col-span-8">
            <div className="card-modern overflow-hidden bg-white border border-slate-200">
              
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 sm:p-8 text-white">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-200">
                  <ShieldCheck className="h-4 w-4" />
                  <span>National Student Onboarding</span>
                </div>
                <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
                  Student Examination Registration
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-blue-100 max-w-xl">
                  Fill in your details below to receive your temporary 8-hour examination pass. Required for timed video training and the 30-MCQ certification assessment.
                </p>
              </div>

              {/* Success Result View */}
              {result && result.ok ? (
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <Check className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-emerald-950">Registration Complete!</h3>
                        <p className="mt-1 text-xs text-emerald-800">{result.message}</p>
                      </div>
                    </div>
                  </div>

                  {/* Access Code Box */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Your Unique Student Access Code
                    </span>
                    <div className="mt-2 flex items-center justify-center gap-3">
                      <span className="font-mono text-3xl sm:text-4xl font-extrabold tracking-widest text-blue-600">
                        {result.code}
                      </span>
                      <button
                        onClick={handleCopyCode}
                        className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                      >
                        {copiedCode ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                        <span>{copiedCode ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Valid for <strong>8 hours</strong> across all active training slots.
                    </p>
                  </div>

                  {/* Magic Link Box */}
                  {result.magicLink && (
                    <div className="rounded-xl border border-slate-200 p-4 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="truncate max-w-md">
                        <span className="block font-bold text-slate-700">One-Click Magic Link</span>
                        <span className="font-mono text-slate-500 truncate block">{result.magicLink}</span>
                      </div>
                      <button
                        onClick={handleCopyLink}
                        className="btn btn-secondary text-xs py-1.5 px-3 whitespace-nowrap"
                      >
                        {copiedLink ? "Link Copied!" : "Copy Link"}
                      </button>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={() => navigate(`/portal?code=${result.code}`)}
                      className="btn btn-primary flex-1 justify-center py-3 text-sm"
                    >
                      <span>Proceed to Video LMS &amp; Exam</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setResult(null)}
                      className="btn btn-secondary py-3 text-sm"
                    >
                      Register Another Student
                    </button>
                  </div>
                </div>
              ) : (
                /* Registration Input Form */
                <form onSubmit={onSubmit} className="p-6 sm:p-8 space-y-6">
                  {/* Pre-linked School Banner */}
                  {preselected && (
                    <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 flex items-center gap-3">
                      <School className="h-5 w-5 text-blue-600 shrink-0" />
                      <div className="text-xs">
                        <span className="block font-bold text-blue-900">
                          Pre-linked School: {preselected.name}
                        </span>
                        <span className="text-blue-700">
                          Coordinator: {preselected.coordinatorName} ({preselected.coordinatorEmail})
                        </span>
                      </div>
                    </div>
                  )}

                  {result && !result.ok && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
                      {result.message}
                    </div>
                  )}

                  {/* Section 1: Personal Details */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2">
                      1. Student Identity
                    </h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Full Legal Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          placeholder="e.g. Aryan Sharma"
                          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Mobile / Phone Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="e.g. 9876543210"
                          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Email Address <span className="text-slate-400 font-normal">(Optional for Magic Link)</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="student@school.edu.in"
                          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Residential Address / Locality <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="address"
                          required
                          placeholder="e.g. H-42, Vasant Kunj, New Delhi"
                          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: School & Grade */}
                  <div className="pt-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2">
                      2. Institutional Enrollment
                    </h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          School / Institute
                        </label>
                        <select
                          name="schoolId"
                          defaultValue={preselected?.id ?? schools[0]?.id}
                          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                          {schools.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.code})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Standard / Grade
                        </label>
                        <select
                          name="standard"
                          defaultValue="10"
                          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                          {STANDARDS.map((std) => (
                            <option key={std} value={std}>
                              Class {std}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Class Section
                        </label>
                        <select
                          name="section"
                          defaultValue="A"
                          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                          {SECTIONS.map((sec) => (
                            <option key={sec} value={sec}>
                              Section {sec}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Two-Wheeler Experience */}
                  <div className="pt-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2">
                      3. Two-Wheeler Riding Experience
                    </h3>
                    <div className="mt-4 grid gap-3 sm:grid-cols-4">
                      {[
                        { id: "none", label: "Pillion Rider Only", sub: "Do not ride personally" },
                        { id: "under1", label: "< 1 Year", sub: "Learner / Novice" },
                        { id: "1to3", label: "1 – 3 Years", sub: "Regular commuter" },
                        { id: "3plus", label: "3+ Years", sub: "Experienced rider" },
                      ].map((exp) => (
                        <label
                          key={exp.id}
                          className="relative flex cursor-pointer flex-col rounded-xl border border-slate-200 p-3.5 text-center hover:bg-blue-50 hover:border-blue-300 has-checked:border-blue-600 has-checked:bg-blue-50/70"
                        >
                          <input
                            type="radio"
                            name="experience"
                            value={exp.id}
                            defaultChecked={exp.id === "1to3"}
                            className="sr-only"
                          />
                          <span className="font-bold text-xs text-slate-900">{exp.label}</span>
                          <span className="mt-0.5 text-[11px] text-slate-500">{exp.sub}</span>
                        </label>
                      ))}
                    </div>

                    <div className="mt-4">
                      <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700">
                        <input
                          type="checkbox"
                          name="ridesToSchool"
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>I regularly commute to school on a bicycle or two-wheeler.</span>
                      </label>
                    </div>
                  </div>

                  {/* Submission Action */}
                  <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-xs text-slate-500">
                      Access code issued instantly · No SMS delays
                    </span>
                    <button
                      type="submit"
                      disabled={pending}
                      className="btn btn-primary w-full sm:w-auto px-8 py-3 text-sm"
                    >
                      {pending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Provisioning Pass...
                        </>
                      ) : (
                        <>
                          Generate Access Code <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Sidebar: Guidelines & Fast Demo */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Demo Access Box */}
            <div className="card-modern p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-blue-200">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
                <Sparkles className="h-4 w-4" />
                <span>Quick Test / Evaluation</span>
              </div>
              <h4 className="mt-2 text-base font-bold text-slate-900">
                Skip form &amp; test portal immediately
              </h4>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Evaluating the system? Use our pre-seeded student profile to bypass the registration form.
              </p>

              <div className="mt-4 rounded-lg bg-white p-3 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Demo Access Code</span>
                  <span className="font-mono text-base font-extrabold text-blue-600">RS-DEMO01</span>
                </div>
                <Link to="/portal?code=RS-DEMO01" className="btn btn-primary text-xs py-1.5 px-3">
                  Use Code
                </Link>
              </div>
            </div>

            {/* Checklist Box */}
            <div className="card-modern p-6 bg-white border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
                LMS Session Requirements
              </h4>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Timed Video Player:</strong> Video must be watched inside the live slot window.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Auto-Locking Exam:</strong> 30 multiple-choice questions auto-submit at 20:00.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Certificate of Competence:</strong> Students scoring &ge; 70% earn an official printable certificate with QR validation.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
