import type { ReactNode } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useReveal } from "../hooks/useReveal";

export default function AnimatedPage({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useReveal([pathname]);

  return (
    <div key={pathname} className="min-h-screen animate-fade-up">
      {children}
    </div>
  );
}
