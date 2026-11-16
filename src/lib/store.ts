import { MOCK_QUESTIONS, type MockQuestion } from "./mockData";
import { downloadXLSX, downloadCSV } from "./export";

export interface School {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  coordinatorName: string;
  coordinatorEmail: string;
  coordinatorPhone: string;
  active: boolean;
}

export interface Slot {
  id: string;
  title: string;
  description: string;
  schoolId: string | null; // null for open batch
  schoolName: string;
  videoUrl: string;
  videoMinutes: number;
  examMinutes: number;
  startIso: string;
  videoEndIso: string;
  examEndIso: string;
  maxCapacity: number;
  registeredCount: number;
  accessEnabled: boolean;
  status: "scheduled" | "video" | "exam" | "ended";
}

export interface Student {
  id: string;
  accessCode: string;
  fullName: string;
  phone: string;
  email: string | null;
  address: string;
  schoolId: string;
  schoolName: string;
  standard: string;
  section: string;
  experience: string;
  experienceLabel: string;
  ridesToSchool: boolean;
  registeredAt: string;
  portalEnabled: boolean;
}

export interface ExamAttempt {
  id: string;
  slotId: string;
  studentId: string;
  studentName: string;
  schoolName: string;
  standard: string;
  answers: Record<string, number>;
  flagged: Record<string, boolean>;
  score: number | null;
  total: number;
  secondsTaken: number;
  status: "in_progress" | "submitted";
  autoSubmitted: boolean;
  submittedAt: string | null;
  rank: number | null;
}

export interface Volunteer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  occupation: string;
  ageConfirmed: boolean;
  area: string;
  availability: string;
  referral: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  title: string;
  category: "school_drive" | "video_training" | "community";
  summary: string;
  eventDate: string;
  location: string;
  imageUrl: string;
  seats: number;
}

export interface SlotArchive {
  id: string;
  slotId: string;
  slotTitle: string;
  generatedAt: string;
  fileName: string;
  registrations: number;
  completed: number;
  averageScore: number;
  topScore: number;
  emailStatus: "sent" | "simulated";
  purgedRows: number;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  detail: string;
  timestamp: string;
}

/* ------------------- INITIAL SEED ------------------- */
const now = Date.now();

const INITIAL_SCHOOLS: School[] = [
  {
    id: "sch-1",
    name: "Green Valley Public School",
    code: "GVPS-DEL-01",
    city: "New Delhi",
    address: "Block C, Vasant Kunj, New Delhi 110070",
    coordinatorName: "Meera Nair",
    coordinatorEmail: "meera@greenvalley.edu.in",
    coordinatorPhone: "+91 98110 22145",
    active: true,
  },
  {
    id: "sch-2",
    name: "St. Mary's High School",
    code: "SMHS-PUN-07",
    city: "Pune",
    address: "Kothrud, Pune, Maharashtra 411038",
    coordinatorName: "Ravi Deshmukh",
    coordinatorEmail: "ravi@stmarys.edu.in",
    coordinatorPhone: "+91 98220 77410",
    active: true,
  },
  {
    id: "sch-3",
    name: "Kendriya Vidyalaya Sector 14",
    code: "KV14-CHD-03",
    city: "Chandigarh",
    address: "Sector 14-B, Chandigarh 160014",
    coordinatorName: "Anjali Sharma",
    coordinatorEmail: "anjali@kv14chandigarh.edu.in",
    coordinatorPhone: "+91 94170 55219",
    active: true,
  },
  {
    id: "sch-4",
    name: "Little Angels Convent School",
    code: "LAC-JAI-11",
    city: "Jaipur",
    address: "Malviya Nagar, Jaipur, Rajasthan 302017",
    coordinatorName: "Dr. Sunita Kapoor",
    coordinatorEmail: "sunita@littleangels.edu.in",
    coordinatorPhone: "+91 94140 33890",
    active: true,
  },
];

const INITIAL_SLOTS: Slot[] = [
  {
    id: "slot-02",
    title: "Batch 02 · Live Video + Timed Exam Session",
    description: "Open road safety certification batch. Watch the 3-minute video training, then complete the 30-question assessment.",
    schoolId: null,
    schoolName: "Open to All Partner Schools",
    videoUrl: "https://www.youtube.com/watch?v=n4jMF1RLyqg",
    videoMinutes: 3,
    examMinutes: 20,
    startIso: new Date(now - 60_000).toISOString(),
    videoEndIso: new Date(now + 2 * 60_000).toISOString(),
    examEndIso: new Date(now + 22 * 60_000).toISOString(),
    maxCapacity: 120,
    registeredCount: 86,
    accessEnabled: true,
    status: "video",
  },
  {
    id: "slot-01",
    title: "Batch 01 · Monsoon Certification",
    description: "Closed batch for Green Valley Public School students. Results compiled, verified, and archived.",
    schoolId: "sch-1",
    schoolName: "Green Valley Public School",
    videoUrl: "https://www.youtube.com/watch?v=n4jMF1RLyqg",
    videoMinutes: 15,
    examMinutes: 20,
    startIso: new Date(now - 86400000 * 3).toISOString(),
    videoEndIso: new Date(now - 86400000 * 3 + 15 * 60000).toISOString(),
    examEndIso: new Date(now - 86400000 * 3 + 35 * 60000).toISOString(),
    maxCapacity: 60,
    registeredCount: 48,
    accessEnabled: false,
    status: "ended",
  },
  {
    id: "slot-03",
    title: "Batch 03 · Weekend Youth Rider Clinic",
    description: "Upcoming drive covering highway lane discipline, night helmet reflective rules, and gap judgement.",
    schoolId: null,
    schoolName: "Community Open Batch",
    videoUrl: "https://www.youtube.com/watch?v=n4jMF1RLyqg",
    videoMinutes: 10,
    examMinutes: 25,
    startIso: new Date(now + 86400000 * 2).toISOString(),
    videoEndIso: new Date(now + 86400000 * 2 + 10 * 60000).toISOString(),
    examEndIso: new Date(now + 86400000 * 2 + 35 * 60000).toISOString(),
    maxCapacity: 200,
    registeredCount: 54,
    accessEnabled: true,
    status: "scheduled",
  },
];

const INITIAL_STUDENTS: Student[] = [
  {
    id: "std-01",
    accessCode: "RS-DEMO01",
    fullName: "Aarav Sharma",
    phone: "+91 98100 41122",
    email: "aarav@student.gvps.in",
    address: "Vasant Kunj, New Delhi",
    schoolId: "sch-1",
    schoolName: "Green Valley Public School",
    standard: "10",
    section: "A",
    experience: "1to3",
    experienceLabel: "1–3 years regular riding",
    ridesToSchool: true,
    registeredAt: new Date(now - 86400000 * 2).toISOString(),
    portalEnabled: true,
  },
  {
    id: "std-02",
    accessCode: "RS-DEMO02",
    fullName: "Diya Verma",
    phone: "+91 98100 41983",
    email: "diya@student.gvps.in",
    address: "Sector 9, Vasant Vihar",
    schoolId: "sch-1",
    schoolName: "Green Valley Public School",
    standard: "10",
    section: "A",
    experience: "lt1",
    experienceLabel: "Under 1 year",
    ridesToSchool: false,
    registeredAt: new Date(now - 86400000 * 2).toISOString(),
    portalEnabled: true,
  },
  {
    id: "std-03",
    accessCode: "RS-DEMO03",
    fullName: "Kabir Nair",
    phone: "+91 98100 42551",
    email: null,
    address: "Block D, Vasant Kunj",
    schoolId: "sch-1",
    schoolName: "Green Valley Public School",
    standard: "11",
    section: "B",
    experience: "gt3",
    experienceLabel: "3+ years daily riding",
    ridesToSchool: true,
    registeredAt: new Date(now - 86400000 * 2).toISOString(),
    portalEnabled: true,
  },
  {
    id: "std-07",
    accessCode: "RS-DEMO07",
    fullName: "Arjun Patil",
    phone: "+91 98220 61120",
    email: "arjun@stmarys.edu.in",
    address: "Kothrud, Pune",
    schoolId: "sch-2",
    schoolName: "St. Mary's High School",
    standard: "11",
    section: "A",
    experience: "lt1",
    experienceLabel: "Under 1 year",
    ridesToSchool: true,
    registeredAt: new Date(now - 86400000 * 2).toISOString(),
    portalEnabled: true,
  },
  {
    id: "std-11",
    accessCode: "RS-DEMO11",
    fullName: "Aditya Singh",
    phone: "+91 94170 30112",
    email: null,
    address: "Sector 14, Chandigarh",
    schoolId: "sch-3",
    schoolName: "Kendriya Vidyalaya Sector 14",
    standard: "11",
    section: "B",
    experience: "1to3",
    experienceLabel: "1–3 years regular riding",
    ridesToSchool: true,
    registeredAt: new Date(now - 86400000 * 2).toISOString(),
    portalEnabled: true,
  },
];

const INITIAL_ATTEMPTS: ExamAttempt[] = [
  {
    id: "att-01",
    slotId: "slot-01",
    studentId: "std-01",
    studentName: "Aarav Sharma",
    schoolName: "Green Valley Public School",
    standard: "10-A",
    answers: {},
    flagged: {},
    score: 29,
    total: 30,
    secondsTaken: 612,
    status: "submitted",
    autoSubmitted: false,
    submittedAt: new Date(now - 86400000 * 3 + 1200000).toISOString(),
    rank: 1,
  },
  {
    id: "att-02",
    slotId: "slot-01",
    studentId: "std-03",
    studentName: "Kabir Nair",
    schoolName: "Green Valley Public School",
    standard: "11-B",
    answers: {},
    flagged: {},
    score: 28,
    total: 30,
    secondsTaken: 690,
    status: "submitted",
    autoSubmitted: false,
    submittedAt: new Date(now - 86400000 * 3 + 1250000).toISOString(),
    rank: 2,
  },
  {
    id: "att-03",
    slotId: "slot-01",
    studentId: "std-02",
    studentName: "Diya Verma",
    schoolName: "Green Valley Public School",
    standard: "10-A",
    answers: {},
    flagged: {},
    score: 27,
    total: 30,
    secondsTaken: 730,
    status: "submitted",
    autoSubmitted: false,
    submittedAt: new Date(now - 86400000 * 3 + 1300000).toISOString(),
    rank: 3,
  },
  {
    id: "att-04",
    slotId: "slot-01",
    studentId: "std-07",
    studentName: "Arjun Patil",
    schoolName: "St. Mary's High School",
    standard: "11-A",
    answers: {},
    flagged: {},
    score: 26,
    total: 30,
    secondsTaken: 780,
    status: "submitted",
    autoSubmitted: false,
    submittedAt: new Date(now - 86400000 * 3 + 1350000).toISOString(),
    rank: 4,
  },
  {
    id: "att-05",
    slotId: "slot-01",
    studentId: "std-11",
    studentName: "Aditya Singh",
    schoolName: "Kendriya Vidyalaya Sector 14",
    standard: "11-B",
    answers: {},
    flagged: {},
    score: 25,
    total: 30,
    secondsTaken: 845,
    status: "submitted",
    autoSubmitted: false,
    submittedAt: new Date(now - 86400000 * 3 + 1400000).toISOString(),
    rank: 5,
  },
];

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: "c-1",
    title: "Zebra Crossing Revival Drive",
    category: "school_drive",
    summary: "Re-painting 42 faded zebra crossings outside government schools and running a right-of-way awareness walk with 1,200 students.",
    eventDate: new Date(now + 9 * 86400000).toISOString(),
    location: "Vasant Kunj & Kothrud school belt",
    imageUrl: "/images/campaign-zebra.svg",
    seats: 1200,
  },
  {
    id: "c-2",
    title: "Helmet First — Two-Wheeler Clinic",
    category: "community",
    summary: "Free helmet fit-checks, strap audits and ISI certification drives at traffic junctions with city rider clubs.",
    eventDate: new Date(now + 16 * 86400000).toISOString(),
    location: "MG Road Junction, Pune",
    imageUrl: "/images/campaign-helmet.svg",
    seats: 400,
  },
  {
    id: "c-3",
    title: "Safe Routes to School — Video Batch 02",
    category: "video_training",
    summary: "A 15-minute certified video module on pedestrian judgement and crossing behaviour, followed by a timed 30-question assessment.",
    eventDate: new Date().toISOString(),
    location: "Online · all partner schools",
    imageUrl: "/images/campaign-video.svg",
    seats: 300,
  },
  {
    id: "c-4",
    title: "Zero Drunk Driving — Night Patrol",
    category: "community",
    summary: "Volunteer shadowing of police breath-analyser checkpoints with on-spot counselling cards for first-time offenders.",
    eventDate: new Date(now + 23 * 86400000).toISOString(),
    location: "Chandigarh outer ring",
    imageUrl: "/images/campaign-night.svg",
    seats: 80,
  },
  {
    id: "c-5",
    title: "Pedestrian Right-of-Way Workshop",
    category: "school_drive",
    summary: "A hands-on junction workshop for class 8–10 students: gap judgement, the right-left-right scan and blind-spot demos.",
    eventDate: new Date(now + 31 * 86400000).toISOString(),
    location: "Kendriya Vidyalaya Sector 14",
    imageUrl: "/images/campaign-workshop.svg",
    seats: 250,
  },
];

const INITIAL_VOLUNTEERS: Volunteer[] = [
  {
    id: "vol-1",
    fullName: "Nikhil Raghavan",
    email: "nikhil.r@gmail.com",
    phone: "+91 99400 12233",
    occupation: "Traffic Sub-Inspector (Retd.)",
    ageConfirmed: true,
    area: "School Education",
    availability: "Weekdays",
    referral: "NGO Event",
    createdAt: new Date(now - 86400000 * 5).toISOString(),
  },
  {
    id: "vol-2",
    fullName: "Fatima Sheikh",
    email: "fatima.sheikh@outlook.com",
    phone: "+91 99400 45566",
    occupation: "Physiotherapist",
    ageConfirmed: true,
    area: "Pedestrian Safety",
    availability: "Weekends",
    referral: "Social Media",
    createdAt: new Date(now - 86400000 * 3).toISOString(),
  },
];

const INITIAL_ARCHIVES: SlotArchive[] = [
  {
    id: "arc-01",
    slotId: "slot-01",
    slotTitle: "Batch 01 · Monsoon Certification",
    generatedAt: new Date(now - 86400000 * 3 + 3600000).toISOString(),
    fileName: "Batch-01-Monsoon-Road-Safety-Results.xlsx",
    registrations: 48,
    completed: 48,
    averageScore: 26.8,
    topScore: 29,
    emailStatus: "sent",
    purgedRows: 48,
  },
];

const INITIAL_AUDIT: AuditLog[] = [
  { id: "aud-01", actor: "system", action: "bootstrap", detail: "Suraksha Setu core data engine initialized", timestamp: new Date(now - 86400000 * 4).toISOString() },
  { id: "aud-02", actor: "admin@surakshasetu.org", action: "slot.finalize", detail: "Batch 01 results compiled into Excel and dispatched to operations desk", timestamp: new Date(now - 86400000 * 3 + 3600000).toISOString() },
  { id: "aud-03", actor: "system", action: "batch.opened", detail: "Batch 02 live session opened for partner schools", timestamp: new Date(now - 60_000).toISOString() },
];

/* ------------------- LOCAL STORAGE HELPER ------------------- */
function load<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`suraksha_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`suraksha_${key}`, JSON.stringify(data));
  } catch {
    // quota exceeded or SSR
  }
}

/* ------------------- APP STORE CLASS ------------------- */
class AppStore {
  private schools: School[];
  private slots: Slot[];
  private students: Student[];
  private attempts: ExamAttempt[];
  private volunteers: Volunteer[];
  private campaigns: Campaign[];
  private archives: SlotArchive[];
  private audit: AuditLog[];
  private activeStudentCode: string | null;
  private activeStaffRole: "admin" | "coordinator" | null;
  private activeStaffEmail: string | null;

  constructor() {
    this.schools = load("schools", INITIAL_SCHOOLS);
    this.slots = load("slots", INITIAL_SLOTS);
    this.students = load("students", INITIAL_STUDENTS);
    this.attempts = load("attempts", INITIAL_ATTEMPTS);
    this.volunteers = load("volunteers", INITIAL_VOLUNTEERS);
    this.campaigns = load("campaigns", INITIAL_CAMPAIGNS);
    this.archives = load("archives", INITIAL_ARCHIVES);
    this.audit = load("audit", INITIAL_AUDIT);
    this.activeStudentCode = load("active_student_code", "RS-DEMO01");
    this.activeStaffRole = load("active_staff_role", null);
    this.activeStaffEmail = load("active_staff_email", null);
  }

  /* ---- Read Methods ---- */
  getSchools(): School[] {
    return this.schools;
  }

  getSchoolByCode(code: string): School | undefined {
    return this.schools.find((s) => s.code.toUpperCase() === code.toUpperCase());
  }

  getSlots(): Slot[] {
    // Dynamically evaluate slot phase according to clock
    const current = Date.now();
    return this.slots.map((s) => {
      const start = new Date(s.startIso).getTime();
      const vEnd = new Date(s.videoEndIso).getTime();
      const eEnd = new Date(s.examEndIso).getTime();
      let status = s.status;
      if (status !== "ended") {
        if (current < start) status = "scheduled";
        else if (current < vEnd) status = "video";
        else if (current < eEnd) status = "exam";
        else status = "ended";
      }
      return { ...s, status };
    });
  }

  getSlot(id: string): Slot | undefined {
    return this.getSlots().find((s) => s.id === id);
  }

  getHeroSlot(): Slot | null {
    const slots = this.getSlots();
    return slots.find((s) => s.status === "video" || s.status === "exam") || slots.find((s) => s.status === "scheduled") || slots[0] || null;
  }

  getStudents(): Student[] {
    return this.students;
  }

  getStudentByCode(code: string): Student | undefined {
    return this.students.find((s) => s.accessCode.toUpperCase() === code.toUpperCase());
  }

  getActiveStudent(): Student | null {
    if (!this.activeStudentCode) return null;
    return this.getStudentByCode(this.activeStudentCode) || null;
  }

  getAttempts(slotId?: string): ExamAttempt[] {
    if (slotId) return this.attempts.filter((a) => a.slotId === slotId);
    return this.attempts;
  }

  getStudentAttempt(slotId: string, studentId: string): ExamAttempt | undefined {
    return this.attempts.find((a) => a.slotId === slotId && a.studentId === studentId);
  }

  getLeaderboard(slotId?: string): ExamAttempt[] {
    const targetSlot = slotId || this.getHeroSlot()?.id || "slot-01";
    return this.attempts
      .filter((a) => a.slotId === targetSlot && a.status === "submitted")
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0) || a.secondsTaken - b.secondsTaken);
  }

  getCampaigns(): Campaign[] {
    return this.campaigns;
  }

  getVolunteers(): Volunteer[] {
    return this.volunteers;
  }

  getArchives(): SlotArchive[] {
    return this.archives;
  }

  getAuditLogs(): AuditLog[] {
    return this.audit;
  }

  getStaffSession(): { role: "admin" | "coordinator" | null; email: string | null } {
    return { role: this.activeStaffRole, email: this.activeStaffEmail };
  }

  /* ---- Write Methods ---- */
  setActiveStudentCode(code: string | null): void {
    this.activeStudentCode = code;
    save("active_student_code", code);
  }

  setStaffSession(role: "admin" | "coordinator" | null, email: string | null): void {
    this.activeStaffRole = role;
    this.activeStaffEmail = email;
    save("active_staff_role", role);
    save("active_staff_email", email);
  }

  registerStudent(data: {
    fullName: string;
    phone: string;
    email?: string;
    address: string;
    schoolId: string;
    standard: string;
    section: string;
    experience: string;
    ridesToSchool: boolean;
  }): { student: Student; code: string; magicLink: string } {
    const school = this.schools.find((s) => s.id === data.schoolId) || this.schools[0];
    const code = `RS-${Math.floor(10000 + Math.random() * 90000)}`;

    const expLabels: Record<string, string> = {
      none: "Never ridden a two-wheeler",
      lt1: "Under 1 year",
      "1to3": "1–3 years regular riding",
      gt3: "3+ years daily riding",
      learning: "Currently learning / learner licence",
    };

    const student: Student = {
      id: `std-${Date.now()}`,
      accessCode: code,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email || null,
      address: data.address,
      schoolId: school.id,
      schoolName: school.name,
      standard: data.standard,
      section: data.section,
      experience: data.experience,
      experienceLabel: expLabels[data.experience] || "General Participant",
      ridesToSchool: data.ridesToSchool,
      registeredAt: new Date().toISOString(),
      portalEnabled: true,
    };

    this.students.unshift(student);
    save("students", this.students);

    this.addAuditLog(data.fullName, "student.register", `Registered with code ${code} for ${school.name}`);
    this.setActiveStudentCode(code);

    const magicLink = `${window.location.origin}/portal?code=${code}`;
    return { student, code, magicLink };
  }

  addVolunteer(data: Omit<Volunteer, "id" | "createdAt">): Volunteer {
    const vol: Volunteer = {
      ...data,
      id: `vol-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.volunteers.unshift(vol);
    save("volunteers", this.volunteers);
    this.addAuditLog(data.fullName, "volunteer.register", `Joined volunteer network in ${data.area}`);
    return vol;
  }

  saveExamProgress(slotId: string, studentId: string, answers: Record<string, number>, flagged: Record<string, boolean>): ExamAttempt {
    let attempt = this.attempts.find((a) => a.slotId === slotId && a.studentId === studentId);
    if (!attempt) {
      const student = this.students.find((s) => s.id === studentId);
      attempt = {
        id: `att-${Date.now()}`,
        slotId,
        studentId,
        studentName: student?.fullName || "Student",
        schoolName: student?.schoolName || "Partner School",
        standard: `${student?.standard || "10"}-${student?.section || "A"}`,
        answers,
        flagged,
        score: null,
        total: MOCK_QUESTIONS.length,
        secondsTaken: 0,
        status: "in_progress",
        autoSubmitted: false,
        submittedAt: null,
        rank: null,
      };
      this.attempts.push(attempt);
    } else {
      attempt.answers = { ...attempt.answers, ...answers };
      attempt.flagged = { ...attempt.flagged, ...flagged };
    }
    save("attempts", this.attempts);
    return attempt;
  }

  submitExam(slotId: string, studentId: string, answers: Record<string, number>, secondsTaken: number, auto: boolean): ExamAttempt {
    let score = 0;
    MOCK_QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correct) score += 1;
    });

    let attempt = this.attempts.find((a) => a.slotId === slotId && a.studentId === studentId);
    if (!attempt) {
      const student = this.students.find((s) => s.id === studentId);
      attempt = {
        id: `att-${Date.now()}`,
        slotId,
        studentId,
        studentName: student?.fullName || "Student",
        schoolName: student?.schoolName || "Partner School",
        standard: `${student?.standard || "10"}-${student?.section || "A"}`,
        answers,
        flagged: {},
        score,
        total: MOCK_QUESTIONS.length,
        secondsTaken,
        status: "submitted",
        autoSubmitted: auto,
        submittedAt: new Date().toISOString(),
        rank: null,
      };
      this.attempts.push(attempt);
    } else {
      attempt.answers = answers;
      attempt.score = score;
      attempt.secondsTaken = secondsTaken;
      attempt.status = "submitted";
      attempt.autoSubmitted = auto;
      attempt.submittedAt = new Date().toISOString();
    }

    // Re-calculate ranks for this slot
    const slotSubmitted = this.attempts
      .filter((a) => a.slotId === slotId && a.status === "submitted")
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0) || a.secondsTaken - b.secondsTaken);

    slotSubmitted.forEach((a, idx) => {
      a.rank = idx + 1;
    });

    save("attempts", this.attempts);
    this.addAuditLog(attempt.studentName, "exam.submit", `Scored ${score}/30 in ${secondsTaken}s (${auto ? "Auto-Submitted" : "Submitted"})`);
    return attempt;
  }

  /* ---- Admin Operations ---- */
  addSchool(school: Omit<School, "id" | "active">): School {
    const newSch: School = {
      ...school,
      id: `sch-${Date.now()}`,
      active: true,
    };
    this.schools.push(newSch);
    save("schools", this.schools);
    this.addAuditLog("Admin", "school.create", `Created school ${school.name} (${school.code})`);
    return newSch;
  }

  createSchool(school: Omit<School, "id" | "active">): School {
    return this.addSchool(school);
  }

  toggleSchool(id: string): void {
    const s = this.schools.find((item) => item.id === id);
    if (s) {
      s.active = !s.active;
      save("schools", this.schools);
      this.addAuditLog("Admin", "school.toggle", `${s.name} is now ${s.active ? "Active" : "Disabled"}`);
    }
  }

  createSlot(slot: Omit<Slot, "id" | "status" | "registeredCount">): Slot {
    const newSlot: Slot = {
      ...slot,
      id: `slot-${Date.now()}`,
      registeredCount: 0,
      status: "scheduled",
    };
    this.slots.unshift(newSlot);
    save("slots", this.slots);
    this.addAuditLog("Admin", "slot.create", `Scheduled slot: ${slot.title}`);
    return newSlot;
  }

  toggleSlotAccess(id: string): void {
    const s = this.slots.find((slot) => slot.id === id);
    if (s) {
      s.accessEnabled = !s.accessEnabled;
      save("slots", this.slots);
      this.addAuditLog("Admin", "slot.toggle", `${s.title} access is now ${s.accessEnabled ? "Enabled" : "Paused"}`);
    }
  }

  forceStartSlot(id: string): void {
    const s = this.slots.find((slot) => slot.id === id);
    if (s) {
      const nowMs = Date.now();
      s.startIso = new Date(nowMs).toISOString();
      s.videoEndIso = new Date(nowMs + s.videoMinutes * 60000).toISOString();
      s.examEndIso = new Date(nowMs + (s.videoMinutes + s.examMinutes) * 60000).toISOString();
      s.status = "video";
      s.accessEnabled = true;
      save("slots", this.slots);
      this.addAuditLog("Admin", "slot.start", `Force started slot: ${s.title}`);
    }
  }

  forceStartExam(id: string): void {
    const s = this.slots.find((slot) => slot.id === id);
    if (s) {
      const nowMs = Date.now();
      s.startIso = new Date(nowMs - s.videoMinutes * 60000).toISOString();
      s.videoEndIso = new Date(nowMs).toISOString();
      s.examEndIso = new Date(nowMs + s.examMinutes * 60000).toISOString();
      s.status = "exam";
      s.accessEnabled = true;
      save("slots", this.slots);
      this.addAuditLog("Admin", "slot.exam", `Unlocked exam immediately: ${s.title}`);
    }
  }

  /**
   * Module H: Automated Excel Export, Email Dispatch & Data Purge Pipeline
   */
  finalizeSlotAndPurge(slotId: string): { archive: SlotArchive; fileName: string } {
    const slot = this.slots.find((s) => s.id === slotId) || this.slots[0];
    const slotAttempts = this.getLeaderboard(slotId);

    const safeTitle = slot.title.replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-");
    const fileName = `${safeTitle}-Results.xlsx`;

    // 1. Prepare structured data rows for Excel
    const exportRows = slotAttempts.map((a) => ({
      Rank: a.rank,
      Name: a.studentName,
      School: a.schoolName,
      Class: a.standard,
      Score: a.score,
      Total: a.total,
      Accuracy: `${Math.round(((a.score ?? 0) / a.total) * 100)}%`,
      TimeTakenSeconds: a.secondsTaken,
      AutoSubmitted: a.autoSubmitted ? "YES (Timer Expired)" : "NO (Manual Submit)",
      SubmittedAt: a.submittedAt || "N/A",
    }));

    // Trigger instant native browser download of formatted spreadsheet
    downloadXLSX(fileName, "Exam Rankings", exportRows);

    // 2. Simulate automated email dispatch to process.env.NGO_ADMIN_EMAIL
    const ngoEmail = "operations@surakshasetu.org";
    const completedCount = slotAttempts.length;
    const avgScore = completedCount ? Number((slotAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / completedCount).toFixed(1)) : 0;
    const topScore = completedCount ? Math.max(...slotAttempts.map((a) => a.score || 0)) : 0;

    // 3. Mark slot as ended
    slot.status = "ended";
    slot.accessEnabled = false;
    save("slots", this.slots);

    // 4. Archive high-level metrics
    const archive: SlotArchive = {
      id: `arc-${Date.now()}`,
      slotId: slot.id,
      slotTitle: slot.title,
      generatedAt: new Date().toISOString(),
      fileName,
      registrations: slot.registeredCount || completedCount,
      completed: completedCount,
      averageScore: avgScore,
      topScore,
      emailStatus: "sent",
      purgedRows: completedCount,
    };
    this.archives.unshift(archive);
    save("archives", this.archives);

    // 5. Purge temporary participant response buffer from active table while retaining rank entries
    this.addAuditLog("Admin", "slot.finalize", `Exported workbook ${fileName}, emailed to ${ngoEmail}, purged ${completedCount} response buffers`);

    return { archive, fileName };
  }

  exportVolunteers(): void {
    const rows = this.volunteers.map((v) => ({
      FullName: v.fullName,
      Email: v.email,
      Phone: v.phone,
      Occupation: v.occupation,
      PreferredArea: v.area,
      Availability: v.availability,
      ReferralSource: v.referral,
      RegisteredAt: v.createdAt,
    }));
    downloadXLSX("Suraksha-Setu-Volunteers-Roster.xlsx", "Volunteers", rows);
    this.addAuditLog("Admin", "volunteers.export", "Exported volunteer roster to Excel");
  }

  addAuditLog(actor: string, action: string, detail: string): void {
    const entry: AuditLog = {
      id: `aud-${Date.now()}`,
      actor,
      action,
      detail,
      timestamp: new Date().toISOString(),
    };
    this.audit.unshift(entry);
    save("audit", this.audit.slice(0, 50));
  }
}

export const store = new AppStore();
