import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";
import FooterNote from "../components/FooterNote";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login.mutateAsync({ email, password });
    navigate("/dashboard");
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto space-y-8 px-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ÆTHER</h1>
          <p className="text-zinc-500 mt-2 text-sm">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-cyan-500"
          />
          <input
            type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-cyan-500"
          />
          {login.error && <p className="text-red-400 text-sm">Invalid credentials</p>}
          <button
            type="submit" disabled={login.isPending}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded text-sm transition-colors disabled:opacity-50"
          >
            {login.isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="text-zinc-500 text-sm text-center">
          No account? <Link to="/register" className="text-cyan-500 hover:underline">Register</Link>
        </p>
      </div>
      <div className="pb-8">
        <FooterNote />
      </div>
    </main>
  );
}