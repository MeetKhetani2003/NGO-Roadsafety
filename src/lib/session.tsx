import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, type PortalStudent, type Staff } from "@/lib/api";
import { store } from "@/lib/store";

type SessionValue = {
  staff: Staff | null;
  student: PortalStudent | null;
  loading: boolean;
  offline: boolean;
  offlineMessage: string | null;
  refresh: () => Promise<void>;
  loginStaff: (role: "admin" | "coordinator", email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [staff, setStaff] = useState<Staff | null>(() => {
    const s = store.getStaffSession();
    if (!s.role) return null;
    return {
      id: s.role === "admin" ? "u-admin" : "u-coord",
      name: s.role === "admin" ? "Super Admin" : "School Coordinator",
      email: s.email || (s.role === "admin" ? "admin@surakshasetu.org" : "meera@greenvalley.edu.in"),
      role: s.role,
      schoolId: s.role === "coordinator" ? "sch-1" : null,
    };
  });

  const [student, setStudent] = useState<PortalStudent | null>(() => {
    const st = store.getActiveStudent();
    if (!st) return null;
    return {
      id: st.id,
      name: st.fullName,
      phone: st.phone,
      address: st.address,
      email: st.email,
      schoolName: st.schoolName,
      standard: st.standard,
      section: st.section,
      experience: st.experience,
      experienceLabel: st.experienceLabel,
      accessCode: st.accessCode,
    };
  });

  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);
  const [offlineMessage, setOfflineMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const me = await api.me();
      if (me.staff) {
        setStaff(me.staff);
      } else {
        const s = store.getStaffSession();
        if (s.role) {
          setStaff({
            id: s.role === "admin" ? "u-admin" : "u-coord",
            name: s.role === "admin" ? "Super Admin" : "School Coordinator",
            email: s.email || (s.role === "admin" ? "admin@surakshasetu.org" : "meera@greenvalley.edu.in"),
            role: s.role,
            schoolId: s.role === "coordinator" ? "sch-1" : null,
          });
        } else {
          setStaff(null);
        }
      }

      if (me.student) {
        setStudent(me.student);
      } else {
        const st = store.getActiveStudent();
        if (st) {
          setStudent({
            id: st.id,
            name: st.fullName,
            phone: st.phone,
            address: st.address,
            email: st.email,
            schoolName: st.schoolName,
            standard: st.standard,
            section: st.section,
            experience: st.experience,
            experienceLabel: st.experienceLabel,
            accessCode: st.accessCode,
          });
        } else {
          setStudent(null);
        }
      }
      setOffline(false);
      setOfflineMessage(null);
    } catch (error) {
      setOffline(true);
      setOfflineMessage(error instanceof Error ? error.message : "API unreachable");
    } finally {
      setLoading(false);
    }
  }, []);

  const loginStaff = useCallback(async (role: "admin" | "coordinator", email: string) => {
    store.setStaffSession(role, email);
    const newStaff: Staff = {
      id: role === "admin" ? "u-admin" : "u-coord",
      name: role === "admin" ? "Super Admin" : "School Coordinator",
      email,
      role,
      schoolId: role === "coordinator" ? "sch-1" : null,
    };
    setStaff(newStaff);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      store.setStaffSession(null, null);
      store.setActiveStudentCode(null);
      setStaff(null);
      setStudent(null);
    }
  }, []);

  const value = useMemo(
    () => ({ staff, student, loading, offline, offlineMessage, refresh, loginStaff, logout }),
    [staff, student, loading, offline, offlineMessage, refresh, loginStaff, logout],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside <SessionProvider>");
  return ctx;
}
