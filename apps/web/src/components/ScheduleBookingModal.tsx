import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

type Flight = {
  id: string;
  flightNumber: string;
  departureAt: string;
  origin: { name: string; body: string };
  destination: { name: string; body: string; travelDays: number };
  rocket: { name: string };
  economyPrice: number;
  businessPrice: number;
  orbitalPrice: number;
};

type Props = {
  flight: Flight;
  cabin: "economy" | "business" | "orbital";
  onCabin: (c: "economy" | "business" | "orbital") => void;
  onClose: () => void;
};

function useCountdown(iso: string) {
  const [label, setLabel] = useState("—");
  useEffect(() => {
    function tick() {
      const diff = new Date(iso).getTime() - Date.now();
      if (diff <= 0) { setLabel("DEPARTING"); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setLabel(d > 0 ? `T-${d}d ${h}h ${m}m` : `T-${h}h ${m}m`);
    }
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [iso]);
  return label;
}

const CABIN_META = {
  economy:  { label: "Economy",  tag: "Standard transit", accent: "from-zinc-500/20 to-zinc-800/10" },
  business: { label: "Business", tag: "Enhanced comfort", accent: "from-cyan-500/20 to-cyan-900/10" },
  orbital:  { label: "Orbital",  tag: "Full hab-suite",   accent: "from-violet-500/20 to-violet-900/10" },
};

export default function ScheduleBookingModal({ flight, cabin, onCabin, onClose }: Props) {
  const countdown = useCountdown(flight.departureAt);
  const price = cabin === "economy" ? flight.economyPrice : cabin === "business" ? flight.businessPrice : flight.orbitalPrice;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[linear-gradient(rgba(34,211,238,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.5)_1px,transparent_1px)] bg-size-[48px_48px]" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-cyan-400/30 animate-[pulse-glow_2s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-950/30 to-transparent" />
      </div>

      <div
        className="relative w-full max-w-2xl border border-cyan-500/20 bg-[#040810]/95 shadow-[0_0_80px_rgba(34,211,238,0.12),inset_0_1px_0_rgba(255,255,255,0.04)] animate-fade-up overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* scanlines */}
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.12)_2px,rgba(0,0,0,0.12)_4px)] opacity-40" />

        <div className="relative border-b border-cyan-500/15 px-6 md:px-10 py-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] tracking-[0.35em] text-cyan-400 uppercase">Mission Clearance</div>
            <div className="font-mono text-xs text-zinc-600 mt-1">{flight.flightNumber} · {flight.rocket.name}</div>
          </div>
          <div className="font-mono text-sm tracking-widest text-cyan-300 border border-cyan-500/30 px-4 py-2 bg-cyan-500/5">
            {countdown}
          </div>
        </div>

        {/* route viz */}
        <div className="relative px-6 md:px-10 py-8 border-b border-zinc-800/80">
          <svg viewBox="0 0 400 80" className="w-full h-16 mb-6 text-cyan-400/60" aria-hidden="true">
            <defs>
              <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path d="M 20 40 Q 200 4 380 40" fill="none" stroke="url(#routeGrad)" strokeWidth="1.5" strokeDasharray="6 4" />
            <circle cx="20" cy="40" r="5" fill="#020408" stroke="#22d3ee" strokeWidth="1.5" />
            <circle cx="380" cy="40" r="5" fill="#020408" stroke="#22d3ee" strokeWidth="1.5" />
            <circle cx="200" cy="12" r="3" fill="#22d3ee" className="animate-[float_3s_ease-in-out_infinite]" />
          </svg>
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">Origin</div>
              <div className="text-xl md:text-2xl font-bold tracking-tight mt-1">{flight.origin.name}</div>
              <div className="text-xs text-zinc-500 mt-1">{flight.origin.body}</div>
            </div>
            <div className="font-mono text-xs text-zinc-600 pt-6 hidden sm:block">{flight.destination.travelDays}d transit</div>
            <div className="text-right">
              <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">Destination</div>
              <div className="text-xl md:text-2xl font-bold tracking-tight mt-1">{flight.destination.name}</div>
              <div className="text-xs text-zinc-500 mt-1">{flight.destination.body}</div>
            </div>
          </div>
          <div className="font-mono text-xs text-zinc-600 mt-4">
            Departure · {new Date(flight.departureAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
            {" · "}
            {new Date(flight.departureAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>

        <div className="relative px-6 md:px-10 py-8">
          <div className="font-mono text-xs text-zinc-600 uppercase tracking-widest mb-4">Select cabin tier</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {(["economy", "business", "orbital"] as const).map(c => {
              const meta = CABIN_META[c];
              const tierPrice = c === "economy" ? flight.economyPrice : c === "business" ? flight.businessPrice : flight.orbitalPrice;
              const active = cabin === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => onCabin(c)}
                  className={`relative text-left p-4 border transition-all duration-300 overflow-hidden ${active ? "border-cyan-400/60 shadow-[0_0_24px_rgba(34,211,238,0.15)]" : "border-zinc-800 hover:border-zinc-600"}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${meta.accent} opacity-80`} />
                  <div className="relative">
                    <div className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">{meta.tag}</div>
                    <div className={`font-bold mt-1 ${active ? "text-cyan-300" : "text-white"}`}>{meta.label}</div>
                    <div className="font-mono text-sm font-bold text-cyan-400 mt-2">${tierPrice.toLocaleString()}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-end justify-between border-t border-zinc-800 pt-6 mb-8">
            <div>
              <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">Manifest total</div>
              <div className="text-xs text-zinc-500 mt-1">All fees included · Refundable until T-24h</div>
            </div>
            <div className="font-mono text-3xl font-bold text-cyan-400">${price.toLocaleString()}</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 font-mono text-xs tracking-widest uppercase py-4 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600 transition-colors"
            >
              Abort
            </button>
            <Link
              to={`/book/${flight.id}?cabin=${cabin}`}
              className="flex-1 font-mono text-xs tracking-widest uppercase py-4 bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors text-center shadow-[0_0_32px_rgba(34,211,238,0.25)]"
            >
              Authorize Launch →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
