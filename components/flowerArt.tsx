import type { CSSProperties } from "react";

export const FLOWER_COLORS = [
  ["#f4c9d2", "#e8a0b2"],
  ["#fbeadb", "#f0c9a8"],
  ["#fff8ee", "#eadbc4"],
  ["#9b2239", "#6e1426"],
  ["#c1405a", "#8f2540"],
  ["#f6d2b4", "#e8a37a"],
  ["#f7dbe2", "#ecb4c3"],
  ["#7a1830", "#4a0f1d"],
];

export function FlowerSVG({
  petals = 7,
  c1,
  c2,
  className,
  style,
}: {
  petals?: number;
  c1: string;
  c2: string;
  className?: string;
  style?: CSSProperties;
}) {
  const outer = Array.from({ length: petals }, (_, i) => (360 / petals) * i);
  const inner = Array.from({ length: petals }, (_, i) => (360 / petals) * (i + 0.5));
  return (
    <svg viewBox="-50 -50 100 100" className={className} style={style} aria-hidden>
      {outer.map((a) => (
        <ellipse key={"o" + a} cx="0" cy="-26" rx="15" ry="24" fill={c2} stroke="rgba(0,0,0,.12)" strokeWidth=".6" transform={`rotate(${a})`} />
      ))}
      {inner.map((a) => (
        <ellipse key={"i" + a} cx="0" cy="-19" rx="12" ry="18" fill={c1} stroke="rgba(0,0,0,.08)" strokeWidth=".5" transform={`rotate(${a})`} />
      ))}
      <circle r="9" fill={c2} opacity=".85" />
      <circle r="5" fill="#d8b46a" />
      <circle r="2" fill="#a47c34" />
    </svg>
  );
}

export function LeafSVG({ fill, className, style }: { fill: string; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="-20 -50 40 100" className={className} style={style} aria-hidden>
      <path d="M0,-48 C22,-24 22,24 0,48 C-22,24 -22,-24 0,-48Z" fill={fill} />
      <path d="M0,-44 L0,44" stroke="rgba(255,255,255,.25)" strokeWidth="1.2" />
    </svg>
  );
}

/** Pétalo suelto con volumen: silueta de pétalo de rosa, degradado, pliegue, nervios y sombra. */
export function PetalSVG({ fill = "#e8a0b2", className, style, ...rest }: { fill?: string; className?: string; style?: CSSProperties } & Record<string, string>) {
  const id = "pt" + fill.replace(/[^a-z0-9]/gi, "");
  const shape = "M20,58 C10,52 2,39 3,25 C4,11 12,3 18.5,4.5 Q20,7 21.5,4.5 C28,3 37,11 37,25 C38,39 30,52 20,58Z";
  return (
    <svg viewBox="0 0 40 60" className={className} style={{ filter: "drop-shadow(0 6px 6px rgba(43,38,31,0.18))", ...style }} aria-hidden {...rest}>
      <defs>
        <linearGradient id={`${id}-luz`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#2b1a14" stopOpacity="0.35" />
          <stop offset="35%" stopColor="#2b1a14" stopOpacity="0" />
          <stop offset="75%" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id={`${id}-pliegue`} cx="95%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#2b1a14" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2b1a14" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={shape} fill={fill} />
      <path d={shape} fill={`url(#${id}-luz)`} />
      <path d={shape} fill={`url(#${id}-pliegue)`} />
      <g stroke="#fff" strokeOpacity="0.28" strokeWidth="0.5" fill="none" strokeLinecap="round">
        <path d="M20,56 C19.5,40 19.5,22 20,9" />
        <path d="M20,52 C15,42 10,30 9,18" />
        <path d="M20,52 C25,42 30,30 31,18" />
        <path d="M20,54 C17,46 13,38 6,30" />
        <path d="M20,54 C23,46 27,38 34,30" />
      </g>
      <path d={shape} fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="0.6" />
    </svg>
  );
}
