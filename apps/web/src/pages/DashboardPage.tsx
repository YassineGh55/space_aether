import { useMe, useLogout } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { data: user } = useMe();
  const logout = useLogout();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout.mutateAsync();
    navigate("/login");
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">ÆTHER</h1>
        <p className="text-zinc-400">Welcome, {user?.name}</p>
        <button
          onClick={handleLogout}
          className="text-sm text-cyan-500 hover:underline"
        >
          Sign out
        </button>
      </div>
    </main>
  );
}