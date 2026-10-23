const IA_URL = "";

const $ = id => document.getElementById(id);
let historial = [];
let contextoActual = "";

function agregarBurbuja(tipo, texto) {
  const d = document.createElement("div");
  d.className = "burbuja " + tipo;
  d.textContent = texto;
  $("chat").appendChild(d);
  $("chat").scrollTop = $("chat").scrollHeight;
  return d;
}

function fijarContexto(texto) {
  contextoActual = texto;
  $("contexto").hidden = !texto;
  $("contexto-texto").textContent = texto ? "Tema actual: " + texto : "";
}

async function preguntarIA(msgs, contexto) {
  if (!IA_URL) {
    return "Eja malas noticias, no puedo conectar con la ia que cree XDDDDDD mi laptop casi explota";
  }
  const r = await fetch(IA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mensajes: msgs, contexto: contexto })
  });
  if (!r.ok) throw new Error("Error " + r.status);
  const datos = await r.json();
  return datos.respuesta;
}

async function enviarDuda(e) {
  e.preventDefault();
  const input = $("texto-chat");
  const texto = input.value.trim();
  if (!texto) return;
  input.value = "";
  agregarBurbuja("yo", texto);
  historial.push({ rol: "user", texto: texto });

  $("btn-enviar").disabled = true;
  const pensando = agregarBurbuja("ia", "Pensando…");
  try {
    const respuesta = await preguntarIA(historial, contextoActual);
    pensando.textContent = respuesta;
    historial.push({ rol: "assistant", texto: respuesta });
  } catch (err) {
    pensando.textContent = "No pude conectar con la IA eja xd";
  }
  $("btn-enviar").disabled = false;
  $("chat").scrollTop = $("chat").scrollHeight;
}

$("quitar-contexto").addEventListener("click", () => fijarContexto(""));
$("form-chat").addEventListener("submit", enviarDuda);

// Si venimos del simulacro, la pregunta llega en la dirección (?pregunta=...)
const pregunta = new URLSearchParams(window.location.search).get("pregunta");
if (pregunta) fijarContexto(pregunta);

agregarBurbuja("ia", "Que ondaaaa, cual es tu duda?");
if (!IA_URL) {
  agregarBurbuja("aviso", "Cual es tu duda?:");
}