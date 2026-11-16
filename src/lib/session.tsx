import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, type PortalStudent, type Staff } from "@/lib/api";

type SessionValue = {
  staff: Staff | null;
  student: PortalStudent | null;
  loading: boolean;
  offline: boolean;
  offlineMessage: string | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [student, setStudent] = useState<PortalStudent | null>(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [offlineMessage, setOfflineMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const me = await api.me();
      setStaff(me.staff);
      setStudent(me.student ?? null);
      setOffline(false);
      setOfflineMessage(null);
    } catch (error) {
      setOffline(true);
      setOfflineMessage(error instanceof Error ? error.message : "API unreachable");
      setStaff(null);
      setStudent(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      setStaff(null);
      setStudent(null);
      await refresh();
    }
  }, [refresh]);

  const value = useMemo(
    () => ({ staff, student, loading, offline, offlineMessage, refresh, logout }),
    [staff, student, loading, offline, offlineMessage, refresh, logout],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside <SessionProvider>");
  return ctx;
}
