const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const step2 = document.getElementById("step2");
const result = document.getElementById("result");
const msg = document.getElementById("msg");
const submsg = document.getElementById("submsg");

let noTries = 0;

function ensureCardPositioning() {
  const card = document.querySelector(".card");
  const style = getComputedStyle(card);
  if (style.position === "static") card.style.position = "relative";
  return card;
}

function moveNoButton() {
  const card = ensureCardPositioning();
  const btnRow = document.getElementById("btnRow");

  // crecer "Sí"
  noTries++;
  const grow = Math.min(1 + noTries * 0.09, 1.8);
  yesBtn.style.transform = `scale(${grow})`;

  const padding = 8;

  const rowRect = btnRow.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();

  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;

  // rango X dentro del row
  const maxX = Math.max(padding, rowRect.width - btnW - padding);
  // un rango Y pequeño para que se vea natural
  const maxY = 24;

  const x = padding + Math.random() * (maxX - padding);
  const y = Math.random() * maxY;

  // posicion absoluta relativo a card
  noBtn.style.position = "absolute";
  noBtn.style.left = `${x}px`;

  // top: donde está el row dentro de la card + y
  const rowTop = btnRow.offsetTop;
  noBtn.style.top = `${rowTop + y}px`;
}

// Bloqueos
function blockEvent(e){
  e.preventDefault();
  e.stopPropagation();
}
function moveNow(e){
  if (e) blockEvent(e);
  moveNoButton();
}

// PC: se acerca / intenta tocar
noBtn.addEventListener("mouseenter", moveNow);
noBtn.addEventListener("mousedown", moveNow, true);

// Móvil: toca
noBtn.addEventListener("touchstart", moveNow, { passive:false });

// Extra: bloquear click sí o sí
noBtn.addEventListener("click", blockEvent, true);
noBtn.addEventListener("focus", () => noBtn.blur());
noBtn.setAttribute("tabindex", "-1");

// Paso 1 -> Paso 2
yesBtn.addEventListener("click", () => {
  step2.classList.remove("hidden");
  result.classList.add("hidden");
  msg.textContent = "";
  submsg.textContent = "";

  // desactivar NO después del sí (opcional)
  noBtn.disabled = true;
  noBtn.style.opacity = "0.5";
  noBtn.style.cursor = "not-allowed";
});

// Elegir día
const waBtn = document.getElementById("waBtn");

// ⚠️ CAMBIA ESTE NÚMERO POR EL TUYO
const phoneNumber = "593 0987352663"; 
// ejemplo Ecuador: 593987654321 (sin + ni espacios)

document.querySelectorAll(".opt").forEach(btn => {
  btn.addEventListener("click", () => {

    const day = btn.dataset.day;

    step2.classList.add("hidden");
    result.classList.remove("hidden");

    msg.textContent = "¡Ya quedamos! 💖";
    submsg.innerHTML = `Entonces salimos el <b>${day}</b> 💌✨`;

    // mensaje automático
    const text = `Holaaa, aceptaste 🥺💖 entonces salimos el ${day} ✨`;

    // crear link WhatsApp
    const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;

    waBtn.href = waLink;

    startConfetti();
    setTimeout(stopConfetti, 2600);
  });
});



// ===== Confeti =====
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let confetti = [];
let anim = null;

function resize(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
addEventListener("resize", resize);
resize();

function startConfetti(){
  if (anim) return;

  confetti = Array.from({length: 220}, () => ({
    x: Math.random()*canvas.width,
    y: -20 - Math.random()*canvas.height,
    r: 2 + Math.random()*5,
    vx: -1.4 + Math.random()*2.8,
    vy: 2.2 + Math.random()*4.6,
    rot: Math.random()*Math.PI,
    vr: -0.12 + Math.random()*0.24,
  }));

  loop();
}

function loop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  for (const p of confetti){
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillRect(-p.r, -p.r, p.r*2, p.r*2);
    ctx.restore();

    if (p.y > canvas.height + 30) p.y = -20;
    if (p.x < -30) p.x = canvas.width + 30;
    if (p.x > canvas.width + 30) p.x = -30;
  }

  anim = requestAnimationFrame(loop);
}

function stopConfetti(){
  if (!anim) return;
  cancelAnimationFrame(anim);
  anim = null;
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

// =========================
// CORAZONES FLOTANDO
// =========================

const heartsContainer = document.querySelector(".floating-hearts");

function createHeart(){
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = "💗";

  heart.style.left = Math.random()*100 + "vw";
  heart.style.animationDuration = 4 + Math.random()*3 + "s";

  heartsContainer.appendChild(heart);

  setTimeout(() => heart.remove(), 7000);
}

setInterval(createHeart, 450);
