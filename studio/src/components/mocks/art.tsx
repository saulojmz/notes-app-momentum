// Flat, poster-like illustrations used in place of photography inside the
// concept screens. Each is drawn to sit on its project's palette.

type ArtProps = { className?: string };

export function CoffeeBag({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 200 260" aria-hidden="true" className={className}>
      <path d="M38 34h124l10 210H28Z" fill="#1D3428" />
      <path d="M38 34h124l-4 18H42Z" fill="#2B4A39" />
      <path d="M44 10h112l6 24H38Z" fill="#14271D" />
      <rect x="62" y="16" width="76" height="6" rx="3" fill="#2B4A39" />
      <rect x="56" y="96" width="88" height="112" fill="#F09A4E" />
      <text x="100" y="166" textAnchor="middle" fontFamily="var(--font-bricolage)" fontWeight="800" fontSize="58" fill="#1D3428" letterSpacing="-3">
        09
      </text>
      <text x="100" y="120" textAnchor="middle" fontFamily="var(--font-dm-mono)" fontSize="9" letterSpacing="2" fill="#1D3428">
        NINEFOLD
      </text>
      <text x="100" y="192" textAnchor="middle" fontFamily="var(--font-dm-mono)" fontSize="7.5" letterSpacing="1.4" fill="#1D3428">
        HOUSE ESPRESSO
      </text>
      <path d="M28 244h144" stroke="#14271D" strokeWidth="4" />
    </svg>
  );
}

export function Bean({ className, color = "#1D3428" }: ArtProps & { color?: string }) {
  return (
    <svg viewBox="0 0 40 56" aria-hidden="true" className={className}>
      <ellipse cx="20" cy="28" rx="18" ry="26" fill={color} />
      <path d="M20 4c-8 10 8 22 0 48" stroke="#EEE7D8" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Loaf({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 320 190" aria-hidden="true" className={className}>
      <ellipse cx="160" cy="176" rx="140" ry="10" fill="#3A1A10" opacity="0.15" />
      <path d="M18 150C10 80 70 22 160 22s152 58 142 128c-2 14-14 24-28 24H46c-14 0-26-10-28-24Z" fill="#B8391C" />
      <path d="M30 140C26 90 78 44 160 44s136 46 130 96" fill="none" stroke="#8E2A12" strokeWidth="5" opacity="0.6" />
      <path d="M82 70c26 30 70 46 150 38" stroke="#FFF4D6" strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M82 70c26 30 70 46 150 38" stroke="#F6D96F" strokeWidth="4" strokeLinecap="round" fill="none" />
      <g fill="#FFF4D6" opacity="0.75">
        <circle cx="70" cy="122" r="3" />
        <circle cx="120" cy="138" r="2.5" />
        <circle cx="210" cy="140" r="3" />
        <circle cx="250" cy="120" r="2" />
        <circle cx="160" cy="150" r="2" />
      </g>
    </svg>
  );
}

export function Croissant({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 160 100" aria-hidden="true" className={className}>
      <path d="M8 70c10-36 40-58 72-58s62 22 72 58c-10 6-22 6-30 0-8-22-24-36-42-36S46 48 38 70c-8 6-20 6-30 0Z" fill="#D9822B" />
      <path d="M58 22c4 14 4 30 0 46M102 22c-4 14-4 30 0 46M80 14v56" stroke="#9C4A12" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Concha({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 220 150" aria-hidden="true" className={className}>
      <path d="M14 112C14 56 58 18 110 18s96 38 96 94Z" fill="#E7A27E" />
      <path d="M22 108C22 64 60 32 110 32s88 32 88 76Z" fill="#F5EADB" />
      <g stroke="#C9542C" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8">
        <path d="M110 34v74" />
        <path d="M110 108 54 48" />
        <path d="M110 108 166 48" />
        <path d="M110 108 30 84" />
        <path d="M110 108l80-24" />
      </g>
      <path d="M8 112h204v10c0 8-6 14-14 14H22c-8 0-14-6-14-14Z" fill="#C9542C" />
    </svg>
  );
}

export function Plate({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 240 240" aria-hidden="true" className={className}>
      <circle cx="120" cy="120" r="112" fill="#F3E7D7" />
      <circle cx="120" cy="120" r="84" fill="none" stroke="#2A1B2C" strokeOpacity="0.1" strokeWidth="2" />
      <path d="M78 136c10-30 46-48 80-36 18 6 22 24 10 36-20 22-70 26-90 0Z" fill="#E8553A" />
      <path d="M92 104c14-12 34-14 46-6" stroke="#5F7A3A" strokeWidth="10" strokeLinecap="round" fill="none" />
      <g fill="#5F7A3A">
        <ellipse cx="150" cy="88" rx="9" ry="5" transform="rotate(-30 150 88)" />
        <ellipse cx="164" cy="98" rx="7" ry="4" transform="rotate(20 164 98)" />
      </g>
      <g fill="#2A1B2C" opacity="0.8">
        <circle cx="104" cy="146" r="2.5" />
        <circle cx="128" cy="150" r="2" />
        <circle cx="146" cy="138" r="2.5" />
      </g>
    </svg>
  );
}

/** A repeating four-petal tile, drawn as a pattern so it can fill any shape. */
export function Tiles({ className, id = "tile" }: ArtProps & { id?: string }) {
  return (
    <svg aria-hidden="true" className={className} preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#F5EADB" />
          <path d="M20 4c6 6 6 10 0 16-6-6-6-10 0-16Zm0 32c-6-6-6-10 0-16 6 6 6 10 0 16ZM4 20c6-6 10-6 16 0-6 6-10 6-16 0Zm32 0c-6 6-10 6-16 0 6-6 10-6 16 0Z" fill="#22356F" />
          <circle cx="20" cy="20" r="3" fill="#C9542C" />
          <path d="M0 0h6M0 0v6M40 0h-6M40 0v6M0 40h6M0 40v-6M40 40h-6M40 40v-6" stroke="#22356F" strokeWidth="3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
