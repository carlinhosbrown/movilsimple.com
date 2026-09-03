# MovilSimple v4.1 — DISEÑO V3 + INFRAESTRUCTURA DE PRODUCCIÓN

Esta versión recupera el diseño visual de la landing v3 (la versión elegida)
y mantiene toda la infraestructura de producción creada en v4:

- Cloudflare Pages
- Pages Functions
- Brevo Double Opt-In
- Formulario de contacto
- SEO, sitemap, robots y Open Graph
- Favicon e iconos
- Páginas legales
- Cabeceras de seguridad

La guía de despliegue es la misma que en v4.

---

# MovilSimple v4 — Guía de publicación

Esta versión está preparada para:

- Cloudflare Pages (hosting)
- GitHub (deploy automático)
- GoDaddy (registrador del dominio)
- Brevo (newsletter con doble opt-in + envío del formulario de contacto)

## Estructura

- `public/` → web estática que Cloudflare publica.
- `functions/api/newsletter.js` → alta en Brevo con doble opt-in.
- `functions/api/contact.js` → envía las consultas mediante Brevo sin exponer la API key.

## IMPORTANTE antes de publicar

Completa `[COMPLETAR]` en:
- `public/privacidad.html`
- `public/aviso-legal.html`

No publiques una identidad/NIF inventados.

---

# 1. Subir este proyecto a GitHub

Crea un repositorio nuevo, por ejemplo `MovilSimple-web`.

Puedes subir los archivos desde la interfaz web de GitHub o usar Git:

```bash
git init
git add .
git commit -m "MovilSimple v4"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/MovilSimple-web.git
git push -u origin main
```

Sube EL CONTENIDO de esta carpeta, de modo que en la raíz del repositorio se vean:
- `public`
- `functions`
- `README_DEPLOY.md`

# 2. Crear el proyecto en Cloudflare Pages

Cloudflare:
1. `Workers & Pages`
2. `Create application`
3. `Pages`
4. `Connect to Git` / `Import an existing Git repository`
5. Autoriza GitHub y selecciona `MovilSimple-web`

Configuración:
- Production branch: `main`
- Framework preset: `None`
- Build command: `exit 0`
- Build output directory: `public`
- Root directory: dejar vacío

Pulsa `Save and Deploy`.

Cloudflare te dará temporalmente una URL parecida a:
`https://movilsimple.pages.dev`

# 3. Añadir movilsimple.com a Cloudflare

Para utilizar el dominio raíz `movilsimple.com`, Cloudflare requiere que el dominio sea una zona de Cloudflare y que sus nameservers apunten a Cloudflare.

En Cloudflare:
1. `Websites` / `Add a domain`
2. Introduce `movilsimple.com`
3. Selecciona el plan Free
4. Cloudflare intentará importar los registros DNS actuales
5. REVISA los registros antes de cambiar nameservers.

## MUY IMPORTANTE SI YA TIENES CORREO EN GODADDY

Si tienes `hola@movilsimple.com`, Microsoft 365 o Professional Email de GoDaddy:
- comprueba que los registros MX estén copiados a Cloudflare;
- copia también los TXT de SPF;
- copia DKIM y DMARC si ya existen.

Cambiar los nameservers hace que Cloudflare pase a gestionar el DNS. Si los registros del correo no están allí, el email puede dejar de funcionar.

Cloudflare te mostrará dos nameservers, por ejemplo:
- `xxxx.ns.cloudflare.com`
- `yyyy.ns.cloudflare.com`

USA LOS QUE TE MUESTRE TU PROPIA CUENTA; no copies ejemplos.

# 4. Cambiar los nameservers en GoDaddy

GoDaddy:
1. Inicia sesión.
2. Abre `Cartera de productos de dominio` / `Domain Portfolio`.
3. Selecciona `movilsimple.com`.
4. Entra en `DNS`.
5. Busca `Nameservers / Servidores de nombres`.
6. Pulsa `Change / Cambiar`.
7. Selecciona la opción para usar tus propios nameservers.
8. Introduce exactamente los 2 nameservers entregados por Cloudflare.
9. Guarda.

La propagación puede tardar un tiempo. Cloudflare te indicará cuando el dominio esté activo.

# 5. Asociar el dominio al proyecto Pages

Cloudflare:
1. `Workers & Pages`
2. Abre el proyecto MovilSimple.
3. `Custom domains`
4. `Set up a domain`
5. Añade `movilsimple.com`
6. Después añade también `www.movilsimple.com`

El proyecto incluye una redirección para que `www.movilsimple.com` termine en `movilsimple.com`.

# 6. Crear la cuenta gratuita de Brevo

En Brevo:
1. Crea una cuenta.
2. Verifica el remitente o, preferiblemente, autentica `movilsimple.com`.
3. Crea dos listas:
   - `MovilSimple Newsletter`
   - `MovilSimple Beta`
4. Anota los ID numéricos de ambas listas.

# 7. Crear el email de doble confirmación

En Brevo crea una plantilla para la confirmación de suscripción.

Debe ser una plantilla válida para Double Opt-In.

Ejemplo de contenido:
- Asunto: `Confirma tu suscripción a MovilSimple`
- Texto: `Solo falta un paso. Confirma tu email para recibir los avances de MovilSimple.`
- Botón de confirmación obligatorio de Brevo.

Anota el ID numérico de la plantilla.

# 8. Crear una API key de Brevo

Brevo:
- Settings / SMTP & API
- API Keys
- Create a new API key

NO pongas nunca la clave dentro de HTML o JavaScript público.

# 9. Añadir secretos en Cloudflare

Cloudflare:
1. `Workers & Pages`
2. Proyecto MovilSimple
3. `Settings`
4. `Variables and Secrets`
5. Añade estas variables para PRODUCCIÓN:

Secret:
- `BREVO_API_KEY` = tu API key de Brevo

Variables:
- `BREVO_NEWSLETTER_LIST_ID` = ID de la lista Newsletter
- `BREVO_BETA_LIST_ID` = ID de la lista Beta
- `BREVO_DOI_TEMPLATE_ID` = ID de plantilla de doble opt-in
- `SITE_URL` = `https://movilsimple.com`
- `CONTACT_TO` = email donde quieres recibir los formularios, por ejemplo `hola@movilsimple.com`
- `CONTACT_FROM` = un remitente VERIFICADO en Brevo, por ejemplo `web@movilsimple.com`
- `CONTACT_FROM_NAME` = `MovilSimple Web`

Tras añadir/cambiar variables, haz un nuevo deployment si Cloudflare no lo aplica automáticamente.

# 10. Probar

Newsletter:
1. Abre movilsimple.com.
2. Introduce TU correo.
3. Debes recibir email de doble confirmación.
4. Pulsa el enlace.
5. Debes llegar a `/gracias.html`.
6. Confirma que apareces en la lista final de Brevo.

Contacto:
1. Abre `/contacto.html`.
2. Envíate una prueba.
3. Debe llegar al email configurado en `CONTACT_TO`.
4. Al responder desde el cliente de correo, la respuesta debe dirigirse al usuario del formulario.

# 11. Comprobaciones finales

- Abrir en móvil y ordenador.
- Comprobar HTTPS.
- Probar `www.movilsimple.com`.
- Probar newsletter.
- Probar contacto.
- Completar aviso legal y privacidad.
- Comprobar que no se muestra ninguna API key en el código de la web.
- Enviar `https://movilsimple.com/sitemap.xml` a Google Search Console cuando quieras indexación.
