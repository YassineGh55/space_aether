import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import FooterNote from "../components/FooterNote";
import ScheduleBookingModal from "../components/ScheduleBookingModal";
import StarCanvas from "../components/StarCanvas";
import { useFlights } from "../hooks/useFlights";
import { useMe } from "../hooks/useAuth";
import { useReveal } from "../hooks/useReveal";

const STATUS_STYLES: Record<string, string> = {
  scheduled: "text-cyan-400 border-cyan-400/20",
  boarding:  "text-green-400 border-green-400/30",
  departed:  "text-zinc-500 border-zinc-700",
  arrived:   "text-zinc-600 border-zinc-800",
  cancelled: "text-red-400 border-red-400/20",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function SchedulePage() {
  const { data: flights, isLoading } = useFlights();
  const { data: user } = useMe();
  const navigate = useNavigate();

  const [origin, setOrigin]   = useState("all");
  const [dest, setDest]       = useState("all");
  const [cabin, setCabin]     = useState<"economy"|"business"|"orbital">("economy");
  const [selected, setSelected] = useState<any>(null);

  const origins = [...new Set(flights?.map((f: any) => f.origin.name))];
  const dests   = [...new Set(flights?.map((f: any) => f.destination.name))];

  const filtered = flights?.filter((f: any) => {
    if (origin !== "all" && f.origin.name !== origin) return false;
    if (dest   !== "all" && f.destination.name !== dest) return false;
    return true;
  });

  useReveal([flights, isLoading, origin, dest, cabin]);

  function handleBook(f: any) {
    if (!user) { navigate("/login"); return; }
    setSelected(f);
  }

  return (
    <div className="bg-[#020408] text-white min-h-screen">
      <StarCanvas />
      <Nav />

      <div className="relative z-10 pt-40 px-16 pb-32">
        <div className="flex items-center gap-5 mb-4 reveal">
          <span className="font-mono text-xs tracking-widest text-cyan-400 uppercase">Departure Board</span>
          <span className="w-10 h-px bg-gradient-to-r from-cyan-400 to-transparent" />
        </div>
        <h1 className="text-6xl font-bold tracking-tight mb-16 reveal" style={{ transitionDelay: "80ms" }}>
          Flight Schedule
        </h1>

        <div className="flex gap-4 mb-8 flex-wrap reveal" style={{ transitionDelay: "140ms" }}>
          <select value={origin} onChange={e => setOrigin(e.target.value)}
            className="bg-[#060c14] border border-zinc-800 text-zinc-300 font-mono text-xs tracking-widest px-4 py-3 uppercase focus:outline-none focus:border-cyan-500 transition-colors">
            <option value="all">All Origins</option>
            {origins.map((o: any) => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={dest} onChange={e => setDest(e.target.value)}
            className="bg-[#060c14] border border-zinc-800 text-zinc-300 font-mono text-xs tracking-widest px-4 py-3 uppercase focus:outline-none focus:border-cyan-500 transition-colors">
            <option value="all">All Destinations</option>
            {dests.map((d: any) => <option key={d} value={d}>{d}</option>)}
          </select>
          <div className="flex border border-zinc-800">
            {(["economy","business","orbital"] as const).map(c => (
              <button key={c} onClick={() => setCabin(c)}
                className={`font-mono text-xs tracking-widest uppercase px-5 py-3 transition-colors ${cabin === c ? "bg-cyan-500 text-black" : "text-zinc-500 hover:text-white"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-px bg-cyan-500/10 rounded-sm overflow-hidden reveal" style={{ transitionDelay: "200ms" }}>
          <div className="grid grid-cols-[120px_1fr_1fr_140px_120px_100px_120px] gap-4 px-6 py-3 bg-[#060c14] font-mono text-xs text-zinc-600 uppercase tracking-widest">
            <span>Flight</span>
            <span>Origin</span>
            <span>Destination</span>
            <span>Departure</span>
            <span>Transit</span>
            <span>Status</span>
            <span className="text-right">Price</span>
          </div>

          {isLoading && (
            <div className="py-20 text-center font-mono text-xs text-zinc-600 tracking-widest bg-[#060c14]">LOADING MANIFEST...</div>
          )}
          {filtered?.map((f: any, i: number) => {
            const seatsLeft = f.seatsTotal - f.seatsBooked;
            const rowPrice = cabin === "economy" ? f.economyPrice : cabin === "business" ? f.businessPrice : f.orbitalPrice;
            const isFull = seatsLeft <= 0;
            return (
              <div key={f.id}
                onClick={() => !isFull && handleBook(f)}
                className={`reveal grid grid-cols-[120px_1fr_1fr_140px_120px_100px_120px] gap-4 px-6 py-5 bg-[#060c14] items-center transition-all duration-500 ${isFull ? "opacity-40 cursor-not-allowed" : "hover:bg-[#0a1420] cursor-pointer group hover:shadow-[inset_3px_0_0_rgba(34,211,238,0.5)]"}`}
                style={{ transitionDelay: `${240 + i * 60}ms` }}>
                <span className="font-mono text-xs text-zinc-500 group-hover:text-cyan-400/80 transition-colors">{f.flightNumber}</span>
                <div>
                  <div className="font-bold text-sm">{f.origin.name}</div>
                  <div className="text-xs text-zinc-600">{f.origin.body}</div>
                </div>
                <div>
                  <div className="font-bold text-sm">{f.destination.name}</div>
                  <div className="text-xs text-zinc-600">{f.destination.body}</div>
                </div>
                <div>
                  <div className="text-sm">{formatDate(f.departureAt)}</div>
                  <div className="font-mono text-xs text-zinc-500">{formatTime(f.departureAt)}</div>
                </div>
                <span className="font-mono text-xs text-zinc-500">{f.destination.travelDays}d</span>
                <span className={`font-mono text-xs tracking-widest px-2 py-1 border uppercase w-fit ${STATUS_STYLES[f.status]}`}>
                  {f.status}
                </span>
                <div className="text-right">
                  <div className="font-mono text-sm font-bold text-cyan-400">${rowPrice.toLocaleString()}</div>
                  <div className="font-mono text-xs text-zinc-600">{seatsLeft} seats</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 px-16 pb-12 reveal" style={{ transitionDelay: "400ms" }}>
        <FooterNote />
      </div>

      {selected && (
        <ScheduleBookingModal
          flight={selected}
          cabin={cabin}
          onCabin={setCabin}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
