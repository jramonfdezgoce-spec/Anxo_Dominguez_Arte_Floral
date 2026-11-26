# Anxo Domínguez · Arte Floral

Web de presentación del estudio de arte floral de Anxo Domínguez (Vigo): bodas, ramos de novia, arcos florales, eventos corporativos, colección navideña, curso «Proyecto Floral» y formulario de presupuesto.

Hecha con Next.js, Tailwind CSS, GSAP + ScrollTrigger, Lenis y Three.js.

## Verla en local

```bash
npm install
npm run build
npx next start -p 3002
```

Abre http://localhost:3002. Desde el móvil, con la misma wifi: `http://<IP-del-Mac>:3002`.

## Publicarla en GitHub Pages

```bash
npm run build:pages
```

Genera la web estática en `out/` para la dirección `https://<usuario>.github.io/anxo-dominguez-arte-floral/`. Ese contenido se sube a la rama `gh-pages`.

GitHub Pages no ejecuta servidor: en esa versión el formulario muestra el aviso de error con el teléfono. Para que las solicitudes lleguen por correo, publica la web en Vercel (usa `app/api/contacto` con Resend; copia `.env.example` a `.env.local` con tus claves) o conecta el formulario a un servicio externo como Formspree.
