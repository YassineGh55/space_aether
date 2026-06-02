export default function SectionHeader({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`flex items-center gap-5 mb-12 md:mb-16 reveal ${className}`}>
      <span className="section-label">{label}</span>
      <span className="h-px w-12 bg-gradient-to-r from-cyan-400 to-transparent" />
    </div>
  );
}
