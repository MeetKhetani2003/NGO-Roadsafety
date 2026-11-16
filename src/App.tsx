import { Navigate, Route, Routes } from "react-router-dom";
import { useSession } from "@/lib/session";
import { store } from "@/lib/store";
import { Spinner } from "@/components/ui";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Portal from "@/pages/Portal";
import Exam from "@/pages/Exam";
import Leaderboard from "@/pages/Leaderboard";
import Login from "@/pages/Login";
import Admin from "@/pages/Admin";
import Coordinator from "@/pages/Coordinator";

export default function App() {
  const { staff, loading } = useSession();
  const staffRole = staff?.role || store.getStaffSession().role;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {loading ? (
        <Spinner label="Loading Suraksha Setu portal…" />
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/exam" element={<Exam />} />
          <Route
            path="/admin"
            element={staffRole === "admin" ? <Admin /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/coordinator"
            element={staffRole === "coordinator" ? <Coordinator /> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </div>
  );
}
