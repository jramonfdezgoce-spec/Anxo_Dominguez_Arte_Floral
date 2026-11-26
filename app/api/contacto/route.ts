import { NextResponse } from "next/server";

const LABELS: Record<string, string> = {
  tipo: "Tipo de solicitud",
  nombre: "Nombre",
  telefono: "Teléfono",
  email: "Email",
  fecha: "Fecha del evento",
  tipoEvento: "Tipo de evento",
  lugar: "Lugar",
  invitados: "Invitados",
  presupuesto: "Presupuesto",
  detalles: "Detalles",
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const data: Record<string, string> = {};
  for (const k of Object.keys(LABELS)) {
    if (typeof body[k] === "string" || typeof body[k] === "number") data[k] = String(body[k]).slice(0, 3000);
  }
  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
    return NextResponse.json({ ok: false, error: "email" }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) {
    console.warn("[contacto] Falta RESEND_API_KEY o CONTACT_TO_EMAIL; solicitud sin enviar:", data);
    return NextResponse.json({ ok: false, error: "not-configured" }, { status: 500 });
  }

  const isCourse = data.tipo === "lista-espera-curso";
  const rows = Object.entries(data)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0"><b>${LABELS[k]}</b></td><td>${esc(v)}</td></tr>`)
    .join("");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Web Anxo Domínguez <onboarding@resend.dev>",
      to: [to],
      reply_to: data.email,
      subject: isCourse ? "Lista de espera: curso Proyecto Floral" : `Nueva solicitud de presupuesto${data.nombre ? " · " + data.nombre : ""}`,
      html: `<table>${rows}</table>`,
    }),
  });

  if (!res.ok) {
    console.error("[contacto] Resend", res.status, await res.text());
    return NextResponse.json({ ok: false }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
