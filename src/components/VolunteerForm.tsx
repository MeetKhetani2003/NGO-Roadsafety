import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, HeartHandshake, Loader2, Send } from "lucide-react";
import { api, type Result } from "@/lib/api";
import { AVAILABILITY, REFERRALS, VOLUNTEER_AREAS } from "@/lib/format";

export default function VolunteerForm() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setPending(true);
    try {
      const res = await api.submitVolunteer({ ...data, ageConfirmed: form.ageConfirmed.checked });
      setResult(res);
      if (res.ok) form.reset();
    } catch (error) {
      setResult({ ok: false, message: error instanceof Error ? error.message : "Submission failed." });
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
          <HeartHandshake className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900">Volunteer Enlistment</h3>
          <p className="text-xs text-slate-500">Over 340 active safety ambassadors across 18 districts</p>
        </div>
      </div>

      {result?.ok ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-6 text-center"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white mb-3">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h4 className="font-display text-lg font-bold text-emerald-950">Registration Submitted!</h4>
          <p className="mt-1 text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">{result.message}</p>
          <button
            type="button"
            className="btn btn-secondary mt-5 text-xs py-2 px-4"
            onClick={() => setResult(null)}
          >
            Register Another Safety Ambassador
          </button>
        </motion.div>
      ) : (
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1" htmlFor="v-name">
              Full Legal Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="v-name"
              name="fullName"
              placeholder="e.g. Nikhil Raghavan"
              required
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1" htmlFor="v-email">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              id="v-email"
              name="email"
              type="email"
              placeholder="nikhil@example.com"
              required
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1" htmlFor="v-phone">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <input
              id="v-phone"
              name="phone"
              placeholder="+91 98765 43210"
              required
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1" htmlFor="v-occ">
              Occupation / Profession
            </label>
            <input
              id="v-occ"
              name="occupation"
              placeholder="Teacher, paramedic, college student…"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Preferred Volunteer Focus Area</label>
            <select
              name="area"
              defaultValue={VOLUNTEER_AREAS[0]}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            >
              {VOLUNTEER_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Time Availability</label>
            <select
              name="availability"
              defaultValue={AVAILABILITY[0]}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            >
              {AVAILABILITY.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">How Did You Hear About Us?</label>
            <select
              name="referral"
              defaultValue={REFERRALS[0]}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            >
              {REFERRALS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                name="ageConfirmed"
                required
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>
                I confirm that I am at least 18 years old and agree to adhere to Suraksha Setu's volunteer code of conduct.
              </span>
            </label>
          </div>

          {result && !result.ok && (
            <div className="sm:col-span-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
              {result.message}
            </div>
          )}

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              disabled={pending}
              className="btn btn-primary w-full py-3 text-xs font-bold shadow-xs"
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Enrolling Ambassador...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" /> Submit Volunteer Application
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
