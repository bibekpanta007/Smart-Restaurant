// The Copper Fork logo, drawn with SVG so it stays sharp at any size
function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="copper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e0a84f" />
          <stop offset="100%" stopColor="#c0472b" />
        </linearGradient>
      </defs>

      {/* copper circle with a thin inner ring */}
      <circle cx="24" cy="24" r="23" fill="url(#copper)" />
      <circle cx="24" cy="24" r="19" fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="1" />

      {/* fork */}
      <g fill="white">
        <rect x="16.5" y="11" width="2.2" height="10" rx="1.1" />
        <rect x="22.9" y="11" width="2.2" height="10" rx="1.1" />
        <rect x="29.3" y="11" width="2.2" height="10" rx="1.1" />
        <path d="M15.5 19 h17 v2.5 a8.5 8.5 0 0 1 -8.5 6 a8.5 8.5 0 0 1 -8.5 -6 z" />
        <rect x="22.4" y="25" width="3.2" height="13" rx="1.6" />
      </g>
    </svg>
  );
}

export default Logo;