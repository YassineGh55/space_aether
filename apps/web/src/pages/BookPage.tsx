import { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import FooterNote from "../components/FooterNote";
import StarCanvas from "../components/StarCanvas";
import { useFlight, useCreateBooking } from "../hooks/useFlights";

export default function BookPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [cabin, setCabin] = useState<"economy" | "business" | "orbital">(
    (searchParams.get("cabin") as any) || "economy"
  );
  const [passengers, setPassengers] = useState(1);
  const [done, setDone] = useState(false);

  const { data: flight, isLoading } = useFlight(id!);
  const createBooking = useCreateBooking();

  if (isLoading) return (
    <div className="bg-aether-bg text-white min-h-screen flex items-center justify-center">
      <StarCanvas />
      <div className="relative z-10 font-mono text-xs text-zinc-600 tracking-widest animate-pulse">LOADING...</div>
    </div>
  );

  if (!flight) return null;

  const pricePerSeat = cabin === "economy" ? flight.economyPrice : cabin === "business" ? flight.businessPrice : flight.orbitalPrice;
  const total = pricePerSeat * passengers;
  const seatsLeft = flight.seatsTotal - flight.seatsBooked;

  async function handleConfirm() {
    await createBooking.mutateAsync({ flightId: flight.id, cabinClass: cabin, passengers });
    setDone(true);
  }

  if (done) return (
    <div className="bg-aether-bg text-white min-h-screen flex items-center justify-center page-padding">
      <StarCanvas />
      <div className="relative z-10 text-center max-w-md glass-card p-10 animate-fade-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 text-2xl mb-8">✓</div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Booking Confirmed</h1>
        <p className="text-zinc-500 text-sm mb-2">{flight.flightNumber} · {flight.origin.name} → {flight.destination.name}</p>
        <p className="font-mono text-xs text-zinc-600 mb-10">{cabin.toUpperCase()} · {passengers} passenger{passengers > 1 ? "s" : ""} · ${total.toLocaleString()}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate("/dashboard")} className="btn-primary">My Bookings</button>
          <button onClick={() => navigate("/schedule")} className="btn-secondary">Back to Schedule</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-aether-bg text-white min-h-screen">
      <StarCanvas />
      <Nav />
      <div className="relative z-10 pt-28 md:pt-40 page-padding pb-16 md:pb-24 max-w-2xl">
        <div className="section-label mb-4">Book Flight</div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{flight.origin.name}</h1>
        <div className="text-zinc-500 mb-1">→ {flight.destination.name}</div>
        <div className="font-mono text-xs text-zinc-600 mb-10 md:mb-12">{flight.flightNumber} · {flight.rocket.name}</div>

        <div className="mb-8">
          <div className="section-label mb-3 text-zinc-500">Cabin Class</div>
          <div className="grid grid-cols-3 gap-px rounded-sm overflow-hidden border border-zinc-800">
            {(["economy", "business", "orbital"] as const).map(c => (
              <button key={c} onClick={() => setCabin(c)}
                className={`py-4 font-mono text-xs tracking-widest uppercase transition-colors ${cabin === c ? "bg-cyan-500 text-black font-bold" : "bg-aether-panel text-zinc-500 hover:text-white hover:bg-aether-panel-hover"}`}>
                <div>{c}</div>
                <div className="mt-1 text-[10px] opacity-80">
                  ${(c === "economy" ? flight.economyPrice : c === "business" ? flight.businessPrice : flight.orbitalPrice).toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-10 md:mb-12">
          <div className="section-label mb-3 text-zinc-500">Passengers</div>
          <div className="flex items-center gap-4">
            <button onClick={() => setPassengers(p => Math.max(1, p - 1))}
              className="w-11 h-11 border border-zinc-800 text-zinc-400 hover:text-white hover:border-cyan-500/40 transition-colors font-mono text-lg rounded-sm">−</button>
            <span className="font-mono text-2xl w-8 text-center">{passengers}</span>
            <button onClick={() => setPassengers(p => Math.min(seatsLeft, p + 1))}
              className="w-11 h-11 border border-zinc-800 text-zinc-400 hover:text-white hover:border-cyan-500/40 transition-colors font-mono text-lg rounded-sm">+</button>
            <span className="font-mono text-xs text-zinc-600 ml-2">{seatsLeft} seats available</span>
          </div>
        </div>

        <div className="glass-card p-6 mb-8 space-y-3">
          {[
            ["Flight", `${flight.flightNumber} · ${new Date(flight.departureAt).toLocaleDateString()}`],
            ["Route", `${flight.origin.name} → ${flight.destination.name}`],
            ["Transit", `${flight.destination.travelDays} days`],
            ["Cabin", cabin.toUpperCase()],
            ["Passengers", passengers],
          ].map(([label, value]) => (
            <div key={label as string} className="flex justify-between font-mono text-xs gap-4">
              <span className="text-zinc-600 uppercase tracking-widest shrink-0">{label}</span>
              <span className="text-zinc-300 text-right">{value}</span>
            </div>
          ))}
          <div className="flex justify-between font-mono pt-4 border-t border-zinc-800">
            <span className="text-zinc-600 uppercase tracking-widest text-xs">Total</span>
            <span className="text-cyan-400 text-xl font-bold">${total.toLocaleString()}</span>
          </div>
        </div>

        <button onClick={handleConfirm} disabled={createBooking.isPending}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
          {createBooking.isPending ? "Processing..." : "Confirm Booking →"}
        </button>
        {createBooking.error && <p className="text-red-400 font-mono text-xs mt-4">Booking failed. Please try again.</p>}

        <div className="mt-12">
          <FooterNote />
        </div>
      </div>
    </div>
  );
}
