import { Link } from "react-router-dom";
import StarCanvas from "../components/StarCanvas";
import Nav from "../components/Nav";
import FooterNote from "../components/FooterNote";
import SectionHeader from "../components/SectionHeader";
import { useFlights, useDestinations, useGallery } from "../hooks/useFlights";
import { useReveal } from "../hooks/useReveal";

export default function LandingPage() {
  const { data: flights } = useFlights();
  const { data: destinations } = useDestinations();
  const { data: gallery } = useGallery();

  const upcoming = flights?.filter((f: any) => f.status === "scheduled" || f.status === "boarding").slice(0, 3);

  useReveal([flights, destinations, gallery]);

  return (
    <div className="bg-aether-bg text-white min-h-screen overflow-x-hidden">
      <StarCanvas />
      <Nav />

      {/* HERO */}
      <section className="relative z-10 min-h-screen flex flex-col justify-end page-padding pb-16 md:pb-24 pt-32">
        <div className="hero-glow -top-20 right-0 md:right-16" />
        <div className="section-label mb-5 animate-fade-up">Est. 2019 — Humanity's Interplanetary Carrier</div>
        <h1 className="text-[clamp(2.75rem,9vw,8.125rem)] font-extrabold leading-[0.92] tracking-tight mb-6 md:mb-8 animate-fade-up-delay">
          <span className="block">Beyond</span>
          <span className="block text-gradient">the last</span>
          <span className="block">horizon.</span>
        </h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-md leading-relaxed mb-8 md:mb-10 animate-fade-up-delay-2">
          The solar system's first interplanetary airline. Book passage to the Moon, Mars, and beyond.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-up-delay-2">
          <Link to="/schedule" className="btn-primary text-center">View Schedule</Link>
          <Link to="/register" className="btn-secondary text-center">Create Account</Link>
        </div>
        <div className="hidden lg:block absolute right-16 bottom-24 font-mono text-xs text-zinc-600 tracking-widest">
          LAT <span className="text-cyan-400">36.8065°N</span> · LONG <span className="text-cyan-400">10.1815°E</span>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="relative z-10 border-y border-cyan-500/10 py-4 overflow-hidden whitespace-nowrap bg-black/20">
        <div className="inline-block animate-marquee font-mono text-xs tracking-widest text-zinc-600 uppercase">
          {[...["LUNAR GATEWAY", "MARS TRANSIT", "HELIOS PROPULSION", "DEEP SPACE RELAY", "ORBITAL HABITAT", "ASTEROID SURVEY", "SOLAR SAIL"], ...["LUNAR GATEWAY", "MARS TRANSIT", "HELIOS PROPULSION", "DEEP SPACE RELAY", "ORBITAL HABITAT", "ASTEROID SURVEY", "SOLAR SAIL"]].map((t, i) => (
            <span key={i}>{t}<span className="text-cyan-400/80 mx-5">◆</span></span>
          ))}
        </div>
      </div>

      {/* UPCOMING FLIGHTS */}
      <section className="relative z-10 page-padding py-20 md:py-32">
        <SectionHeader label="Next Departures" />
        <div className="space-y-px bg-cyan-500/10 rounded-sm overflow-hidden">
          {upcoming?.map((f: any, i: number) => (
            <div
              key={f.id}
              className="panel-row reveal px-4 md:px-8 py-5 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-10">
                <span className="font-mono text-xs text-cyan-500/70">{f.flightNumber}</span>
                <div>
                  <div className="text-lg md:text-xl font-bold tracking-tight">{f.origin.name} → {f.destination.name}</div>
                  <div className="text-xs text-zinc-500 mt-1">{f.rocket.name} · {f.destination.travelDays}d transit</div>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8">
                <div className="text-left md:text-right">
                  <div className="text-xs text-zinc-500 font-mono">From</div>
                  <div className="text-cyan-400 font-mono font-bold">${f.economyPrice.toLocaleString()}</div>
                </div>
                <span className={`status-badge shrink-0 ${f.status === "boarding" ? "text-green-400 border-green-400/30 bg-green-400/5" : "text-cyan-400 border-cyan-400/20 bg-cyan-400/5"}`}>
                  {f.status}
                </span>
                <Link to="/schedule" className="font-mono text-xs tracking-widest uppercase text-zinc-600 group-hover:text-cyan-400 transition-colors hidden md:block">
                  Book →
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 reveal">
          <Link to="/schedule" className="font-mono text-xs tracking-widest uppercase text-zinc-500 hover:text-cyan-400 transition-colors">
            View all flights →
          </Link>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section id="destinations" className="relative z-10 page-padding py-16 md:py-24">
        <SectionHeader label="Destinations" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-px bg-cyan-500/10 rounded-sm overflow-hidden">
          {destinations?.slice(1).map((d: any, i: number) => (
            <div key={d.id} className="reveal bg-aether-panel overflow-hidden group" style={{ transitionDelay: `${i * 60}ms` }}>
              <div className="h-44 md:h-52 overflow-hidden relative">
                <img src={d.imageUrl} alt={d.name} className="w-full h-full object-cover opacity-55 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-aether-panel via-transparent to-transparent" />
              </div>
              <div className="p-5 md:p-6">
                <div className="font-mono text-xs text-cyan-500/60 uppercase mb-2">{d.body}</div>
                <div className="font-bold text-lg tracking-tight group-hover:text-cyan-100 transition-colors">{d.name}</div>
                <div className="text-xs text-zinc-500 mt-2">{d.travelDays}d · {d.distanceAu} AU</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="relative z-10 page-padding py-16 md:py-24">
        <SectionHeader label="From the Mission Log" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-cyan-500/10 rounded-sm overflow-hidden">
          {gallery?.map((g: any, i: number) => (
            <div key={g.id} className="reveal relative overflow-hidden group aspect-video md:aspect-[4/3]" style={{ transitionDelay: `${i * 50}ms` }}>
              <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover opacity-45 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                <div className="text-sm font-bold">{g.title}</div>
                <div className="font-mono text-xs text-zinc-500 mt-1">{g.credit}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="relative z-10 page-padding py-20 md:py-32 max-w-4xl reveal">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-24 bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent hidden md:block" />
        <p className="text-[clamp(1.5rem,4vw,3.25rem)] font-light leading-snug tracking-tight md:pl-8">
          Humanity was never meant to stay in one place. We are not building rockets.{" "}
          <span className="text-gradient font-bold">We are building the next address</span>{" "}
          for the human species.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 page-padding py-12 md:py-16 border-t border-cyan-500/10">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 text-center md:text-left">
          <div className="font-mono text-5xl md:text-6xl font-bold text-zinc-800/80">ÆTHER</div>
          <div className="font-mono text-xs text-zinc-600">© 2026 Aether Space Industries</div>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 font-mono text-xs text-zinc-500">
            {["Careers", "Press", "Investors", "Contact"].map(l => (
              <a key={l} href="#" className="hover:text-cyan-400 transition-colors">{l}</a>
            ))}
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-cyan-500/10">
          <FooterNote />
        </div>
      </footer>
    </div>
  );
}
