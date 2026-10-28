/** The small editorial running head that opens each section: “(02) — Services”. */
export function SectionLabel({
  index,
  children,
  className = "",
}: {
  index: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`label flex items-center gap-3 ${className}`}>
      <span>({index})</span>
      <span aria-hidden="true" className="h-px w-10 bg-current opacity-60" />
      <span>{children}</span>
    </p>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`inline-block size-[1em] ${className}`} fill="none">
      <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}
