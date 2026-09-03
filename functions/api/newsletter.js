
const json = (body, status=200) => new Response(JSON.stringify(body), {
  status, headers: {"content-type":"application/json; charset=utf-8","cache-control":"no-store"}
});
const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254;

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    if (body.website) return json({message:"Solicitud recibida."});
    const email = String(body.email || "").trim().toLowerCase();
    const source = body.source === "beta" ? "beta" : "newsletter";
    if (!validEmail(email)) return json({message:"Introduce un correo electrónico válido."},400);

    const required = ["BREVO_API_KEY","BREVO_DOI_TEMPLATE_ID","BREVO_NEWSLETTER_LIST_ID","BREVO_BETA_LIST_ID"];
    for (const key of required) if (!env[key]) return json({message:"La suscripción todavía no está configurada. Inténtalo más tarde."},503);

    const listId = source === "beta" ? Number(env.BREVO_BETA_LIST_ID) : Number(env.BREVO_NEWSLETTER_LIST_ID);
    const payload = {
      email,
      includeListIds:[listId],
      templateId:Number(env.BREVO_DOI_TEMPLATE_ID),
      redirectionUrl:(env.SITE_URL || "https://movilsimple.com") + "/gracias.html"
    };

    const r = await fetch("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
      method:"POST",
      headers:{"accept":"application/json","content-type":"application/json","api-key":env.BREVO_API_KEY},
      body:JSON.stringify(payload)
    });

    if (!r.ok) {
      const text = await r.text();
      console.error("Brevo DOI error", r.status, text);
      return json({message:"Si la dirección es válida, recibirás un correo para confirmar la suscripción."});
    }
    return json({message:"Te hemos enviado un email. Ábrelo y confirma la suscripción."},201);
  } catch (e) {
    console.error(e);
    return json({message:"No hemos podido procesar la solicitud. Inténtalo de nuevo."},500);
  }
}
