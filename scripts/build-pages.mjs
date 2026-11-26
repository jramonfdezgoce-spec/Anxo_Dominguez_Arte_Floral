// Genera la versión estática para GitHub Pages en ./out.
// Pages no ejecuta servidor, así que la ruta /api se aparta durante la compilación
// (el formulario mostrará el aviso de error con el teléfono hasta conectar un servicio externo).
import { execSync } from "node:child_process";
import { existsSync, renameSync, writeFileSync } from "node:fs";

const repo = process.argv[2] ?? "anxo-dominguez-arte-floral";
const env = { ...process.env, GITHUB_PAGES: "1", NEXT_PUBLIC_BASE_PATH: `/${repo}` };
const moved = existsSync("app/api");
if (moved) renameSync("app/api", ".api-apartada");
try {
  execSync("npx next build", { stdio: "inherit", env });
  writeFileSync("out/.nojekyll", ""); // sin esto GitHub ignora la carpeta _next
} finally {
  if (moved) renameSync(".api-apartada", "app/api");
}
