import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import FooterNote from "../components/FooterNote";
import SectionHeader from "../components/SectionHeader";
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
    <div className="bg-aether-bg text-white min-h-screen">
      <StarCanvas />
      <Nav />
      <div className="relative z-10 pt-28 md:pt-40 page-padding pb-16 md:pb-24">
        <div className="section-label mb-4">Crew Portal</div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Welcome, {user?.name}</h1>
        <p className="text-zinc-500 text-sm mb-12 md:mb-16">{user?.email}</p>

        <SectionHeader label="My Bookings" className="!mb-8" />

        {isLoading && <div className="font-mono text-xs text-zinc-600 tracking-widest animate-pulse">LOADING MANIFEST...</div>}

        {!isLoading && bookings?.length === 0 && (
          <div className="glass-card p-10 md:p-12 text-center">
            <p className="text-zinc-500 font-mono text-xs tracking-widest mb-6">NO BOOKINGS FOUND</p>
            <button onClick={() => navigate("/schedule")} className="btn-primary">
              Browse Schedule
            </button>
          </div>
        )}

        <div className="space-y-3 md:space-y-px md:bg-cyan-500/5 md:rounded-sm md:overflow-hidden">
          {bookings?.map((b: any) => (
            <div key={b.id} className="panel-row glass-card md:glass-none md:rounded-none px-5 md:px-8 py-5 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-10">
                <span className="font-mono text-xs text-cyan-500/70">{b.flight.flightNumber}</span>
                <div>
                  <div className="font-bold text-lg tracking-tight">{b.flight.origin.name} → {b.flight.destination.name}</div>
                  <div className="text-xs text-zinc-500 mt-1">
                    {b.cabinClass.toUpperCase()} · {b.passengers} passenger{b.passengers > 1 ? "s" : ""} · {new Date(b.flight.departureAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8">
                <div className="text-left md:text-right">
                  <div className="font-mono text-sm font-bold text-cyan-400">${b.totalPrice.toLocaleString()}</div>
                  <div className={`font-mono text-xs mt-1 ${b.status === "confirmed" ? "text-green-400" : "text-red-400"}`}>{b.status.toUpperCase()}</div>
                </div>
                {b.status === "confirmed" && (
                  <button onClick={() => cancelBooking.mutate(b.id)}
                    className="font-mono text-xs tracking-widest uppercase px-4 py-2 border border-zinc-800 text-zinc-500 hover:border-red-400/30 hover:text-red-400 transition-colors shrink-0">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-900">
          <button onClick={async () => { await logout.mutateAsync(); navigate("/"); }}
            className="font-mono text-xs tracking-widest uppercase text-zinc-600 hover:text-cyan-400 transition-colors">
            Sign Out →
          </button>
        </div>

        <div className="mt-12">
          <FooterNote />
        </div>
      </div>
    </div>
  );
}
