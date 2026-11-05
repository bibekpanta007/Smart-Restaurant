// Everest Kitchen logo, drawn with SVG so it stays sharp at any size
function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="everestCopper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e0a84f" />
          <stop offset="100%" stopColor="#c0472b" />
        </linearGradient>
        {/* keeps the mountains inside the circle */}
        <clipPath id="everestClip">
          <circle cx="24" cy="24" r="23" />
        </clipPath>
      </defs>

      {/* copper background */}
      <circle cx="24" cy="24" r="23" fill="url(#everestCopper)" />

      <g clipPath="url(#everestClip)">
        {/* sun */}
        <circle cx="33" cy="13" r="3" fill="white" fillOpacity="0.9" />

        {/* back mountain range */}
        <path
          d="M-2 48 L-2 33 L10 25 L17 30 L30 18 L40 27 L50 23 L50 48 Z"
          fill="white"
          fillOpacity="0.35"
        />

        {/* main peak */}
        <path d="M4 48 L22 15 L40 48 Z" fill="#2b1f1a" />

        {/* snow cap */}
        <path d="M22 15 L25.3 21 L23.6 19.9 L22 21.5 L20.4 19.9 L18.7 21 Z" fill="white" />
      </g>

      {/* thin inner ring */}
      <circle
        cx="24"
        cy="24"
        r="19"
        fill="none"
        stroke="white"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
    </svg>
  );
}

export default Logo;