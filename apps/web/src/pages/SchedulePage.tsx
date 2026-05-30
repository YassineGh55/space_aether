import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import StarCanvas from "../components/StarCanvas";
import { useFlights } from "../hooks/useFlights";
import { useMe } from "../hooks/useAuth";

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

  function handleBook(f: any) {
    if (!user) { navigate("/login"); return; }
    setSelected(f);
  }

  const price = selected
    ? cabin === "economy" ? selected.economyPrice
    : cabin === "business" ? selected.businessPrice
    : selected.orbitalPrice
    : 0;

  return (
    <div className="bg-[#020408] text-white min-h-screen">
      <StarCanvas />
      <Nav />

      <div className="relative z-10 pt-40 px-16 pb-32">
        {/* HEADER */}
        <div className="flex items-center gap-5 mb-4">
          <span className="font-mono text-xs tracking-widest text-cyan-400 uppercase">Departure Board</span>
          <span className="w-10 h-px bg-cyan-400" />
        </div>
        <h1 className="text-6xl font-bold tracking-tight mb-16">Flight Schedule</h1>

        {/* FILTERS */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <select value={origin} onChange={e => setOrigin(e.target.value)}
            className="bg-[#060c14] border border-zinc-800 text-zinc-300 font-mono text-xs tracking-widest px-4 py-3 uppercase focus:outline-none focus:border-cyan-500">
            <option value="all">All Origins</option>
            {origins.map((o: any) => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={dest} onChange={e => setDest(e.target.value)}
            className="bg-[#060c14] border border-zinc-800 text-zinc-300 font-mono text-xs tracking-widest px-4 py-3 uppercase focus:outline-none focus:border-cyan-500">
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

        {/* TABLE HEADER */}
        <div className="grid grid-cols-[120px_1fr_1fr_140px_120px_100px_120px] gap-4 px-6 py-3 border-b border-zinc-800 font-mono text-xs text-zinc-600 uppercase tracking-widest">
          <span>Flight</span>
          <span>Origin</span>
          <span>Destination</span>
          <span>Departure</span>
          <span>Transit</span>
          <span>Status</span>
          <span className="text-right">Price</span>
        </div>

        {/* ROWS */}
        {isLoading && (
          <div className="py-20 text-center font-mono text-xs text-zinc-600 tracking-widest">LOADING MANIFEST...</div>
        )}
        {filtered?.map((f: any) => {
          const seatsLeft = f.seatsTotal - f.seatsBooked;
          const rowPrice = cabin === "economy" ? f.economyPrice : cabin === "business" ? f.businessPrice : f.orbitalPrice;
          const isFull = seatsLeft <= 0;
          return (
            <div key={f.id}
              onClick={() => !isFull && handleBook(f)}
              className={`grid grid-cols-[120px_1fr_1fr_140px_120px_100px_120px] gap-4 px-6 py-5 border-b border-zinc-900 items-center transition-colors ${isFull ? "opacity-40 cursor-not-allowed" : "hover:bg-[#060c14] cursor-pointer group"}`}>
              <span className="font-mono text-xs text-zinc-500">{f.flightNumber}</span>
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

      {/* BOOKING MODAL */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-8" onClick={() => setSelected(null)}>
          <div className="bg-[#060c14] border border-zinc-800 p-10 max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="font-mono text-xs text-cyan-400 tracking-widest uppercase mb-6">Confirm Booking</div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">{selected.origin.name}</h2>
            <div className="text-zinc-500 mb-1">→ {selected.destination.name}</div>
            <div className="font-mono text-xs text-zinc-600 mb-8">{selected.flightNumber} · {selected.rocket.name} · {formatDate(selected.departureAt)}</div>

            <div className="space-y-4 mb-8">
              <div>
                <div className="font-mono text-xs text-zinc-600 uppercase tracking-widest mb-2">Cabin Class</div>
                <div className="flex gap-px">
                  {(["economy","business","orbital"] as const).map(c => (
                    <button key={c} onClick={() => setCabin(c)}
                      className={`flex-1 font-mono text-xs tracking-widest uppercase py-3 transition-colors ${cabin === c ? "bg-cyan-500 text-black" : "bg-zinc-900 text-zinc-500 hover:text-white"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Total</span>
                <span className="font-mono text-2xl font-bold text-cyan-400">${price.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setSelected(null)}
                className="flex-1 font-mono text-xs tracking-widest uppercase py-4 border border-zinc-800 text-zinc-500 hover:text-white transition-colors">
                Cancel
              </button>
              <Link to={`/book/${selected.id}?cabin=${cabin}`}
                className="flex-1 font-mono text-xs tracking-widest uppercase py-4 bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors text-center">
                Proceed →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
