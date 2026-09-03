
const $ = (s, root=document) => root.querySelector(s);

async function postJSON(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: {"Content-Type":"application/json","Accept":"application/json"},
    body: JSON.stringify(payload)
  });
  let data = {};
  try { data = await res.json(); } catch {}
  if (!res.ok) throw new Error(data.message || "No se pudo completar la solicitud.");
  return data;
}

function setStatus(node, message, kind="") {
  if (!node) return;
  node.textContent = message;
  node.className = "status" + (kind ? " " + kind : "");
}

document.querySelectorAll("[data-subscribe]").forEach(form => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = $(".status", form);
    const button = $("button[type=submit]", form);
    const fd = new FormData(form);
    if (fd.get("website")) return;
    const consent = form.querySelector('input[name="consent"]');
    if (consent && !consent.checked) {
      setStatus(status, "Necesitamos tu consentimiento para enviarte novedades.", "error");
      return;
    }
    setStatus(status, "Procesando…");
    button.disabled = true;
    try {
      const data = await postJSON("/api/newsletter", {
        email: String(fd.get("email") || "").trim(),
        source: form.dataset.source || "newsletter",
        website: String(fd.get("website") || "")
      });
      setStatus(status, data.message || "Revisa tu correo para confirmar la suscripción.", "ok");
      form.reset();
    } catch (err) {
      setStatus(status, err.message, "error");
    } finally { button.disabled = false; }
  });
});

const contact = $("[data-contact]");
if (contact) {
  contact.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = $(".status", contact);
    const button = $("button[type=submit]", contact);
    const fd = new FormData(contact);
    if (fd.get("website")) return;
    if (!contact.querySelector('input[name="privacy"]').checked) {
      setStatus(status, "Debes aceptar la política de privacidad para enviar el mensaje.", "error");
      return;
    }
    setStatus(status, "Enviando…");
    button.disabled = true;
    try {
      const data = await postJSON("/api/contact", {
        name: String(fd.get("name") || "").trim(),
        email: String(fd.get("email") || "").trim(),
        reason: String(fd.get("reason") || "").trim(),
        message: String(fd.get("message") || "").trim(),
        website: String(fd.get("website") || "")
      });
      setStatus(status, data.message || "Mensaje enviado. Gracias.", "ok");
      contact.reset();
    } catch (err) {
      setStatus(status, err.message, "error");
    } finally { button.disabled = false; }
  });
}
