# MovilSimple — Search Console / SEO fase 1

La parte técnica del sitio ya queda preparada para Google Search Console:

- `https://movilsimple.com/robots.txt` permite el rastreo y declara el sitemap.
- `https://movilsimple.com/sitemap.xml` incluye la portada, las nuevas páginas SEO, contacto, privacidad y aviso legal.
- Las nuevas páginas tienen `title`, `meta description`, canonical, Open Graph y datos estructurados.
- La portada añade `Organization` schema con el nombre, dominio, logo y correo de MovilSimple.

## Paso manual pendiente: verificar el dominio

1. Entrar en Google Search Console.
2. Añadir una propiedad de tipo **Dominio** con: `movilsimple.com`.
3. Google mostrará un registro TXT parecido a:
   `google-site-verification=xxxxxxxxxxxxxxxx`
4. En Cloudflare → DNS → Records → Add record:
   - Type: `TXT`
   - Name: `@`
   - Content: pegar exactamente el valor generado por Google.
   - TTL: Auto.
5. Volver a Search Console y pulsar **Verificar**.

No se debe inventar ese TXT: Google genera uno único para la propiedad.

## Después de verificar

1. Ir a **Sitemaps**.
2. Enviar: `https://movilsimple.com/sitemap.xml`.
3. Usar **Inspección de URLs** para solicitar indexación de:
   - `https://movilsimple.com/`
   - `https://movilsimple.com/movil-para-mayores/`
   - `https://movilsimple.com/android-para-mayores/`
   - `https://movilsimple.com/guias/`
4. Revisar durante las siguientes semanas:
   - Páginas indexadas.
   - Consultas de búsqueda.
   - CTR.
   - Posición media.
   - Errores de rastreo o indexación.

## Próxima fase recomendada

Crear guías específicas con intención de búsqueda real, enlazadas desde `/guias/`, por ejemplo:

- bloquear llamadas spam en Android;
- evitar SMS fraudulentos;
- configurar WhatsApp para una persona mayor;
- configurar una tablet Android para mayores;
- comparar launcher sencillo vs modo fácil del fabricante.

No publicar contenido genérico en volumen. Priorizar guías prácticas, capturas reales y problemas que MovilSimple esté resolviendo en el producto.
