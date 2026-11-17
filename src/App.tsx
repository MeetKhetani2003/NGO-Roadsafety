import { Navigate, Route, Routes } from "react-router-dom";
import { useSession } from "@/lib/session";
import { store } from "@/lib/store";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Portal from "@/pages/Portal";
import Exam from "@/pages/Exam";
import Leaderboard from "@/pages/Leaderboard";
import Login from "@/pages/Login";
import Admin from "@/pages/Admin";
import Coordinator from "@/pages/Coordinator";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { staff } = useSession();
  const session = store.getStaffSession();
  const role = staff?.role || session.role;

  if (role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function CoordinatorGuard({ children }: { children: React.ReactNode }) {
  const { staff } = useSession();
  const session = store.getStaffSession();
  const role = staff?.role || session.role;

  if (role !== "coordinator" && role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function DashboardRedirect() {
  const { staff } = useSession();
  const session = store.getStaffSession();
  const role = staff?.role || session.role;
  const student = store.getActiveStudent();

  if (role === "admin") return <Navigate to="/admin" replace />;
  if (role === "coordinator") return <Navigate to="/coordinator" replace />;
  if (student) return <Navigate to="/portal" replace />;
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardRedirect />} />
        <Route path="/portal" element={<Portal />} />
        <Route path="/exam" element={<Exam />} />
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <Admin />
            </AdminGuard>
          }
        />
        <Route
          path="/coordinator"
          element={
            <CoordinatorGuard>
              <Coordinator />
            </CoordinatorGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
