# Suraksha Setu — Road Safety NGO & Timed LMS Portal

A modern, responsive, full-stack **Vite + React 19 + TypeScript + Tailwind CSS v4 + Framer Motion** single-page application built for the **Suraksha Setu** National Road Safety Council.

---

## 🎨 Complete UI Redesign Highlights

- **Modern SaaS & EdTech Aesthetic**: Clean light canvas (`bg-slate-50`), soft rounded cards (`rounded-2xl`), subtle glass borders (`border-slate-200`), and vivid safety-oriented accents:
  - **Trust Blue (`#2563eb`)**: Primary institutional actions, candidate identity, and progress bars
  - **Safety Emerald (`#10b981`)**: Certified pass status, active slot indicators, and verified badges
  - **Amber Gold (`#f59e0b`)**: Session countdown timers, flagged questions, and championship awards
  - **Coral Rose (`#ef4444`)**: Emergency alerts, speed warnings, and hazard callouts
- **Typography**: Replaced heavy industrial display fonts with modern, crisp Google Fonts:
  - **Plus Jakarta Sans**: Bold, modern headings
  - **Inter**: Clean, readable body prose
  - **JetBrains Mono**: Precise digital timers, access codes, and scores
- **Authentic Visual Imagery**:
  - High-resolution road safety photography (school crossings, helmet riders, seatbelt safety, awareness seminars)
  - 23 custom SVG assets including traffic signs for all 30 MCQs, distinction medals, and printable seal
- **Interactive Micro-Interactions**:
  - Floating glass navigation bar with blur and live status pills
  - Circular animated score dials and real-time ticking exam countdowns
  - Duolingo/Strava-inspired Top 3 podium with Gold, Silver, and Bronze medal badges
  - Official printable certificate with QR validation layout (`window.print()`)

---

## 🚀 Core Modules (Master Prompt Aligned)

1. **Public NGO Website & Community Volunteer Portal (Module A)**
   - Mission, 6 Core Principles with traffic signs, interactive campaign filter tabs, and volunteer registration form.
2. **School & Coordinator Management (Module B)**
   - School onboarding links (`/register?school=GVPS-DEL-01`), teacher profiles, and roster tracking.
3. **Student Registration & Access Code Provisioning (Module C)**
   - 90-second onboarding, 2-wheeler riding experience selection, instant access code (`RS-XXXXX`), and magic link generation.
4. **Scheduled Timed Video LMS (Module D)**
   - Synchronized slot video player; live countdown; auto-hides/removes YouTube video from the DOM at 0:00 and auto-redirects to the exam interface.
5. **Timed 30-Question MCQ Examination Engine (Module E)**
   - Sticky verification header (Candidate Name, Cell No, Address, Riding Experience).
   - 30 curriculum-mapped MCQs with traffic sign diagrams, circular timer, question palette sidebar, instant scoring, question explanations, and official printable certificate.
6. **Leaderboard & Reward Ranking Engine (Module F)**
   - Score-first ranking with time taken (seconds) tiebreaker, Top 10 display, and slot filters.
7. **Admin Control Room & Slot Scheduler (Module G)**
   - Real-time KPI metrics, slot creation modal, instant force-start controls, batch pause/resume toggles.
8. **Automated Excel Export, Email Dispatch & Data Purge (Module H)**
   - One-click trigger: generates formatted Excel `.xlsx`/`.xls` workbook, simulates dispatch to `operations@surakshasetu.org`, and purges temporary student response buffer data.

---

## 🏃 How to Run

```bash
# Start development server
npm.cmd run dev

# Run TypeScript type check
npm.cmd run typecheck

# Production build
npm.cmd run build
```

---

## 🔑 Pre-Configured Demo Credentials

| Role | Identifier / Email | Password / Code | Link |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@surakshasetu.org` | `admin123` | [/login](file:///c:/Users/Meet/Downloads/road-safety-lms-portal/src/pages/Login.tsx) |
| **School Coordinator** | `meera@greenvalley.edu.in` | `teacher123` | [/login](file:///c:/Users/Meet/Downloads/road-safety-lms-portal/src/pages/Login.tsx) |
| **Demo Student** | Access Code: `RS-DEMO01` | *(or self-register)* | [/portal](file:///c:/Users/Meet/Downloads/road-safety-lms-portal/src/pages/Portal.tsx) |
| **Direct School Link** | Pre-linked to Green Valley | `GVPS-DEL-01` | [/register?school=GVPS-DEL-01](file:///c:/Users/Meet/Downloads/road-safety-lms-portal/src/pages/Register.tsx) |
