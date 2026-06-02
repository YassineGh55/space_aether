import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMe, useLogout } from "../hooks/useAuth";

const LINKS = [
  { label: "Schedule", to: "/schedule" },
  { label: "Destinations", to: "/#destinations" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: user } = useMe();
  const logout = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 page-padding py-5 md:py-7 ${scrolled || open ? "glass border-b border-cyan-500/10" : "bg-transparent"}`}>
        <div className="flex items-center justify-between gap-6">
          <Link to="/" className="font-mono text-base md:text-lg tracking-[0.2em] uppercase text-cyan-400 hover:text-cyan-300 transition-colors shrink-0">
            ÆTHER
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {LINKS.map(l => (
              <Link key={l.label} to={l.to} className="text-xs tracking-widest uppercase text-zinc-500 hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-xs tracking-widest uppercase text-zinc-400 hover:text-white transition-colors">
                  {user.name}
                </Link>
                <button
                  onClick={async () => { await logout.mutateAsync(); navigate("/"); }}
                  className="text-xs tracking-widest uppercase text-zinc-500 hover:text-white transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/login" className="font-mono text-xs tracking-widest uppercase px-5 py-2.5 border border-cyan-500/60 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:border-cyan-500 transition-all">
                Sign In
              </Link>
            )}
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen(v => !v)}
            className="md:hidden flex flex-col gap-1.5 p-2 -mr-2"
          >
            <span className={`block h-px w-6 bg-cyan-400 transition-all duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`block h-px w-6 bg-cyan-400 transition-all duration-300 ${open ? "opacity-0" : ""}`} />
            <span className={`block h-px w-6 bg-cyan-400 transition-all duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute top-[72px] left-0 right-0 glass border-b border-cyan-500/10 page-padding py-8 flex flex-col gap-6 animate-fade-up">
            {LINKS.map(l => (
              <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className="text-sm tracking-widest uppercase text-zinc-300 hover:text-cyan-400 transition-colors">
                {l.label}
              </Link>
            ))}
            <div className="h-px bg-zinc-800" />
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="text-sm tracking-widest uppercase text-zinc-300">{user.name}</Link>
                <button
                  onClick={async () => { setOpen(false); await logout.mutateAsync(); navigate("/"); }}
                  className="text-left text-sm tracking-widest uppercase text-zinc-500 hover:text-white transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="btn-primary text-center w-fit">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
