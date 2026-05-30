import { useEffect } from "react";
import { Link } from "react-router-dom";
import StarCanvas from "../components/StarCanvas";
import Nav from "../components/Nav";
import { useFlights, useDestinations, useGallery } from "../hooks/useFlights";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("revealed"); });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function LandingPage() {
  useReveal();
  const { data: flights } = useFlights();
  const { data: destinations } = useDestinations();
  const { data: gallery } = useGallery();

  const upcoming = flights?.filter((f: any) => f.status === "scheduled" || f.status === "boarding").slice(0, 3);

  return (
    <div className="bg-[#020408] text-white min-h-screen overflow-x-hidden">
      <style>{`
        .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .revealed { opacity: 1; transform: none; }
      `}</style>
      <StarCanvas />
      <Nav />

      {/* HERO */}
      <section className="relative z-10 min-h-screen flex flex-col justify-end px-16 pb-20">
        <div className="text-xs font-mono tracking-widest text-cyan-400 uppercase mb-6 animate-fade-up">Est. 2019 — Humanity's Interplanetary Carrier</div>
        <h1 className="text-[clamp(64px,9vw,130px)] font-bold leading-[0.9] tracking-tight mb-8">
          <span className="block">Beyond</span>
          <span className="block text-cyan-400">the last</span>
          <span className="block">horizon.</span>
        </h1>
        <p className="text-zinc-500 text-sm max-w-sm leading-relaxed mb-10">
          The solar system's first interplanetary airline. Book passage to the Moon, Mars, and beyond.
        </p>
        <div className="flex gap-4">
          <Link to="/schedule" className="font-mono text-xs tracking-widest uppercase px-8 py-4 bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors">View Schedule</Link>
          <Link to="/register" className="font-mono text-xs tracking-widest uppercase px-8 py-4 border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white transition-colors">Create Account</Link>
        </div>
        <div className="absolute right-16 bottom-20 font-mono text-xs text-zinc-600 tracking-widest">
          LAT <span className="text-cyan-400">36.8065°N</span> &nbsp;·&nbsp; LONG <span className="text-cyan-400">10.1815°E</span>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="relative z-10 border-y border-cyan-500/10 py-4 overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee font-mono text-xs tracking-widest text-zinc-600 uppercase">
          {["LUNAR GATEWAY", "MARS TRANSIT", "HELIOS PROPULSION", "DEEP SPACE RELAY", "ORBITAL HABITAT", "ASTEROID SURVEY", "SOLAR SAIL"].map(t => (
            <span key={t}>{t}<span className="text-cyan-400 mx-5">◆</span></span>
          ))}
          {["LUNAR GATEWAY", "MARS TRANSIT", "HELIOS PROPULSION", "DEEP SPACE RELAY", "ORBITAL HABITAT", "ASTEROID SURVEY", "SOLAR SAIL"].map(t => (
            <span key={t + "2"}>{t}<span className="text-cyan-400 mx-5">◆</span></span>
          ))}
        </div>
      </div>

      {/* UPCOMING FLIGHTS */}
      <section className="relative z-10 px-16 py-32">
        <div className="flex items-center gap-5 mb-16 reveal">
          <span className="font-mono text-xs tracking-widest text-cyan-400 uppercase">Next Departures</span>
          <span className="w-10 h-px bg-cyan-400" />
        </div>
        <div className="space-y-px bg-cyan-500/10">
          {upcoming?.map((f: any, i: number) => (
            <div key={f.id} className="reveal bg-[#060c14] hover:bg-[#0a1420] transition-colors px-8 py-6 flex items-center justify-between group" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="flex items-center gap-10">
                <span className="font-mono text-xs text-zinc-600 w-16">{f.flightNumber}</span>
                <div>
                  <div className="text-xl font-bold tracking-tight">{f.origin.name} → {f.destination.name}</div>
                  <div className="text-xs text-zinc-500 mt-1">{f.rocket.name} · {f.destination.travelDays}d transit</div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="text-xs text-zinc-500 font-mono">From</div>
                  <div className="text-cyan-400 font-mono font-bold">${f.economyPrice.toLocaleString()}</div>
                </div>
                <span className={`font-mono text-xs tracking-widest px-3 py-1 border uppercase ${f.status === "boarding" ? "text-green-400 border-green-400/30" : "text-cyan-400 border-cyan-400/20"}`}>
                  {f.status}
                </span>
                <Link to="/schedule" className="font-mono text-xs tracking-widest uppercase text-zinc-600 group-hover:text-cyan-400 transition-colors opacity-0 group-hover:opacity-100">Book →</Link>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 reveal">
          <Link to="/schedule" className="font-mono text-xs tracking-widest uppercase text-zinc-500 hover:text-cyan-400 transition-colors">View all flights →</Link>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="relative z-10 px-16 py-16">
        <div className="flex items-center gap-5 mb-16 reveal">
          <span className="font-mono text-xs tracking-widest text-cyan-400 uppercase">Destinations</span>
          <span className="w-10 h-px bg-cyan-400" />
        </div>
        <div className="grid grid-cols-4 gap-px bg-cyan-500/10">
          {destinations?.slice(1).map((d: any, i: number) => (
            <div key={d.id} className="reveal bg-[#060c14] overflow-hidden group" style={{ transitionDelay: `${i * 60}ms` }}>
              <div className="h-48 overflow-hidden">
                <img src={d.imageUrl} alt={d.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" />
              </div>
              <div className="p-6">
                <div className="font-mono text-xs text-zinc-600 uppercase mb-2">{d.body}</div>
                <div className="font-bold text-lg tracking-tight">{d.name}</div>
                <div className="text-xs text-zinc-500 mt-2">{d.travelDays}d · {d.distanceAu} AU</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="relative z-10 px-16 py-16">
        <div className="flex items-center gap-5 mb-16 reveal">
          <span className="font-mono text-xs tracking-widest text-cyan-400 uppercase">From the Mission Log</span>
          <span className="w-10 h-px bg-cyan-400" />
        </div>
        <div className="grid grid-cols-3 gap-px bg-cyan-500/10">
          {gallery?.map((g: any, i: number) => (
            <div key={g.id} className="reveal relative overflow-hidden group aspect-video" style={{ transitionDelay: `${i * 50}ms` }}>
              <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <div className="text-sm font-bold">{g.title}</div>
                <div className="font-mono text-xs text-zinc-500">{g.credit}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="relative z-10 px-16 py-32 max-w-4xl reveal">
        <p className="text-[clamp(28px,4vw,52px)] font-light leading-snug tracking-tight">
          Humanity was never meant to stay in one place. We are not building rockets.{" "}
          <span className="text-cyan-400 font-bold">We are building the next address</span>{" "}
          for the human species.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 px-16 py-16 border-t border-cyan-500/10 flex justify-between items-end">
        <div className="font-mono text-6xl font-bold text-zinc-800">ÆTHER</div>
        <div className="font-mono text-xs text-zinc-600">© 2026 Aether Space Industries</div>
        <div className="flex flex-col gap-2 items-end font-mono text-xs text-zinc-500">
          {["Careers", "Press", "Investors", "Contact"].map(l => (
            <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}