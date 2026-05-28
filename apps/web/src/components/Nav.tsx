import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMe, useLogout } from "../hooks/useAuth";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { data: user } = useMe();
  const logout = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-16 py-7 transition-all duration-300 ${scrolled ? "bg-black/80 backdrop-blur border-b border-cyan-500/10" : ""}`}>
      <Link to="/" className="font-mono text-cyan-400 tracking-widest text-lg uppercase">ÆTHER</Link>
      <div className="flex gap-10">
        {["Schedule", "Destinations"].map(l => (
          <Link key={l} to={`/${l.toLowerCase()}`} className="text-xs tracking-widest uppercase text-zinc-500 hover:text-white transition-colors">{l}</Link>
        ))}
      </div>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <Link to="/dashboard" className="text-xs tracking-widest uppercase text-zinc-500 hover:text-white transition-colors">{user.name}</Link>
            <button onClick={async () => { await logout.mutateAsync(); navigate("/"); }} className="text-xs tracking-widest uppercase text-zinc-500 hover:text-white transition-colors">Sign out</button>
          </>
        ) : (
          <Link to="/login" className="font-mono text-xs tracking-widest uppercase px-5 py-2 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all">Sign In</Link>
        )}
      </div>
    </nav>
  );
}