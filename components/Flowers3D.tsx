"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { FLOWER_KINDS, buildFlower, veinTexture } from "./flowerModels";

type Petal = {
  g: THREE.Group;
  flower: THREE.Group;
  z: number;
  depth: number; // 0 lejos .. 1 cerca
  scale: number;
  lane: number; // posición horizontal normalizada (bordes de la pantalla)
  ty: number; // objetivo vertical (mundo)
  pos: THREE.Vector2;
  vel: THREE.Vector2;
  fall: number;
  sway: { a: number; f: number; ph: number };
  tumble: { f1: number; f2: number; ph: number };
  spinDir: number;
  delay: number;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/**
 * Flores 3D (Three.js) que caen despacio por los laterales como pétalos al viento.
 * Física con muelle independiente de los FPS: el ratón las aparta, el scroll crea ráfagas
 * y al salir de pantalla se recolocan fuera de vista por el lado contrario (sin saltos).
 */
export default function Flowers3D() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.85;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    camera.position.z = 12;
    // luz de estudio suave (reflejos y sombreado realistas) + sol cálido
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.add(new THREE.HemisphereLight(0xfff4e6, 0x3e4a30, 0.55));
    const key = new THREE.DirectionalLight(0xfff1dc, 1.7);
    key.position.set(3, 6, 8);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffc99a, 1.2);
    rim.position.set(-6, -2, -4);
    scene.add(rim);

    const mobile = window.innerWidth < 768;
    const lanes = mobile ? [-1, 0.98, -0.96, 1, 0.95] : [-0.9, -0.81, -0.87, -0.83, 0.82, 0.89, 0.85, 0.93, -0.95, 0.81];
    const veins = veinTexture();
    const tanHalf = Math.tan((40 * Math.PI) / 360);
    const halfHAt = (z: number) => tanHalf * (camera.position.z - z);

    const petals: Petal[] = lanes.map((lane, i) => {
      const { g, flower } = buildFlower(FLOWER_KINDS[i % FLOWER_KINDS.length], veins);
      const depth = (i * 0.37) % 1;
      const z = -2.5 + depth * 4.5;
      const scale = (0.38 + depth * 0.36) * (mobile ? 0.6 : 1);
      g.scale.setScalar(0.0001);
      scene.add(g);
      const hh = halfHAt(z);
      const ty = rand(-hh, hh);
      return {
        g, flower, z, depth, scale, lane, ty,
        pos: new THREE.Vector2(0, ty),
        vel: new THREE.Vector2(),
        fall: rand(0.28, 0.5) * (0.6 + depth * 0.6),
        sway: { a: rand(0.25, 0.6) * (mobile ? 0.3 : 0.6), f: rand(0.25, 0.5), ph: rand(0, 6.28) },
        tumble: { f1: rand(0.3, 0.6), f2: rand(0.2, 0.45), ph: rand(0, 6.28) },
        spinDir: Math.random() < 0.5 ? -1 : 1,
        delay: i * 0.12,
      };
    });

    const size = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    size();
    window.addEventListener("resize", size);

    const mouse = { x: 0, y: 0, active: false };
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
      mouse.active = true;
    };
    const onLeave = () => (mouse.active = false);
    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const contact = document.getElementById("contacto");
    let fade = 1;
    let lastScroll = window.scrollY;
    let gust = 0; // energía de la ráfaga producida por el scroll
    let startAt = -1;
    let last = -1;
    const enterEase = gsap.parseEase("power3.out");

    const tick = (time: number) => {
      const now = time;
      const dt = last < 0 ? 0 : Math.min(Math.max(now - last, 0), 1 / 20); // evita saltos al volver a la pestaña
      last = now;
      if (!visible || !window.__introDone) {
        lastScroll = window.scrollY;
        return;
      }
      if (startAt < 0) startAt = now;
      const t = now - startAt;

      // se retiran para no tapar el formulario
      const over = contact ? contact.getBoundingClientRect().top < window.innerHeight * 0.75 : false;
      fade += ((over ? 0 : 1) - fade) * (1 - Math.exp(-dt * 5));
      el.style.opacity = fade.toFixed(3);

      const dScroll = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      gust += (Math.min(Math.abs(dScroll) / Math.max(dt, 1e-3) / 2000, 2.5) - gust) * (1 - Math.exp(-dt * 3));
      const dir = Math.sign(dScroll);

      petals.forEach((p) => {
        const hh = halfHAt(p.z);
        const hw = hh * camera.aspect;
        const margin = 1.6 * p.scale + 0.6;

        // objetivo: caída lenta + parallax por profundidad con el scroll
        p.ty -= p.fall * dt * (1 + gust * 0.8);
        p.ty += (dScroll / window.innerHeight) * 2 * hh * (0.25 + p.depth * 0.55);
        let recycled = false;
        if (p.ty < -hh - margin) { p.ty = hh + margin; recycled = true; }
        else if (p.ty > hh + margin) { p.ty = -hh - margin; recycled = true; }

        const tx = p.lane * hw + Math.sin(t * p.sway.f + p.sway.ph) * p.sway.a * (1 + gust * 0.6) - mouse.x * p.depth * 0.6 * (mouse.active ? 1 : 0);
        const ty = p.ty + Math.sin(t * p.sway.f * 1.7 + p.sway.ph) * 0.12 - (mouse.active ? mouse.y * p.depth * 0.35 : 0);

        if (recycled) {
          p.pos.set(tx, ty);
          p.vel.set(0, 0);
        }

        // muelle amortiguado hacia el objetivo + repulsión suave del cursor
        let fx = 26 * (tx - p.pos.x) - 7 * p.vel.x;
        let fy = 26 * (ty - p.pos.y) - 7 * p.vel.y;
        if (mouse.active) {
          const mx = mouse.x * hw, my = mouse.y * hh;
          const dx = p.pos.x - mx, dy = p.pos.y - my;
          const d2 = dx * dx + dy * dy;
          const r = 2.2 + p.scale * 2;
          const push = 60 * Math.exp(-d2 / (r * r));
          const d = Math.sqrt(d2) || 1;
          fx += (dx / d) * push;
          fy += (dy / d) * push;
        }
        fy += dir * gust * 6 * p.depth; // la ráfaga empuja en el sentido del scroll
        p.vel.x += fx * dt;
        p.vel.y += fy * dt;
        p.pos.x += p.vel.x * dt;
        p.pos.y += p.vel.y * dt;

        // entrada: llegan con el viento desde la izquierda tras la intro
        const e = enterEase(Math.min(Math.max((t - p.delay) / 2.2, 0), 1));
        const enterX = (1 - e) * -(hw * 2.2);
        p.g.position.set(p.pos.x + enterX, p.pos.y + (1 - e) * 1.5, p.z);
        p.g.scale.setScalar(p.scale * (0.4 + 0.6 * e));

        // balanceo de hoja que cae: inclinación hacia el movimiento + giro lento
        const tm = p.tumble;
        p.flower.rotation.x = 1.1 + Math.sin(t * tm.f1 + tm.ph) * 0.45 - p.vel.y * 0.06;
        p.flower.rotation.z = Math.sin(t * tm.f2 + tm.ph * 1.3) * 0.5 - p.vel.x * 0.08 + (1 - e) * 2.5;
        p.flower.rotation.y += p.spinDir * (0.18 + gust * 0.9) * dt;
      });
      renderer.render(scene, camera);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      window.removeEventListener("resize", size);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (o.material as THREE.Material).dispose();
        }
      });
      veins.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mount} className="pointer-events-none fixed inset-0 z-[40]" aria-hidden />;
}
