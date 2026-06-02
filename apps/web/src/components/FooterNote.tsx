export default function FooterNote() {
  return (
    <p className="font-mono text-[10px] sm:text-xs text-zinc-600 tracking-widest text-center px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      Made by <span className="text-zinc-500 hover:text-cyan-400/80 transition-colors">Yassine Gharbi</span>
    </p>
  );
}
