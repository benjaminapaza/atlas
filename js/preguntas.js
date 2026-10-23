function rand(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function pick(arr) { return arr[rand(0, arr.length - 1)]; }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function gcd(a, b) { return b ? gcd(b, a % b) : Math.abs(a); }
function lcm(a, b) { return a * b / gcd(a, b); }
function fr(n, d) {
  const g = gcd(n, d);
  n /= g; d /= g;
  return d === 1 ? String(n) : n + "/" + d;
}
function armar(tema, pregunta, correcta, candidatos, explicacion) {
  const malas = [...new Set(candidatos)].filter(x => x !== correcta).slice(0, 3);
  if (malas.length < 3) return null;
  const opciones = shuffle([correcta, ...malas]);
  return { tema, pregunta, opciones, correcta: opciones.indexOf(correcta), explicacion };
}
function genFracciones() {
  const b = pick([2, 3, 4, 5, 6, 8]), d = pick([2, 3, 4, 5, 6, 8]);
  const a = rand(1, b - 1), c = rand(1, d - 1);
  const m = lcm(b, d);
  const num = a * (m / b) + c * (m / d);
  const res = fr(num, m);
  const cand = [fr(a + c, b + d), fr(a + c, Math.max(b, d)), fr(a * c, b * d), fr(a + c, b * d)];
  const expl = `Se usa el denominador común ${m}: ${a * m / b}/${m} + ${c * m / d}/${m} = ${num}/${m}, que simplificado es ${res}.`;
  return armar("Fracciones", `¿Cuánto es ${a}/${b} + ${c}/${d}?`, res, cand, expl);
}
function genPorcentajes() {
  const n = pick([40, 60, 80, 120, 200, 300, 400, 500]);
  const p = pick([5, 10, 15, 20, 25, 30, 40, 50, 75]);
  const res = n * p / 100;
  const cand = [res * 2, res + 10, res + p, res - 1, res + 1].map(String);
  const expl = `El ${p}% de ${n} se calcula como ${n} × ${p} / 100 = ${res}.`;
  return armar("Porcentajes", `¿Cuál es el ${p}% de ${n}?`, String(res), cand, expl);
}
function genEcuaciones() {
  const x = rand(1, 12), a = rand(2, 9), b = rand(1, 20);
  const c = a * x + b;
  const cand = [x + 1, x - 1, x + 2, x * 2].map(String);
  const expl = `Se resta ${b} en ambos lados: ${a}x = ${c - b}. Luego se divide entre ${a}: x = ${x}.`;
  return armar("Ecuaciones", `Resuelve: ${a}x + ${b} = ${c}. ¿Cuánto vale x?`, String(x), cand, expl);
}
function genArea() {
  const l = rand(3, 15), w = rand(2, 12);
  const A = l * w;
  const cand = [2 * (l + w), l + w, A + l, A - w].map(v => v + " cm²");
  const expl = `El área de un rectángulo es largo × ancho: ${l} × ${w} = ${A} cm².`;
  return armar("Geometría", `Un rectángulo mide ${l} cm de largo y ${w} cm de ancho. ¿Cuál es su área?`, A + " cm²", cand, expl);
}
function nuevaPrueba() {
  const gens = [genFracciones, genPorcentajes, genEcuaciones, genArea];
  const orden = shuffle(gens);
  orden.push(pick(gens));
  const preguntas = [];
  const vistas = new Set();
  for (const g of orden) {
    let q = null, intentos = 0;
    while (intentos++ < 50) {
      q = g();
      if (q && !vistas.has(q.pregunta)) break;
      q = null;
    }
    if (q) { vistas.add(q.pregunta); preguntas.push(q); }
  }
  return preguntas;
}