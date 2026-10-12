export default function SculptureFallback() {
  return (
    <svg className="sculpture-fallback" viewBox="0 0 420 420" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="vinyl" cx=".36" cy=".28" r=".78">
          <stop stopColor="#48494d" />
          <stop offset=".38" stopColor="#111214" />
          <stop offset="1" stopColor="#050506" />
        </radialGradient>
        <linearGradient id="vinyl-rim" x1="90" y1="110" x2="340" y2="318" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f0efed" />
          <stop offset=".28" stopColor="#77787c" />
          <stop offset=".56" stopColor="#d7d7d8" />
          <stop offset="1" stopColor="#414247" />
        </linearGradient>
        <filter id="vinyl-shadow" x="5" y="15" width="410" height="410" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      <circle cx="213" cy="228" r="154" fill="#000" fillOpacity=".72" filter="url(#vinyl-shadow)" />
      <circle cx="210" cy="210" r="150" fill="url(#vinyl)" />
      <circle cx="210" cy="210" r="147" stroke="url(#vinyl-rim)" strokeWidth="4" />
      {Array.from({ length: 25 }, (_, index) => (
        <circle
          key={index}
          cx="210"
          cy="210"
          r={128 - index * 3.1}
          stroke={index % 3 === 0 ? "#a4a5a8" : "#636468"}
          strokeOpacity={index % 3 === 0 ? ".46" : ".3"}
          strokeWidth="1.3"
        />
      ))}
      <circle cx="210" cy="210" r="45" fill="#e62d3a" />
      <circle cx="210" cy="210" r="40" stroke="#f4f4f2" strokeOpacity=".68" />
      <circle cx="210" cy="210" r="13" fill="#080809" />
      <circle cx="210" cy="210" r="3" fill="#f4f4f2" />
      <path d="M102 104c32-33 79-51 125-48" stroke="white" strokeOpacity=".36" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
