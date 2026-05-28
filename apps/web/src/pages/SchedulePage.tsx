import Nav from "../components/Nav";
import StarCanvas from "../components/StarCanvas";

export default function SchedulePage() {
  return (
    <div className="bg-[#020408] text-white min-h-screen">
      <StarCanvas />
      <Nav />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <p className="font-mono text-zinc-600 tracking-widest">SCHEDULE — COMING NEXT</p>
      </div>
    </div>
  );
}