// ======= Основні змінні ======= 
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spin");
const itemsInput = document.getElementById("items");
const result = document.getElementById("result");

let sectors = [];       // Масив секторів (назва + колір)
let angle = 0;          // Поточний кут
let spinning = false;   // Чи обертається зараз
let spinSpeed = 0;      // Поточна швидкість

// ======= Функція створення унікальних кольорів =======
function getUniqueColor(index, total) {
  const hue = Math.floor((360 / total) * index);
  return `hsl(${hue}, 85%, 60%)`;
}

// ======= Оновлення колеса (автоматично при зміні тексту) =======
function updateWheel() {
  const values = itemsInput.value.split("\n").filter(v => v.trim() !== "");
  sectors = values.map((v, i) => ({
    label: v.trim(),
    color: getUniqueColor(i, values.length)
  }));
  drawWheel();
}

// ======= Малювання колеса =======
function drawWheel() {
  const radius = canvas.width / 2;
  const arc = (2 * Math.PI) / sectors.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  sectors.forEach((sector, i) => {
    const start = arc * i;

    // Сектор
    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, start, start + arc);
    ctx.fill();

    // Текст
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(start + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = "16px Segoe UI";
    ctx.fillText(sector.label, radius - 10, 5);
    ctx.restore();
  });
}

// ======= Обертання колеса =======
function spin() {
  if (spinning || sectors.length === 0) return;
  spinning = true;
  // Початкова швидкість трохи менша, але оберт довший
  spinSpeed = Math.random() * 0.25 + 0.35;
  requestAnimationFrame(rotateWheel);
}

// ======= Анімація обертання =======
function rotateWheel() {
  angle += spinSpeed;
  spinSpeed *= 0.987; // повільніше уповільнення → довше обертання

  drawRotatedWheel();

  if (spinSpeed > 0.002) {
    requestAnimationFrame(rotateWheel);
  } else {
    spinning = false;
    selectWinner();
  }
}

// ======= Малювання оберненого колеса =======
function drawRotatedWheel() {
  const radius = canvas.width / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(radius, radius);
  ctx.rotate(angle);
  ctx.translate(-radius, -radius);
  drawWheel();
  ctx.restore();

  // Червоний покажчик зверху
  ctx.beginPath();
  ctx.moveTo(radius - 10, 0);
  ctx.lineTo(radius + 10, 0);
  ctx.lineTo(radius, 30);
  ctx.fillStyle = "#dc2626";
  ctx.fill();
}



// ======= Обробники подій =======

// При зміні тексту — оновлюємо колесо автоматично
itemsInput.addEventListener("input", updateWheel);

// Кнопка "Крутити"
spinBtn.addEventListener("click", spin);

// Початкове малювання
updateWheel();
