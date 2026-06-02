import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import StarCanvas from "./StarCanvas";
import FooterNote from "./FooterNote";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export default function AuthLayout({ title, subtitle, children, footer }: Props) {
  return (
    <main className="relative min-h-screen bg-aether-bg text-white flex flex-col overflow-hidden">
      <StarCanvas />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-cyan-950/30 via-transparent to-aether-bg" />
      <div className="hero-glow top-1/4 left-1/2 -translate-x-1/2 z-[1]" />

      <header className="relative z-10 page-padding pt-8">
        <Link to="/" className="font-mono text-lg tracking-widest uppercase text-cyan-400 hover:text-cyan-300 transition-colors">
          ÆTHER
        </Link>
      </header>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center page-padding py-12">
        <div className="glass-card w-full max-w-md p-8 md:p-10 animate-fade-up">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-zinc-500">{subtitle}</p>
          </div>
          {children}
          <div className="mt-6 text-center text-sm text-zinc-500">{footer}</div>
        </div>
      </div>

      <div className="relative z-10 pb-8">
        <FooterNote />
      </div>
    </main>
  );
}
