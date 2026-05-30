import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import StarCanvas from "../components/StarCanvas";
import { useMe, useLogout } from "../hooks/useAuth";
import { useBookings, useCancelBooking } from "../hooks/useFlights";

export default function DashboardPage() {
  const { data: user } = useMe();
  const { data: bookings, isLoading } = useBookings();
  const cancelBooking = useCancelBooking();
  const logout = useLogout();
  const navigate = useNavigate();

  return (
    <div className="bg-[#020408] text-white min-h-screen">
      <StarCanvas />
      <Nav />
      <div className="relative z-10 pt-40 px-16 pb-32">
        <div className="font-mono text-xs text-cyan-400 tracking-widest uppercase mb-4">Crew Portal</div>
        <h1 className="text-5xl font-bold tracking-tight mb-2">Welcome, {user?.name}</h1>
        <p className="text-zinc-500 text-sm mb-16">{user?.email}</p>

        <div className="flex items-center gap-5 mb-8">
          <span className="font-mono text-xs tracking-widest text-cyan-400 uppercase">My Bookings</span>
          <span className="w-10 h-px bg-cyan-400" />
        </div>

        {isLoading && <div className="font-mono text-xs text-zinc-600 tracking-widest">LOADING MANIFEST...</div>}

        {!isLoading && bookings?.length === 0 && (
          <div className="border border-zinc-900 p-12 text-center">
            <p className="text-zinc-600 font-mono text-xs tracking-widest mb-6">NO BOOKINGS FOUND</p>
            <button onClick={() => navigate("/schedule")}
              className="font-mono text-xs tracking-widest uppercase px-8 py-4 bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors">
              Browse Schedule
            </button>
          </div>
        )}

        <div className="space-y-px bg-cyan-500/5">
          {bookings?.map((b: any) => (
            <div key={b.id} className="bg-[#060c14] px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-10">
                <span className="font-mono text-xs text-zinc-600 w-16">{b.flight.flightNumber}</span>
                <div>
                  <div className="font-bold text-lg tracking-tight">{b.flight.origin.name} → {b.flight.destination.name}</div>
                  <div className="text-xs text-zinc-500 mt-1">
                    {b.cabinClass.toUpperCase()} · {b.passengers} passenger{b.passengers > 1 ? "s" : ""} · {new Date(b.flight.departureAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="font-mono text-sm font-bold text-cyan-400">${b.totalPrice.toLocaleString()}</div>
                  <div className={`font-mono text-xs mt-1 ${b.status === "confirmed" ? "text-green-400" : "text-red-400"}`}>{b.status.toUpperCase()}</div>
                </div>
                {b.status === "confirmed" && (
                  <button onClick={() => cancelBooking.mutate(b.id)}
                    className="font-mono text-xs tracking-widest uppercase px-4 py-2 border border-zinc-800 text-zinc-600 hover:border-red-400/30 hover:text-red-400 transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-900">
          <button onClick={async () => { await logout.mutateAsync(); navigate("/"); }}
            className="font-mono text-xs tracking-widest uppercase text-zinc-600 hover:text-white transition-colors">
            Sign Out →
          </button>
        </div>
      </div>
    </div>
  );
}