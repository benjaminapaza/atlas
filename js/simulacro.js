const $ = id => document.getElementById(id);
let preguntas = [];
let respondidas = [];
let aciertos = 0;

function textoPregunta(q) {
  return q.pregunta + " (Opciones: " + q.opciones.map((o, i) => "ABCD"[i] + ") " + o).join(", ") + ")";
}
function pintarPrueba() {
  const cont = $("lista-preguntas");
  cont.innerHTML = "";
  $("resultado").innerHTML = "";
  preguntas.forEach((q, idx) => {
    const card = document.createElement("div");
    card.className = "pregunta";

    const tema = document.createElement("span");
    tema.className = "tema";
    tema.textContent = q.tema;
    card.appendChild(tema);

    const h = document.createElement("h3");
    h.textContent = (idx + 1) + ". " + q.pregunta;
    card.appendChild(h);

    const botones = [];
    q.opciones.forEach((op, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "opcion";
      b.textContent = "ABCD"[i] + ") " + op;
      b.addEventListener("click", () => responder(idx, i, botones, card));
      botones.push(b);
      card.appendChild(b);
    });
    cont.appendChild(card);
  });
  actualizarProgreso();
}
function responder(idx, elegida, botones, card) {
  if (respondidas[idx] !== undefined) return;
  const q = preguntas[idx];
  respondidas[idx] = elegida;
  const acerto = elegida === q.correcta;
  if (acerto) aciertos++;

  botones.forEach((b, i) => {
    b.disabled = true;
    if (i === q.correcta) b.classList.add("correcta");
    else if (i === elegida) b.classList.add("incorrecta");
  });
  const caja = document.createElement("div");
  caja.className = "explicacion";
  const v = document.createElement("div");
  v.className = "veredicto " + (acerto ? "ok" : "mal");
  v.textContent = acerto ? "¡Correcto!" : "Incorrecto. La respuesta correcta es " + "ABCD"[q.correcta] + ".";
  const e = document.createElement("div");
  e.textContent = q.explicacion;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn sec";
  btn.textContent = "Preguntar a la IA sobre esta pregunta";
  btn.addEventListener("click", () => {
    // Abre la página de la IA llevando la pregunta como contexto
    window.location.href = "ia.html?pregunta=" + encodeURIComponent(textoPregunta(q));
  });
  caja.append(v, e, btn);
  card.appendChild(caja);

  actualizarProgreso();
  if (respondidas.filter(r => r !== undefined).length === preguntas.length) mostrarResultado();
}
function actualizarProgreso() {
  const hechas = respondidas.filter(r => r !== undefined).length;
  $("progreso").textContent = hechas + " de " + preguntas.length + " respondidas";
}
function mostrarResultado() {
  const r = $("resultado");
  r.innerHTML = "";
  const caja = document.createElement("div");
  caja.className = "resultado";
  const t = document.createElement("div");
  t.textContent = "Tu resultado";
  const n = document.createElement("div");
  n.className = "nota";
  n.textContent = aciertos + " / " + preguntas.length;
  const m = document.createElement("div");
  m.textContent = aciertos === preguntas.length ? "¡Perfecto!" :
                  aciertos >= 3 ? "¡Muy bien! Repasa las que fallaste." :
                  "Sigue practicando, ¡tú puedes!";
  const b = document.createElement("button");
  b.type = "button";
  b.className = "btn";
  b.textContent = "Hacer otro simulacro";
  b.addEventListener("click", iniciarPrueba);
  caja.append(t, n, m, b);
  r.appendChild(caja);
  r.scrollIntoView({ behavior: "smooth", block: "center" });
}
function iniciarPrueba() {
  preguntas = nuevaPrueba();
  respondidas = [];
  aciertos = 0;
  pintarPrueba();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
$("btn-nueva").addEventListener("click", iniciarPrueba);
iniciarPrueba();