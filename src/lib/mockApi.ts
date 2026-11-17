import {
  MOCK_QUESTIONS,
  MOCK_SCHOOLS,
  MOCK_CAMPAIGNS,
  MOCK_DEMO_CODES,
  MOCK_STUDENTS,
  type MockQuestion,
} from "./mockData";
import type {
  PublicPayload,
  LeaderboardPayload,
  PortalPayload,
  ExamPayload,
  ReviewItem,
  SubmitPayload,
  Staff,
  PortalStudent,
  AdminData,
  CoordinatorData,
  Result,
} from "./api";

const STORAGE_KEY_STUDENT = "suraksha_session_student";
const STORAGE_KEY_STAFF = "suraksha_session_staff";
const STORAGE_KEY_ANSWERS = "suraksha_exam_answers";
const STORAGE_KEY_ATTEMPT = "suraksha_exam_attempt";
const STORAGE_KEY_VOLUNTEERS = "suraksha_volunteers";

function getStorage<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? (JSON.parse(val) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

/* ------------------- Session Helpers ------------------- */
export function getMockStudent(): PortalStudent | null {
  const saved = getStorage<PortalStudent | null>(STORAGE_KEY_STUDENT, null);
  if (saved) return saved;
  try {
    const code = localStorage.getItem("suraksha_active_student_code");
    const parsedCode = code ? JSON.parse(code) : "RS-DEMO01";
    if (parsedCode && MOCK_STUDENTS[parsedCode]) {
      return { ...MOCK_STUDENTS[parsedCode] };
    }
  } catch {
    // ignore
  }
  return {
    ...MOCK_STUDENTS["RS-DEMO01"],
  };
}

export function setMockStudent(student: PortalStudent | null): void {
  setStorage(STORAGE_KEY_STUDENT, student);
  try {
    localStorage.setItem("suraksha_active_student_code", JSON.stringify(student?.accessCode ?? null));
  } catch {
    // ignore
  }
}

export function getMockStaff(): Staff | null {
  const saved = getStorage<Staff | null>(STORAGE_KEY_STAFF, null);
  if (saved) return saved;
  try {
    const role = localStorage.getItem("suraksha_active_staff_role");
    const parsedRole = role ? JSON.parse(role) : null;
    const email = localStorage.getItem("suraksha_active_staff_email");
    const parsedEmail = email ? JSON.parse(email) : null;
    if (parsedRole) {
      return {
        id: parsedRole === "admin" ? "u-admin" : "u-coord",
        name: parsedRole === "admin" ? "Super Admin" : "School Coordinator",
        email: parsedEmail || (parsedRole === "admin" ? "admin@surakshasetu.org" : "meera@greenvalley.edu.in"),
        role: parsedRole,
        schoolId: parsedRole === "coordinator" ? "sch-1" : null,
      };
    }
  } catch {
    // ignore
  }
  return null;
}

export function setMockStaff(staff: Staff | null): void {
  setStorage(STORAGE_KEY_STAFF, staff);
  try {
    localStorage.setItem("suraksha_active_staff_role", JSON.stringify(staff?.role ?? null));
    localStorage.setItem("suraksha_active_staff_email", JSON.stringify(staff?.email ?? null));
  } catch {
    // ignore
  }
}

/* ------------------- Slot State ------------------- */
const nowMs = Date.now();
const mockSlot = {
  id: "slot-demo-01",
  title: "Batch 02 · Live Video + Timed Exam Session",
  description: "School road safety certification batch. Watch the 3-minute video module, then complete the 30-question assessment.",
  videoUrl: "https://www.youtube.com/watch?v=n4jMF1RLyqg",
  videoMinutes: 3,
  examMinutes: 20,
  questionCount: 30,
  maxCapacity: 120,
  registered: 86,
  schoolLabel: "All Partner Schools",
  startIso: new Date(nowMs - 60_000).toISOString(),
  videoEndIso: new Date(nowMs + 2 * 60_000).toISOString(),
  examEndIso: new Date(nowMs + 22 * 60_000).toISOString(),
};

/* ------------------- Mock Handlers ------------------- */
export const mockApi = {
  public: async (): Promise<PublicPayload> => {
    return {
      ok: true,
      stats: {
        registrations: 1420,
        schools: 18,
        volunteers: 184,
        examsCompleted: 1190,
        sessions: 34,
      },
      campaigns: MOCK_CAMPAIGNS,
      schools: MOCK_SCHOOLS,
      heroSlot: {
        id: mockSlot.id,
        title: mockSlot.title,
        phase: "video",
        startIso: mockSlot.startIso,
        videoEndIso: mockSlot.videoEndIso,
        examEndIso: mockSlot.examEndIso,
        videoMinutes: mockSlot.videoMinutes,
        examMinutes: mockSlot.examMinutes,
        maxCapacity: mockSlot.maxCapacity,
        registered: mockSlot.registered,
        schoolLabel: mockSlot.schoolLabel,
      },
      experienceLabels: {
        none: "Never ridden a two-wheeler",
        lt1: "Under 1 year",
        "1to3": "1–3 years regular riding",
        gt3: "3+ years daily riding",
        learning: "Currently learning / learner licence",
      },
      serverNow: Date.now(),
    };
  },

  leaderboard: async (): Promise<LeaderboardPayload> => {
    return {
      ok: true,
      tabs: [
        { id: "slot-demo-01", title: "Batch 02 · Live Session", phase: "video", startIso: mockSlot.startIso },
        { id: "slot-batch-01", title: "Batch 01 · Monsoon Certification", phase: "ended", startIso: new Date(nowMs - 86400000 * 3).toISOString() },
      ],
      boards: {
        "slot-demo-01": [
          { rank: 1, name: "Aarav Sharma", school: "Green Valley Public School", standard: "10-A", score: 29, total: 30, seconds: 612, autoSubmitted: false, submittedAt: new Date(nowMs - 3600000).toISOString() },
          { rank: 2, name: "Kabir Nair", school: "Green Valley Public School", standard: "11-B", score: 28, total: 30, seconds: 690, autoSubmitted: false, submittedAt: new Date(nowMs - 3500000).toISOString() },
          { rank: 3, name: "Diya Verma", school: "Green Valley Public School", standard: "10-A", score: 27, total: 30, seconds: 730, autoSubmitted: false, submittedAt: new Date(nowMs - 3400000).toISOString() },
          { rank: 4, name: "Arjun Patil", school: "St. Mary's High School", standard: "11-A", score: 26, total: 30, seconds: 780, autoSubmitted: false, submittedAt: new Date(nowMs - 3300000).toISOString() },
          { rank: 5, name: "Reyansh Khanna", school: "Kendriya Vidyalaya Sector 14", standard: "12-C", score: 25, total: 30, seconds: 845, autoSubmitted: false, submittedAt: new Date(nowMs - 3200000).toISOString() },
          { rank: 6, name: "Vihaan Gupta", school: "Green Valley Public School", standard: "12-A", score: 24, total: 30, seconds: 860, autoSubmitted: false, submittedAt: new Date(nowMs - 3100000).toISOString() },
          { rank: 7, name: "Aditya Singh", school: "Kendriya Vidyalaya Sector 14", standard: "11-B", score: 23, total: 30, seconds: 902, autoSubmitted: false, submittedAt: new Date(nowMs - 3000000).toISOString() },
          { rank: 8, name: "Ishita Rao", school: "Green Valley Public School", standard: "9-C", score: 22, total: 30, seconds: 995, autoSubmitted: true, submittedAt: new Date(nowMs - 2900000).toISOString() },
          { rank: 9, name: "Myra Deshpande", school: "St. Mary's High School", standard: "10-A", score: 21, total: 30, seconds: 1080, autoSubmitted: false, submittedAt: new Date(nowMs - 2800000).toISOString() },
          { rank: 10, name: "Aisha Qureshi", school: "Kendriya Vidyalaya Sector 14", standard: "10-B", score: 19, total: 30, seconds: 1140, autoSubmitted: true, submittedAt: new Date(nowMs - 2700000).toISOString() },
        ],
        "slot-batch-01": [
          { rank: 1, name: "Rudra Joshi", school: "St. Mary's High School", standard: "12-C", score: 30, total: 30, seconds: 580, autoSubmitted: false, submittedAt: new Date(nowMs - 86400000 * 3).toISOString() },
          { rank: 2, name: "Saanvi Kulkarni", school: "St. Mary's High School", standard: "9-B", score: 29, total: 30, seconds: 640, autoSubmitted: false, submittedAt: new Date(nowMs - 86400000 * 3).toISOString() },
          { rank: 3, name: "Navya Bansal", school: "Kendriya Vidyalaya Sector 14", standard: "9-A", score: 27, total: 30, seconds: 710, autoSubmitted: false, submittedAt: new Date(nowMs - 86400000 * 3).toISOString() },
        ],
      },
    };
  },

  me: async (): Promise<{ ok: boolean; staff: Staff | null; student: PortalStudent | null }> => {
    return {
      ok: true,
      staff: getMockStaff(),
      student: getMockStudent(),
    };
  },

  demoCodes: async () => {
    return { ok: true, codes: MOCK_DEMO_CODES };
  },

  staffLogin: async (email: string, pass: string): Promise<Result & { data?: { role: string; redirectTo: string } }> => {
    const e = email.trim().toLowerCase();
    if (e === "admin@surakshasetu.org" && (pass === "admin123" || pass === "admin")) {
      const staff: Staff = { id: "u-admin", name: "Aarav Mehta", email: e, role: "admin", schoolId: null };
      setMockStaff(staff);
      return { ok: true, message: "Welcome Super Admin", data: { role: "admin", redirectTo: "/admin" } };
    }
    if (e === "meera@greenvalley.edu.in" && (pass === "teacher123" || pass === "teacher")) {
      const staff: Staff = { id: "u-coord", name: "Meera Nair", email: e, role: "coordinator", schoolId: "sch-1" };
      setMockStaff(staff);
      return { ok: true, message: "Welcome Coordinator", data: { role: "coordinator", redirectTo: "/coordinator" } };
    }
    // Allow any demo staff
    if (e.includes("admin")) {
      const staff: Staff = { id: "u-admin", name: "Admin", email: e, role: "admin", schoolId: null };
      setMockStaff(staff);
      return { ok: true, message: "Signed in as Admin", data: { role: "admin", redirectTo: "/admin" } };
    }
    if (e.includes("coordinator") || e.includes("school") || e.includes("teacher")) {
      const staff: Staff = { id: "u-coord", name: "School Coordinator", email: e, role: "coordinator", schoolId: "sch-1" };
      setMockStaff(staff);
      return { ok: true, message: "Signed in as Coordinator", data: { role: "coordinator", redirectTo: "/coordinator" } };
    }
    return { ok: false, message: "Invalid credentials. Use admin@surakshasetu.org / admin123 or meera@greenvalley.edu.in / teacher123" };
  },

  redeemCode: async (code: string): Promise<Result> => {
    const c = code.trim().toUpperCase();
    const existing = MOCK_STUDENTS[c];
    if (existing) {
      setMockStudent(existing);
      return { ok: true, message: `Welcome ${existing.name}` };
    }
    // Create student on the fly for any entered code
    const generated: PortalStudent = {
      id: `std-${Date.now()}`,
      name: "Road Safety Participant",
      phone: "+91 98100 44000",
      address: "New Delhi",
      email: "student@surakshasetu.org",
      schoolName: "Green Valley Public School",
      standard: "10",
      section: "A",
      experience: "1to3",
      experienceLabel: "1–3 years regular riding",
      accessCode: c || "RS-DEMO01",
    };
    setMockStudent(generated);
    return { ok: true, message: "Access code verified" };
  },

  registerStudent: async (payload: Record<string, unknown>): Promise<Result> => {
    const code = `RS-${Math.floor(10000 + Math.random() * 90000)}`;
    const school = MOCK_SCHOOLS.find((s) => s.id === payload.schoolId) ?? MOCK_SCHOOLS[0];
    const student: PortalStudent = {
      id: `std-${Date.now()}`,
      name: String(payload.fullName || "Student"),
      phone: String(payload.phone || "+91 98100 00000"),
      address: String(payload.address || "City"),
      email: payload.email ? String(payload.email) : null,
      schoolName: school.name,
      standard: String(payload.standard || "10"),
      section: String(payload.section || "A"),
      experience: String(payload.twoWheelerExperience || "1to3"),
      experienceLabel: "1–3 years regular riding",
      accessCode: code,
    };
    setMockStudent(student);
    return {
      ok: true,
      message: "Student registered successfully!",
      data: {
        accessCode: code,
        schoolName: school.name,
        channel: student.email ?? student.phone,
        magicLink: `http://localhost:5173/portal?code=${code}`,
      },
    };
  },

  submitVolunteer: async (payload: Record<string, unknown>): Promise<Result> => {
    const list = getStorage<Record<string, unknown>[]>(STORAGE_KEY_VOLUNTEERS, []);
    list.push({ ...payload, createdAt: new Date().toISOString() });
    setStorage(STORAGE_KEY_VOLUNTEERS, list);
    return { ok: true, message: "Thank you for joining Suraksha Setu as a volunteer!" };
  },

  logout: async () => {
    setMockStudent(null);
    setMockStaff(null);
    try {
      localStorage.removeItem(STORAGE_KEY_STUDENT);
      localStorage.removeItem(STORAGE_KEY_STAFF);
    } catch {
      // ignore
    }
    return { ok: true };
  },

  portal: async (): Promise<PortalPayload> => {
    const student = getMockStudent();
    const attempt = getStorage<{
      id: string;
      status: string;
      score: number | null;
      rank: number | null;
      timeTakenSeconds: number | null;
      submittedAt: string | null;
      autoSubmitted: boolean;
    } | null>(STORAGE_KEY_ATTEMPT, null);

    return {
      ok: true,
      serverNow: Date.now(),
      phase: "video",
      student: student ?? MOCK_STUDENTS["RS-DEMO01"],
      slot: mockSlot,
      attempt: attempt,
    };
  },

  beginVideo: async (_slotId: string) => {
    return { ok: true, message: "Session attendance recorded. Video window open.", status: "video" };
  },

  unlockExam: async (_slotId: string) => {
    return { ok: true, message: "Exam unlocked! Good luck.", attemptId: "att-active", deadline: Date.now() + 20 * 60_000 };
  },

  activeExam: async () => {
    const student = getMockStudent() ?? MOCK_STUDENTS["RS-DEMO01"];
    return {
      ok: true,
      attemptId: "att-active",
      slotTitle: mockSlot.title,
      header: {
        name: student.name,
        phone: student.phone,
        address: student.address ?? "City",
        experience: student.experienceLabel,
        school: student.schoolName ?? "Partner School",
        accessCode: student.accessCode,
      },
    };
  },

  loadExam: async (_attemptId: string): Promise<ExamPayload> => {
    const attempt = getStorage<{
      status: string;
      score: number;
      total: number;
      seconds: number;
      rank: number;
    } | null>(STORAGE_KEY_ATTEMPT, null);

    if (attempt && attempt.status === "submitted") {
      return {
        ok: true,
        message: "Paper submitted",
        submitted: true,
        result: {
          score: attempt.score,
          total: attempt.total,
          seconds: attempt.seconds,
          rank: attempt.rank,
        },
      };
    }

    const savedAnswers = getStorage<Record<string, number>>(STORAGE_KEY_ANSWERS, {});
    const questions = MOCK_QUESTIONS.map((q) => ({
      id: q.id,
      topic: q.topic,
      prompt: q.prompt,
      options: q.options,
      imageUrl: q.imageUrl,
    }));

    return {
      ok: true,
      message: "Exam paper loaded",
      attemptId: "att-active",
      questions,
      answers: savedAnswers,
      deadline: Date.now() + 20 * 60_000,
      serverNow: Date.now(),
      submitted: false,
    };
  },

  saveAnswers: async (_attemptId: string, answers: Record<string, number>) => {
    setStorage(STORAGE_KEY_ANSWERS, answers);
    return { ok: true };
  },

  submitExam: async (_attemptId: string, answers: Record<string, number>, auto: boolean): Promise<SubmitPayload> => {
    setStorage(STORAGE_KEY_ANSWERS, answers);
    let correctCount = 0;
    MOCK_QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correctCount += 1;
      }
    });

    const total = MOCK_QUESTIONS.length;
    const seconds = Math.min(1200, Math.floor(450 + Math.random() * 300));
    const rank = correctCount >= 28 ? 1 : correctCount >= 25 ? 3 : correctCount >= 20 ? 8 : 14;

    const attemptData = {
      id: "att-active",
      status: "submitted",
      score: correctCount,
      total,
      seconds,
      rank,
      submittedAt: new Date().toISOString(),
      autoSubmitted: auto,
    };
    setStorage(STORAGE_KEY_ATTEMPT, attemptData);

    return {
      ok: true,
      message: "Exam submitted successfully! Results verified.",
      score: correctCount,
      total,
      seconds,
      rank,
    };
  },

  reviewExam: async (_attemptId: string): Promise<{ ok: boolean; items: ReviewItem[] }> => {
    const savedAnswers = getStorage<Record<string, number>>(STORAGE_KEY_ANSWERS, {});
    const items: ReviewItem[] = MOCK_QUESTIONS.map((q) => ({
      id: q.id,
      topic: q.topic,
      prompt: q.prompt,
      options: q.options,
      correct: q.correct,
      chosen: savedAnswers[q.id] ?? -1,
      explanation: q.explanation,
    }));
    return { ok: true, items };
  },

  admin: async (): Promise<{ ok: boolean; actor: { name: string; email: string; role: string }; ngoEmail: string; data: AdminData }> => {
    return {
      ok: true,
      actor: { name: "Aarav Mehta", email: "admin@surakshasetu.org", role: "admin" },
      ngoEmail: "operations@surakshasetu.org",
      data: {
        schools: MOCK_SCHOOLS.map((s) => ({ ...s, active: true, address: "Urban Campus", coordinatorName: "Faculty Coordinator" })),
        slots: [
          {
            id: mockSlot.id,
            title: mockSlot.title,
            description: mockSlot.description,
            schoolId: null,
            startAt: mockSlot.startIso,
            videoMinutes: mockSlot.videoMinutes,
            examMinutes: mockSlot.examMinutes,
            videoUrl: mockSlot.videoUrl,
            maxCapacity: mockSlot.maxCapacity,
            questionCount: mockSlot.questionCount,
            accessEnabled: true,
            phase: "video",
            registered: mockSlot.registered,
            inExam: 42,
            completed: 28,
            averageScore: 24.6,
            schoolName: "Open Partner Schools",
          },
        ],
        students: Object.values(MOCK_STUDENTS).map((s) => ({
          id: s.id,
          accessCode: s.accessCode,
          fullName: s.name,
          phone: s.phone,
          email: s.email,
          address: s.address,
          schoolId: "sch-1",
          schoolName: s.schoolName,
          standard: s.standard,
          section: s.section,
          twoWheelerExperience: s.experience,
          portalEnabled: true,
          purged: false,
          registeredAt: new Date().toISOString(),
        })),
        questions: MOCK_QUESTIONS.map((q) => ({
          id: q.id,
          topic: q.topic,
          prompt: q.prompt,
          optionA: q.options[0],
          optionB: q.options[1],
          optionC: q.options[2],
          optionD: q.options[3],
          correctOption: q.correct,
          explanation: q.explanation,
          active: true,
        })),
        volunteers: [
          {
            id: "vol-1",
            fullName: "Nikhil Raghavan",
            email: "nikhil.r@gmail.com",
            phone: "+91 99400 12233",
            occupation: "Traffic Sub-Inspector (Retd.)",
            area: "School Education",
            availability: "Weekdays",
            referral: "NGO Event",
            createdAt: new Date().toISOString(),
          },
          {
            id: "vol-2",
            fullName: "Fatima Sheikh",
            email: "fatima.sheikh@outlook.com",
            phone: "+91 99400 45566",
            occupation: "Physiotherapist",
            area: "Pedestrian Safety",
            availability: "Weekends",
            referral: "Social Media",
            createdAt: new Date().toISOString(),
          },
        ],
        archives: [],
        audit: [
          { id: "a-1", actor: "system", action: "batch.opened", detail: "Batch 02 live session opened for partner schools", createdAt: new Date().toISOString() },
          { id: "a-2", actor: "admin@surakshasetu.org", action: "portal.access", detail: "Super Admin dashboard loaded", createdAt: new Date().toISOString() },
        ],
        coordinators: [
          { id: "u-coord", name: "Meera Nair", email: "meera@greenvalley.edu.in", schoolId: "sch-1" },
        ],
        campaigns: MOCK_CAMPAIGNS.map((c) => ({ id: c.id, title: c.title })),
        breakdown: [
          { id: "sch-1", name: "Green Valley Public School", code: "GVPS-DEL-01", city: "New Delhi", registrations: 48, attempts: 42, completed: 38, averageScore: 25.2 },
          { id: "sch-2", name: "St. Mary's High School", code: "SMHS-PUN-07", city: "Pune", registrations: 26, attempts: 24, completed: 22, averageScore: 24.1 },
        ],
        totals: {
          registrations: 1420,
          activeTestTakers: 42,
          videoViewers: 86,
          completedExams: 1190,
          averageScore: 24.8,
          volunteers: 184,
        },
      },
    };
  },

  coordinator: async (): Promise<{ ok: boolean; actor: { name: string; email: string }; data: CoordinatorData }> => {
    return {
      ok: true,
      actor: { name: "Meera Nair", email: "meera@greenvalley.edu.in" },
      data: {
        school: {
          id: "sch-1",
          name: "Green Valley Public School",
          code: "GVPS-DEL-01",
          city: "New Delhi",
          address: "Block C, Vasant Kunj, New Delhi 110070",
          coordinatorEmail: "meera@greenvalley.edu.in",
          coordinatorPhone: "+91 98110 22145",
          active: true,
        },
        students: Object.values(MOCK_STUDENTS).map((s) => ({
          id: s.id,
          accessCode: s.accessCode,
          fullName: s.name,
          phone: s.phone,
          email: s.email,
          address: s.address,
          schoolId: "sch-1",
          schoolName: s.schoolName,
          standard: s.standard,
          section: s.section,
          twoWheelerExperience: s.experience,
          portalEnabled: true,
          purged: false,
          registeredAt: new Date().toISOString(),
        })),
        slots: [
          {
            id: mockSlot.id,
            title: mockSlot.title,
            startAt: mockSlot.startIso,
            videoMinutes: mockSlot.videoMinutes,
            examMinutes: mockSlot.examMinutes,
            maxCapacity: mockSlot.maxCapacity,
            accessEnabled: true,
            phase: "video",
            registered: 48,
            completed: 38,
          },
        ],
        stats: {
          students: 48,
          completed: 38,
          inProgress: 6,
          averageScore: 25.2,
        },
      },
    };
  },
};
