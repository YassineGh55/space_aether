import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";
import AuthLayout from "../components/AuthLayout";
import GoogleSignInButton, { AuthDivider } from "../components/GoogleSignIn";

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
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your ÆTHER account"
      footer={<>No account? <Link to="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors">Register</Link></>}
    >
      <GoogleSignInButton />
      <AuthDivider />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="section-label block mb-2 text-zinc-500">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" required />
        </div>
        <div>
          <label className="section-label block mb-2 text-zinc-500">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder="••••••••" required />
        </div>
        {login.error && <p className="text-red-400 text-sm font-mono">Invalid credentials</p>}
        <button type="submit" disabled={login.isPending} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
          {login.isPending ? "Signing in..." : "Sign in with email"}
        </button>
      </form>
    </AuthLayout>
  );
}
