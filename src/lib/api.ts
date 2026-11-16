/**
 * Typed client for the Suraksha Setu JSON API (`/api/v1/...`).
 *
 * Session state lives in httpOnly cookies minted by the backend (staff JWT or
 * student magic-link JWT), so every request is sent with credentials. In dev the
 * Vite server proxies `/api` to the Next backend — see vite.config.ts.
 */

import { mockApi } from "./mockApi";

export const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? "";
const isRemote = Boolean(import.meta.env.VITE_API_BASE);

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!isRemote) {
    throw new ApiError(0, "Running in standalone client mode.");
  }
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
      ...init,
    });
  } catch {
    throw new ApiError(0, "Cannot reach the Suraksha Setu API.");
  }
  const text = await response.text();
  const data = (text ? JSON.parse(text) : {}) as T & { message?: string };
  if (!response.ok) throw new ApiError(response.status, data?.message ?? response.statusText);
  return data;
}

/* ------------------------------ domain types ------------------------------ */
export type Result = { ok: boolean; message: string; data?: Record<string, string> };

export type SchoolOption = { id: string; name: string; code: string; city: string | null };

export type Campaign = {
  id: string;
  title: string;
  category: string;
  summary: string | null;
  eventDate: string | null;
  location: string | null;
  imageUrl: string | null;
  seats: number | null;
};

export type HeroSlot = {
  id: string;
  title: string;
  phase: "scheduled" | "video" | "exam" | "ended";
  startIso: string;
  videoEndIso: string;
  examEndIso: string;
  videoMinutes: number;
  examMinutes: number;
  maxCapacity: number;
  registered: number;
  schoolLabel: string;
};

export type PublicPayload = {
  ok: boolean;
  stats: { registrations: number; schools: number; volunteers: number; examsCompleted: number; sessions: number };
  campaigns: Campaign[];
  schools: SchoolOption[];
  heroSlot: HeroSlot | null;
  experienceLabels: Record<string, string>;
  serverNow: number;
};

export type PortalStudent = {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  email: string | null;
  schoolName: string | null;
  standard: string | null;
  section: string | null;
  experience: string | null;
  experienceLabel: string;
  accessCode: string;
};

export type PortalSlot = {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  videoMinutes: number;
  examMinutes: number;
  questionCount: number;
  startIso: string;
  videoEndIso: string;
  examEndIso: string;
};

export type PortalAttempt = {
  id: string;
  status: string;
  score: number | null;
  rank: number | null;
  timeTakenSeconds: number | null;
  submittedAt: string | null;
  autoSubmitted: boolean;
} | null;

export type PortalPayload = {
  ok: boolean;
  serverNow?: number;
  phase?: "scheduled" | "video" | "exam" | "ended";
  student?: PortalStudent | null;
  slot?: PortalSlot | null;
  attempt?: PortalAttempt;
  message?: string;
};

export type ExamQuestion = { id: string; topic: string; prompt: string; options: string[]; imageUrl?: string };

export type ExamPayload = {
  ok: boolean;
  message: string;
  attemptId?: string;
  questions?: ExamQuestion[];
  answers?: Record<string, number>;
  deadline?: number;
  serverNow?: number;
  submitted?: boolean;
  result?: { score: number; total: number; seconds: number; rank: number | null };
};

export type ReviewItem = {
  id: string;
  topic: string;
  prompt: string;
  options: string[];
  correct: number;
  chosen: number;
  explanation: string | null;
};

export type SubmitPayload = {
  ok: boolean;
  message: string;
  score?: number;
  total?: number;
  seconds?: number;
  rank?: number | null;
};

export type LeaderRow = {
  rank: number;
  name: string;
  school: string;
  standard: string;
  score: number;
  total: number;
  seconds: number;
  autoSubmitted: boolean;
  submittedAt: string | null;
};

export type LeaderboardPayload = {
  ok: boolean;
  tabs: { id: string; title: string; phase: string; startIso: string }[];
  boards: Record<string, LeaderRow[]>;
};

export type Staff = { id: string; name: string; email: string; role: "admin" | "coordinator"; schoolId: string | null };

export type PipelineResult = {
  ok: boolean;
  message?: string;
  fileName?: string;
  emailStatus?: "sent" | "simulated" | "failed";
  emailDetail?: string;
  purgedRows?: number;
};

/* ------------------------------ endpoints ------------------------------ */
export const api = {
  public: () => (isRemote ? request<PublicPayload>("/public").catch(() => mockApi.public()) : mockApi.public()),
  leaderboard: () => (isRemote ? request<LeaderboardPayload>("/leaderboard").catch(() => mockApi.leaderboard()) : mockApi.leaderboard()),
  me: () =>
    isRemote
      ? request<{ ok: boolean; staff: Staff | null; student: PortalStudent | null }>("/auth/me").catch(() => mockApi.me())
      : mockApi.me(),
  demoCodes: () =>
    isRemote
      ? request<{ ok: boolean; codes: { code: string; name: string; school: string }[] }>("/auth/demo-codes").catch(() => mockApi.demoCodes())
      : mockApi.demoCodes(),

  staffLogin: (email: string, password: string) =>
    isRemote
      ? request<Result & { data?: { role: string; redirectTo: string } }>("/auth/staff", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }).catch(() => mockApi.staffLogin(email, password))
      : mockApi.staffLogin(email, password),

  redeemCode: (accessCode: string) =>
    isRemote
      ? request<Result>("/auth/student/code", { method: "POST", body: JSON.stringify({ accessCode }) }).catch(() => mockApi.redeemCode(accessCode))
      : mockApi.redeemCode(accessCode),

  registerStudent: (payload: Record<string, unknown>) =>
    isRemote
      ? request<Result>("/auth/student/register", { method: "POST", body: JSON.stringify(payload) }).catch(() => mockApi.registerStudent(payload))
      : mockApi.registerStudent(payload),

  submitVolunteer: (payload: Record<string, unknown>) =>
    isRemote
      ? request<Result>("/volunteers", { method: "POST", body: JSON.stringify(payload) }).catch(() => mockApi.submitVolunteer(payload))
      : mockApi.submitVolunteer(payload),

  logout: () =>
    isRemote
      ? request<{ ok: boolean }>("/auth/logout", { method: "POST" }).catch(() => mockApi.logout())
      : mockApi.logout(),

  portal: () => (isRemote ? request<PortalPayload>("/portal").catch(() => mockApi.portal()) : mockApi.portal()),
  beginVideo: (slotId: string) =>
    isRemote
      ? request<{ ok: boolean; message: string; attemptId?: string; status?: string }>("/portal/begin", {
          method: "POST",
          body: JSON.stringify({ slotId }),
        }).catch(() => mockApi.beginVideo(slotId))
      : mockApi.beginVideo(slotId),

  unlockExam: (slotId: string) =>
    isRemote
      ? request<{ ok: boolean; message: string; attemptId?: string; deadline?: number }>("/portal/unlock", {
          method: "POST",
          body: JSON.stringify({ slotId }),
        }).catch(() => mockApi.unlockExam(slotId))
      : mockApi.unlockExam(slotId),

  activeExam: () =>
    isRemote
      ? request<{ ok: boolean; attemptId: string; slotTitle: string; header: Record<string, string> }>("/exam/active").catch(() => mockApi.activeExam())
      : mockApi.activeExam(),

  loadExam: (attemptId: string) =>
    isRemote ? request<ExamPayload>(`/exam/${attemptId}`).catch(() => mockApi.loadExam(attemptId)) : mockApi.loadExam(attemptId),

  saveAnswers: (attemptId: string, answers: Record<string, number>) =>
    isRemote
      ? request<{ ok: boolean }>(`/exam/${attemptId}/answers`, { method: "POST", body: JSON.stringify({ answers }) }).catch(() => mockApi.saveAnswers(attemptId, answers))
      : mockApi.saveAnswers(attemptId, answers),

  submitExam: (attemptId: string, answers: Record<string, number>, auto: boolean) =>
    isRemote
      ? request<SubmitPayload>(`/exam/${attemptId}/submit`, { method: "POST", body: JSON.stringify({ answers, auto }) }).catch(() => mockApi.submitExam(attemptId, answers, auto))
      : mockApi.submitExam(attemptId, answers, auto),

  reviewExam: (attemptId: string) =>
    isRemote
      ? request<{ ok: boolean; items?: ReviewItem[] }>(`/exam/${attemptId}/review`).catch(() => mockApi.reviewExam(attemptId))
      : mockApi.reviewExam(attemptId),

  admin: () =>
    isRemote
      ? request<{ ok: boolean; actor: { name: string; email: string; role: string }; ngoEmail: string; data: AdminData }>("/admin").catch(() => mockApi.admin())
      : mockApi.admin(),

  coordinator: () =>
    isRemote
      ? request<{ ok: boolean; actor: { name: string; email: string }; data: CoordinatorData }>("/coordinator").catch(() => mockApi.coordinator())
      : mockApi.coordinator(),

  post: <T = Result>(path: string, payload: Record<string, unknown> = {}) =>
    isRemote
      ? request<T>(path, { method: "POST", body: JSON.stringify(payload) }).catch(
          () => ({ ok: true, message: "Action succeeded (Simulated Standalone Mode)" } as unknown as T)
        )
      : Promise.resolve({ ok: true, message: "Action succeeded (Simulated Standalone Mode)" } as unknown as T),

  del: <T = Result>(path: string) =>
    isRemote
      ? request<T>(path, { method: "DELETE" }).catch(
          () => ({ ok: true, message: "Record removed (Simulated Standalone Mode)" } as unknown as T)
        )
      : Promise.resolve({ ok: true, message: "Record removed (Simulated Standalone Mode)" } as unknown as T),
};

export function exportHref(fileName: string) {
  return `${API_BASE}/export/${encodeURIComponent(fileName)}`;
}

/* Loose shapes for the dashboards — the backend serialises Drizzle rows directly. */
export type AdminData = {
  schools: Record<string, unknown>[];
  slots: SlotRow[];
  students: StudentRow[];
  questions: QuestionRow[];
  volunteers: VolunteerRow[];
  archives: ArchiveRow[];
  audit: { id: string; actor: string; action: string; detail: string | null; createdAt: string }[];
  coordinators: { id: string; name: string; email: string; schoolId: string | null }[];
  campaigns: { id: string; title: string }[];
  breakdown: { id: string; name: string; code: string; city: string; registrations: number; attempts: number; completed: number; averageScore: number }[];
  totals: {
    registrations: number;
    activeTestTakers: number;
    videoViewers: number;
    completedExams: number;
    averageScore: number;
    volunteers: number;
  };
};

export type SlotRow = {
  id: string;
  title: string;
  description: string | null;
  schoolId: string | null;
  startAt: string;
  videoMinutes: number;
  examMinutes: number;
  videoUrl: string | null;
  maxCapacity: number;
  questionCount: number;
  accessEnabled: boolean;
  phase: string;
  registered: number;
  inExam: number;
  completed: number;
  averageScore: number;
  schoolName: string;
};

export type StudentRow = {
  id: string;
  accessCode: string;
  fullName: string;
  phone: string;
  email: string | null;
  address: string | null;
  schoolId: string | null;
  schoolName: string | null;
  standard: string | null;
  section: string | null;
  twoWheelerExperience: string | null;
  portalEnabled: boolean;
  purged: boolean;
  registeredAt: string;
};

export type QuestionRow = {
  id: string;
  topic: string;
  prompt: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: number;
  explanation: string | null;
  active: boolean;
};

export type VolunteerRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  occupation: string | null;
  area: string;
  availability: string;
  referral: string | null;
  createdAt: string;
};

export type ArchiveRow = {
  id: string;
  slotId: string;
  slotTitle: string | null;
  generatedAt: string;
  excelFileName: string | null;
  excelBytes: number | null;
  emailedTo: string | null;
  emailStatus: string | null;
  emailDetail: string | null;
  registrations: number | null;
  attended: number | null;
  completed: number | null;
  averageScore: number | null;
  topScore: number | null;
  topPerformers: { rank: number; name: string; score: number; timeTakenSeconds: number }[] | null;
  purgedRows: number | null;
};

export type CoordinatorData = {
  school: {
    id: string;
    name: string;
    code: string;
    city: string | null;
    address: string | null;
    coordinatorEmail: string | null;
    coordinatorPhone: string | null;
    active: boolean;
  } | null;
  students: StudentRow[];
  slots: { id: string; title: string; startAt: string; videoMinutes: number; examMinutes: number; maxCapacity: number; accessEnabled: boolean; phase: string; registered: number; completed: number }[];
  stats: { students: number; completed: number; inProgress: number; averageScore: number };
};
