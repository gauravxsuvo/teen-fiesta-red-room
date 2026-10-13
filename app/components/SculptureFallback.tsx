type FallbackRay = {
  angle: number;
  length: number;
  width: number;
  bend: number;
};

const rays: readonly FallbackRay[] = [
  { angle: 163, length: 176, width: 20, bend: 12 },
  { angle: 127, length: 132, width: 23, bend: -10 },
  { angle: 96, length: 190, width: 17, bend: 9 },
  { angle: 59, length: 154, width: 21, bend: -14 },
  { angle: 27, length: 179, width: 19, bend: 14 },
  { angle: -9, length: 121, width: 18, bend: -10 },
  { angle: -43, length: 187, width: 20, bend: 14 },
  { angle: -82, length: 162, width: 18, bend: -15 },
  { angle: -132, length: 137, width: 21, bend: 9 },
  { angle: -174, length: 110, width: 12, bend: -13 },
  { angle: -108, length: 105, width: 12, bend: 12 },
];

function rayPath({ angle, length, width, bend }: FallbackRay) {
  const radians = (angle * Math.PI) / 180;
  const dx = Math.cos(radians);
  const dy = -Math.sin(radians);
  const px = -dy;
  const py = dx;
  const cx = 210;
  const cy = 210;
  const point = (distance: number, side = 0) => [
    cx + dx * distance + px * side,
    cy + dy * distance + py * side,
  ];
  const leftRoot = point(23, width * 0.5);
  const rightRoot = point(23, -width * 0.5);
  const leftShoulder = point(length * 0.25, width * 1.28 + bend * 0.14);
  const rightShoulder = point(length * 0.28, -width * 0.93 + bend * 0.1);
  const leftTaper = point(length * 0.68, width * 0.48 + bend * 0.62);
  const rightTaper = point(length * 0.72, -width * 0.38 + bend * 0.7);
  const leftTip = point(length * 0.91, width * 0.08 + bend * 0.88);
  const rightTip = point(length * 0.9, -width * 0.07 + bend * 0.93);
  const tip = point(length, bend);
  const format = ([x, y]: number[]) => `${x.toFixed(1)} ${y.toFixed(1)}`;

  return {
    d: `M ${format(leftRoot)} C ${format(leftShoulder)} ${format(leftTaper)} ${format(leftTip)} Q ${format(tip)} ${format(rightTip)} C ${format(rightTaper)} ${format(rightShoulder)} ${format(rightRoot)} Q ${format(point(15, -width * 0.16))} ${format(leftRoot)} Z`,
    highlight: `M ${format(point(32, width * 0.16))} C ${format(point(length * 0.24, width * 0.72 + bend * 0.08))} ${format(point(length * 0.61, width * 0.28 + bend * 0.42))} ${format(point(length * 0.87, bend * 0.82))}`,
  };
}

const rayPaths = rays.map((ray) => rayPath(ray));

export default function SculptureFallback() {
  return (
    <svg className="sculpture-fallback" viewBox="0 0 420 420" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="starburst-chrome" x1="74" y1="52" x2="358" y2="366" gradientUnits="userSpaceOnUse">
          <stop stopColor="#17181c" />
          <stop offset=".12" stopColor="#f5f6f8" />
          <stop offset=".22" stopColor="#6a6c73" />
          <stop offset=".37" stopColor="#e7e9ee" />
          <stop offset=".49" stopColor="#191a1e" />
          <stop offset=".63" stopColor="#090a0d" />
          <stop offset=".76" stopColor="#bfc2c9" />
          <stop offset=".88" stopColor="#27282d" />
          <stop offset="1" stopColor="#f1f2f5" />
        </linearGradient>
        <radialGradient id="starburst-core" cx=".34" cy=".25" r=".82">
          <stop stopColor="#45474d" />
          <stop offset=".2" stopColor="#111216" />
          <stop offset=".39" stopColor="#060709" />
          <stop offset=".56" stopColor="#4d0711" />
          <stop offset=".73" stopColor="#15161a" />
          <stop offset=".88" stopColor="#9fa1a8" />
          <stop offset="1" stopColor="#24252a" />
        </radialGradient>
        <filter id="starburst-core-glint" x="166" y="163" width="88" height="88" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <circle cx="210" cy="210" r="36" fill="#a50d20" fillOpacity=".12" filter="url(#starburst-core-glint)" />
      <g fill="url(#starburst-chrome)" stroke="#bfc1c7" strokeOpacity=".74" strokeWidth=".72" strokeLinejoin="round">
        {rayPaths.map((ray, index) => <path d={ray.d} key={index} />)}
      </g>
      <g stroke="#f8f9fb" strokeOpacity=".72" strokeWidth="1.35" strokeLinecap="round">
        {[0, 2, 3, 6, 8].map((index) => <path d={rayPaths[index].highlight} key={index} />)}
      </g>
      <g stroke="#ef3439" strokeOpacity=".8" strokeWidth="1.25" strokeLinecap="round">
        {[1, 4, 7, 9].map((index) => <path d={rayPaths[index].highlight} key={index} />)}
      </g>
      <path
        d="M211 173c12-4 23 2 30 12 11 5 14 18 9 29 3 11-5 22-15 27-7 11-20 15-31 9-13 1-24-8-26-20-9-9-8-22 0-31 3-13 17-24 33-26Z"
        fill="url(#starburst-core)"
        stroke="#aeb0b7"
        strokeOpacity=".8"
        strokeWidth="1.4"
      />
      <path d="M185 194c8-10 17-15 29-17" stroke="#f5f6f8" strokeOpacity=".88" strokeWidth="3" strokeLinecap="round" />
      <path d="M218 196c6-4 12-6 18-5" stroke="#17181c" strokeOpacity=".96" strokeWidth="4.4" strokeLinecap="round" />
      <path d="M215 221c7-4 13-4 19-1" stroke="#ef3439" strokeOpacity=".9" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}
