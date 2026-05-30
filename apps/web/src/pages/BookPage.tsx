import { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
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
    <div className="bg-[#020408] text-white min-h-screen flex items-center justify-center font-mono text-xs text-zinc-600 tracking-widest">
      LOADING...
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
    <div className="bg-[#020408] text-white min-h-screen flex items-center justify-center">
      <StarCanvas />
      <div className="relative z-10 text-center max-w-md">
        <div className="text-cyan-400 text-5xl mb-8">✓</div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Booking Confirmed</h1>
        <p className="text-zinc-500 text-sm mb-2">{flight.flightNumber} · {flight.origin.name} → {flight.destination.name}</p>
        <p className="font-mono text-xs text-zinc-600 mb-10">{cabin.toUpperCase()} · {passengers} passenger{passengers > 1 ? "s" : ""} · ${total.toLocaleString()}</p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate("/dashboard")} className="font-mono text-xs tracking-widest uppercase px-8 py-4 bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors">
            My Bookings
          </button>
          <button onClick={() => navigate("/schedule")} className="font-mono text-xs tracking-widest uppercase px-8 py-4 border border-zinc-800 text-zinc-400 hover:text-white transition-colors">
            Back to Schedule
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#020408] text-white min-h-screen">
      <StarCanvas />
      <Nav />
      <div className="relative z-10 pt-40 px-16 pb-32 max-w-2xl">
        <div className="font-mono text-xs text-cyan-400 tracking-widest uppercase mb-4">Book Flight</div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">{flight.origin.name}</h1>
        <div className="text-zinc-500 mb-1">→ {flight.destination.name}</div>
        <div className="font-mono text-xs text-zinc-600 mb-12">{flight.flightNumber} · {flight.rocket.name}</div>

        {/* CABIN */}
        <div className="mb-8">
          <div className="font-mono text-xs text-zinc-600 uppercase tracking-widest mb-3">Cabin Class</div>
          <div className="flex gap-px">
            {(["economy", "business", "orbital"] as const).map(c => (
              <button key={c} onClick={() => setCabin(c)}
                className={`flex-1 py-4 font-mono text-xs tracking-widest uppercase transition-colors ${cabin === c ? "bg-cyan-500 text-black font-bold" : "bg-[#060c14] text-zinc-500 hover:text-white border border-zinc-800"}`}>
                <div>{c}</div>
                <div className="mt-1 text-[10px]">
                  ${(c === "economy" ? flight.economyPrice : c === "business" ? flight.businessPrice : flight.orbitalPrice).toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* PASSENGERS */}
        <div className="mb-12">
          <div className="font-mono text-xs text-zinc-600 uppercase tracking-widest mb-3">Passengers</div>
          <div className="flex items-center gap-4">
            <button onClick={() => setPassengers(p => Math.max(1, p - 1))}
              className="w-10 h-10 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors font-mono text-lg">−</button>
            <span className="font-mono text-2xl w-8 text-center">{passengers}</span>
            <button onClick={() => setPassengers(p => Math.min(seatsLeft, p + 1))}
              className="w-10 h-10 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors font-mono text-lg">+</button>
            <span className="font-mono text-xs text-zinc-600 ml-2">{seatsLeft} seats available</span>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="border border-zinc-800 p-6 mb-8 space-y-3">
          {[
            ["Flight", `${flight.flightNumber} · ${new Date(flight.departureAt).toLocaleDateString()}`],
            ["Route", `${flight.origin.name} → ${flight.destination.name}`],
            ["Transit", `${flight.destination.travelDays} days`],
            ["Cabin", cabin.toUpperCase()],
            ["Passengers", passengers],
          ].map(([label, value]) => (
            <div key={label as string} className="flex justify-between font-mono text-xs">
              <span className="text-zinc-600 uppercase tracking-widest">{label}</span>
              <span className="text-zinc-300">{value}</span>
            </div>
          ))}
          <div className="flex justify-between font-mono pt-4 border-t border-zinc-800">
            <span className="text-zinc-600 uppercase tracking-widest text-xs">Total</span>
            <span className="text-cyan-400 text-xl font-bold">${total.toLocaleString()}</span>
          </div>
        </div>

        <button onClick={handleConfirm} disabled={createBooking.isPending}
          className="w-full font-mono text-xs tracking-widest uppercase py-5 bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors disabled:opacity-50">
          {createBooking.isPending ? "Processing..." : "Confirm Booking →"}
        </button>
        {createBooking.error && <p className="text-red-400 font-mono text-xs mt-4">Booking failed. Please try again.</p>}
      </div>
    </div>
  );
}