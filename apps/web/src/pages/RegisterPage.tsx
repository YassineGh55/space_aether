import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegister } from "../hooks/useAuth";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const register = useRegister();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await register.mutateAsync({ name, email, password });
    navigate("/dashboard");
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-sm space-y-8 px-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ÆTHER</h1>
          <p className="text-zinc-500 mt-2 text-sm">Create your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text" placeholder="Name" value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-cyan-500"
          />
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
          {register.error && <p className="text-red-400 text-sm">Registration failed</p>}
          <button
            type="submit" disabled={register.isPending}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded text-sm transition-colors disabled:opacity-50"
          >
            {register.isPending ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="text-zinc-500 text-sm text-center">
          Have an account? <Link to="/login" className="text-cyan-500 hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}