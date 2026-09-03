
const json = (body, status=200) => new Response(JSON.stringify(body), {
  status, headers: {"content-type":"application/json; charset=utf-8","cache-control":"no-store"}
});
const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254;
const esc = (v) => String(v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    if (body.website) return json({message:"Mensaje enviado."}); // honeypot
    const name = String(body.name || "").trim().slice(0,120);
    const email = String(body.email || "").trim().toLowerCase();
    const reason = String(body.reason || "Consulta").trim().slice(0,120);
    const message = String(body.message || "").trim().slice(0,5000);
    if (name.length < 2 || !validEmail(email) || message.length < 5)
      return json({message:"Revisa los campos del formulario."},400);

    for (const key of ["BREVO_API_KEY","CONTACT_TO","CONTACT_FROM"])
      if (!env[key]) return json({message:"El formulario de contacto todavía no está configurado."},503);

    const payload = {
      sender:{name:env.CONTACT_FROM_NAME || "MovilSimple Web", email:env.CONTACT_FROM},
      to:[{email:env.CONTACT_TO}],
      replyTo:{email,name},
      subject:`MovilSimple · ${reason}`,
      htmlContent:`<html><body style="font-family:Arial,sans-serif">
        <h2>Nueva consulta desde movilsimple.com</h2>
        <p><strong>Nombre:</strong> ${esc(name)}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Motivo:</strong> ${esc(reason)}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${esc(message).replace(/\n/g,"<br>")}</p>
      </body></html>`
    };

    const r = await fetch("https://api.brevo.com/v3/smtp/email", {
      method:"POST",
      headers:{"accept":"application/json","content-type":"application/json","api-key":env.BREVO_API_KEY},
      body:JSON.stringify(payload)
    });
    if (!r.ok) {
      console.error("Brevo contact error", r.status, await r.text());
      return json({message:"No hemos podido enviar el mensaje. Inténtalo de nuevo."},502);
    }
    return json({message:"Mensaje enviado. Gracias por contactar con MovilSimple."},201);
  } catch (e) {
    console.error(e);
    return json({message:"No hemos podido enviar el mensaje. Inténtalo de nuevo."},500);
  }
}
