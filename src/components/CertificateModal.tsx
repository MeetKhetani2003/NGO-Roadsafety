import { motion, AnimatePresence } from "framer-motion";
import { Award, Download, Printer, QrCode, ShieldCheck, X } from "lucide-react";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  schoolName: string;
  accessCode: string;
  score: number;
  total: number;
  dateStr: string;
}

export function CertificateModal({
  isOpen,
  onClose,
  studentName,
  schoolName,
  accessCode,
  score,
  total,
  dateStr,
}: CertificateModalProps) {
  if (!isOpen) return null;

  const pct = Math.round((score / total) * 100);
  const isDistinction = pct >= 80;
  const isMerit = pct >= 60;

  const badgeText = isDistinction ? "Distinction in Defensive Driving" : isMerit ? "Merit in Road Safety" : "Participant in Road Safety";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white p-6 sm:p-10 text-slate-900 shadow-2xl border border-slate-200"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Certificate Print Wrapper */}
          <div id="printable-certificate" className="printable-area relative rounded-xl border-4 border-double border-amber-600/40 p-8 sm:p-12 text-center bg-gradient-to-b from-amber-50/20 via-white to-amber-50/10">
            {/* Header */}
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md mb-2">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
                Suraksha Setu National Road Safety Council
              </p>
              <h2 className="mt-1 font-display text-2xl sm:text-4xl font-extrabold text-slate-900">
                Certificate of Road Safety Competence
              </h2>
              <div className="mt-2 h-1 w-32 bg-amber-500 rounded-full" />
            </div>

            {/* Body */}
            <p className="mt-6 text-xs text-slate-500 uppercase tracking-wider font-semibold">
              This is officially awarded to
            </p>
            <h3 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-blue-900">
              {studentName}
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Student of <strong>{schoolName}</strong> · Access ID: <span className="font-mono font-bold text-slate-800">{accessCode}</span>
            </p>

            <p className="mx-auto mt-4 max-w-lg text-xs text-slate-600 leading-relaxed">
              for successfully completing the synchronized road-safety learning module and achieving an official score of{" "}
              <strong className="text-blue-900 font-bold">{score}/{total} ({pct}%)</strong> on the curriculum-mapped 30-MCQ certification assessment in accordance with the Motor Vehicles Amendment Act.
            </p>

            {/* Seal & Badge */}
            <div className="mt-8 flex items-center justify-center gap-6">
              <div className="flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2">
                <img
                  src={
                    isDistinction
                      ? "/images/badges/gold-badge.svg"
                      : isMerit
                      ? "/images/badges/silver-badge.svg"
                      : "/images/badges/bronze-badge.svg"
                  }
                  alt="Seal"
                  className="h-10 w-10 object-contain"
                />
                <div className="text-left">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-800">
                    Official Award
                  </span>
                  <span className="font-display text-xs font-bold text-slate-900">{badgeText}</span>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 border border-slate-200 bg-white px-3 py-2 rounded-xl text-left">
                <QrCode className="h-8 w-8 text-slate-700" />
                <div className="text-[9px] font-mono text-slate-500">
                  <span>VERIFIED RECORD</span><br />
                  <span>REF: {accessCode}-{pct}</span>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="mt-10 grid grid-cols-2 gap-8 border-t border-slate-200 pt-6 text-center text-xs">
              <div>
                <span className="font-display font-bold text-slate-800 block text-sm">Meera Nair</span>
                <span className="text-[10px] text-slate-500 block">Faculty Coordinator, Green Valley</span>
              </div>
              <div>
                <span className="font-display font-bold text-slate-800 block text-sm">IPS Rajeshwar Rao</span>
                <span className="text-[10px] text-slate-500 block">Director of Training, Suraksha Setu</span>
              </div>
            </div>

            <div className="mt-4 text-[10px] text-slate-400 font-mono">
              Issued on: {dateStr} · Digitally certified via Suraksha Setu National Registry
            </div>
          </div>

          {/* Modal Actions */}
          <div className="mt-6 flex justify-end gap-3 no-print">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary text-xs"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="btn btn-primary text-xs flex items-center gap-2"
            >
              <Printer className="h-4 w-4" /> Print Official Certificate
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
