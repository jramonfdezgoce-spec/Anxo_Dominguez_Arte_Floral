import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Flores 3D procedurales con aspecto natural: cada pétalo tiene silueta propia,
 * cuenco, punta que se curva hacia fuera, borde ondulado, ligera torsión, degradado
 * de color (base más intensa, borde algo más oscuro) y nervios en la textura.
 * Todos los pétalos de una flor se fusionan en una sola malla para que sea ligero.
 */

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1);
  return t * t * (3 - 2 * t);
};

type PetalShape = {
  len: number;
  width: number;
  /** exponentes de la silueta: [base, punta]; punta baja = extremo más ancho y redondo */
  profile: [number, number];
  cup: number; // curvatura a lo ancho (cuenco)
  curl: number; // la punta se dobla hacia fuera (+) o hacia dentro (-)
  ripple: number; // ondulación del borde
  twist: number;
  notch: number; // muesca en la punta (cosmos)
};

function petalGeometry(s: PetalShape, base: THREE.Color, tip: THREE.Color, edge: number) {
  const geo = new THREE.PlaneGeometry(1, 1, 12, 20);
  const pos = geo.attributes.position;
  const colors: number[] = [];
  const c = new THREE.Color();
  const [pa, pb] = s.profile;
  // normaliza el perfil para que su máximo valga 1
  let peak = 0;
  for (let k = 1; k < 100; k++) peak = Math.max(peak, Math.pow(k / 100, pa) * Math.pow(1 - k / 100, pb));
  const ph = rnd(0, Math.PI * 2);
  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i) * 2; // -1..1 a lo ancho
    const v = pos.getY(i) + 0.5; // 0 base .. 1 punta
    const w = (Math.pow(Math.max(v, 0.02), pa) * Math.pow(Math.max(1 - v * 0.995, 0), pb)) / peak;
    // muesca: el centro de la punta se queda más corto
    const lenHere = s.len * (1 - s.notch * Math.exp(-(u * u) / 0.04) * smooth(0.7, 1, v));
    let x = u * w * s.width * 0.5;
    let y =
      s.cup * s.width * 0.5 * u * u * w + // cuenco
      -s.curl * s.len * Math.pow(smooth(0.45, 1, v), 2) + // punta hacia fuera
      s.ripple * s.width * Math.sin(u * Math.PI * 2.5 + ph) * Math.pow(Math.abs(u), 2) * v; // borde ondulado
    const z = v * lenHere;
    const a = s.twist * v; // torsión a lo largo del pétalo
    [x, y] = [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
    pos.setXYZ(i, x, y, z);
    c.copy(base).lerp(tip, smooth(0, 0.75, v));
    c.multiplyScalar(1 - edge * Math.pow(Math.abs(u), 4) * smooth(0.3, 1, v));
    colors.push(c.r, c.g, c.b);
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

/** Coloca un pétalo: abre `open` radianes desde la vertical, gira `angle` alrededor del eje. */
function place(geo: THREE.BufferGeometry, angle: number, open: number, r: number, y = 0) {
  const m = new THREE.Matrix4()
    .makeRotationY(angle)
    .multiply(new THREE.Matrix4().makeTranslation(0, y, r))
    .multiply(new THREE.Matrix4().makeRotationX(-(Math.PI / 2 - open)));
  return geo.applyMatrix4(m);
}

function colored(geo: THREE.BufferGeometry, hex: number) {
  const c = new THREE.Color(hex);
  const n = geo.attributes.position.count;
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) arr.set([c.r, c.g, c.b], i * 3);
  geo.setAttribute("color", new THREE.BufferAttribute(arr, 3));
  return geo;
}

/** Tallo corto con cáliz (sépalos) y una hoja: le da peso y realismo a la flor que cae. */
function greenParts(size: number) {
  const parts: THREE.BufferGeometry[] = [];
  const g1 = new THREE.Color(0x3f5a34), g2 = new THREE.Color(0x7d9a5c);
  for (let i = 0; i < 5; i++) {
    const s = petalGeometry({ len: 0.42 * size, width: 0.16 * size, profile: [0.5, 0.6], cup: 0.4, curl: 0.15, ripple: 0, twist: rnd(-0.2, 0.2), notch: 0 }, g1, g2, 0.1);
    parts.push(place(s, (i / 5) * Math.PI * 2 + 0.3, Math.PI / 2 + 0.45, 0.06 * size, -0.04 * size));
  }
  const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, -0.02, 0), new THREE.Vector3(0.05, -0.35 * size, 0.04), new THREE.Vector3(0.18 * size, -0.75 * size, 0.1));
  parts.push(colored(new THREE.TubeGeometry(curve, 10, 0.035 * size, 6), 0x4c6b3c));
  const leaf = petalGeometry({ len: 0.75 * size, width: 0.32 * size, profile: [0.55, 0.7], cup: 0.35, curl: 0.12, ripple: 0.04, twist: 0.3, notch: 0 }, new THREE.Color(0x33502c), new THREE.Color(0x6f8f4e), 0.1);
  leaf.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2 + 0.6).premultiply(new THREE.Matrix4().makeRotationY(0.8)).premultiply(new THREE.Matrix4().makeTranslation(0.06, -0.42 * size, 0.04)));
  parts.push(leaf);
  return mergeGeometries(parts.map((p) => p.toNonIndexed()));
}

/** Rosa de jardín: espiral áurea, pétalos interiores casi cerrados y exteriores abiertos y curvados. */
function rose(base: number, tip: number) {
  const parts: THREE.BufferGeometry[] = [];
  const n = 34;
  const cb = new THREE.Color(base), ct = new THREE.Color(tip);
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const size = 0.32 + 0.78 * Math.pow(t, 0.75);
    const geo = petalGeometry(
      { len: size, width: size * rnd(0.95, 1.15), profile: [0.55, 0.16], cup: 1.25 - 0.8 * t, curl: -0.08 + 0.32 * Math.pow(t, 1.6), ripple: 0.05 * t, twist: rnd(-0.25, 0.25), notch: 0 },
      cb.clone().lerp(ct, 0.25 * (1 - t)).multiplyScalar(0.92 + 0.08 * t),
      ct,
      0.18,
    );
    const open = 0.12 + 1.2 * Math.pow(t, 1.3) + rnd(-0.06, 0.06);
    parts.push(place(geo, i * 2.39996 + rnd(-0.1, 0.1), open, 0.02 + 0.1 * t, -0.08 * t));
  }
  return { petals: mergeGeometries(parts.map((p) => p.toNonIndexed())), center: null as THREE.BufferGeometry | null, centerColor: 0, size: 1 };
}

/** Anémona: 6–7 pétalos anchos y redondos con un centro oscuro rodeado de estambres. */
function anemone(base: number, tip: number) {
  const parts: THREE.BufferGeometry[] = [];
  const cb = new THREE.Color(base), ct = new THREE.Color(tip);
  const n = 7;
  for (let layer = 0; layer < 2; layer++)
    for (let i = 0; i < n - layer; i++) {
      const geo = petalGeometry({ len: 1.05 - layer * 0.15, width: 0.95 - layer * 0.1, profile: [0.6, 0.2], cup: 0.45, curl: 0.06, ripple: 0.06, twist: rnd(-0.15, 0.15), notch: 0 }, cb, ct, 0.12);
      parts.push(place(geo, ((i + layer * 0.5) / (n - layer)) * Math.PI * 2 + rnd(-0.08, 0.08), 1.18 - layer * 0.25 + rnd(-0.05, 0.05), 0.05, layer * 0.02));
    }
  // estambres: corona de puntitos oscuros sobre filamentos
  const st: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 40; i++) {
    const a = rnd(0, Math.PI * 2), r = rnd(0.16, 0.26);
    st.push(new THREE.SphereGeometry(0.028, 5, 4).translate(Math.cos(a) * r, 0.1 + rnd(0, 0.05), Math.sin(a) * r));
  }
  const center = mergeGeometries([new THREE.SphereGeometry(0.15, 18, 12).scale(1, 0.7, 1).translate(0, 0.06, 0), ...st]);
  return { petals: mergeGeometries(parts.map((p) => p.toNonIndexed())), center, centerColor: 0x1d1f2b, size: 1 };
}

/** Cosmos: 8 pétalos largos con la punta dentada y botón amarillo con relieve. */
function cosmos(base: number, tip: number) {
  const parts: THREE.BufferGeometry[] = [];
  const cb = new THREE.Color(base), ct = new THREE.Color(tip);
  for (let i = 0; i < 8; i++) {
    const geo = petalGeometry({ len: 1.15, width: 0.62, profile: [0.7, 0.12], cup: 0.2, curl: 0.05, ripple: 0.05, twist: rnd(-0.2, 0.2), notch: 0.09 }, cb, ct, 0.1);
    parts.push(place(geo, (i / 8) * Math.PI * 2 + rnd(-0.06, 0.06), 1.35 + rnd(-0.08, 0.08), 0.08));
  }
  const bumps: THREE.BufferGeometry[] = [new THREE.SphereGeometry(0.17, 18, 12).scale(1, 0.55, 1).translate(0, 0.04, 0)];
  for (let i = 0; i < 60; i++) {
    const r = 0.16 * Math.sqrt(i / 60), a = i * 2.39996;
    bumps.push(new THREE.SphereGeometry(0.022, 4, 3).translate(Math.cos(a) * r, 0.1 - r * 0.25, Math.sin(a) * r));
  }
  return { petals: mergeGeometries(parts.map((p) => p.toNonIndexed())), center: mergeGeometries(bumps), centerColor: 0xe0a42a, size: 1.05 };
}

/** Textura de nervios: líneas finas que salen de la base, multiplicadas sobre el color. */
function veinTexture() {
  const cv = document.createElement("canvas");
  cv.width = 128;
  cv.height = 256;
  const x = cv.getContext("2d")!;
  x.fillStyle = "#fff";
  x.fillRect(0, 0, 128, 256);
  const grad = x.createLinearGradient(0, 256, 0, 0);
  grad.addColorStop(0, "rgba(120,90,70,0.18)");
  grad.addColorStop(0.35, "rgba(120,90,70,0)");
  x.fillStyle = grad;
  x.fillRect(0, 0, 128, 256);
  x.strokeStyle = "rgba(90,60,50,0.10)";
  for (let i = 0; i < 13; i++) {
    const tx = 6 + (i / 12) * 116;
    x.lineWidth = i === 6 ? 2 : 1;
    x.beginPath();
    x.moveTo(64, 256);
    x.quadraticCurveTo(64 + (tx - 64) * 0.3, 150, tx, 10 + Math.abs(i - 6) * 6);
    x.stroke();
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const FLOWER_KINDS = [
  { make: rose, base: 0xcf6638, tip: 0xeeaa7c }, // rosa melocotón
  { make: rose, base: 0xa8405c, tip: 0xe79db1 }, // rosa empolvada
  { make: anemone, base: 0xe4ddd2, tip: 0xffffff }, // anémona blanca
  { make: rose, base: 0x1e030a, tip: 0x4f0d1d }, // rosa burdeos
  { make: cosmos, base: 0xb02d58, tip: 0xec8fab }, // cosmos rosa
  { make: rose, base: 0xb3864f, tip: 0xe6cfa6 }, // rosa crema
  { make: anemone, base: 0x9e2348, tip: 0xe07c98 }, // anémona fucsia suave
  { make: cosmos, base: 0xf1ebe1, tip: 0xffffff }, // cosmos blanco
];

export function buildFlower(kind: (typeof FLOWER_KINDS)[number], veins: THREE.Texture) {
  const g = new THREE.Group();
  const flower = new THREE.Group(); // capa interna para el balanceo
  g.add(flower);
  const model = kind.make(kind.base, kind.tip);
  const petalMat = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    map: veins,
    side: THREE.DoubleSide,
    roughness: 0.78,
    // brillo aterciopelado del mismo tono que la flor (blanco la lavaba)
    sheen: 0.35,
    sheenRoughness: 0.55,
    sheenColor: new THREE.Color(kind.tip),
    envMapIntensity: 0.3,
  });
  flower.add(new THREE.Mesh(model.petals, petalMat));
  if (model.center) {
    flower.add(new THREE.Mesh(model.center, new THREE.MeshStandardMaterial({ color: model.centerColor, roughness: 0.85 })));
  }
  flower.add(new THREE.Mesh(greenParts(1), new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.6, map: veins })));
  flower.scale.setScalar(model.size);
  return { g, flower };
}

export { veinTexture };
