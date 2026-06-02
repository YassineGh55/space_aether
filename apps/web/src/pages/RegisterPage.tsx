import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegister } from "../hooks/useAuth";
import AuthLayout from "../components/AuthLayout";
import GoogleSignInButton, { AuthDivider } from "../components/GoogleSignIn";

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
    <AuthLayout
      title="Join the crew"
      subtitle="Create your ÆTHER account"
      footer={<>Have an account? <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">Sign in</Link></>}
    >
      <GoogleSignInButton />
      <AuthDivider />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="section-label block mb-2 text-zinc-500">Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" placeholder="Your name" required />
        </div>
        <div>
          <label className="section-label block mb-2 text-zinc-500">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" required />
        </div>
        <div>
          <label className="section-label block mb-2 text-zinc-500">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder="••••••••" required />
        </div>
        {register.error && <p className="text-red-400 text-sm font-mono">Registration failed</p>}
        <button type="submit" disabled={register.isPending} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
          {register.isPending ? "Creating account..." : "Create account with email"}
        </button>
      </form>
    </AuthLayout>
  );
}
