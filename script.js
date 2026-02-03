const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const startText = document.getElementById("startText");
const gameOverUI = document.getElementById("gameOverUI");
const restartBtn = document.getElementById("restartBtn");
const finalScore = document.getElementById("finalScore");

/* Resize */
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* Images */
const bg = new Image();
bg.src = "https://i.postimg.cc/qMyDQ7XD/09d433e3-85c1-4190-b276-2ad504a68e0c.jpg";

const birdImg = new Image();
birdImg.src = "https://i.postimg.cc/rsJBnF59/20260203-223756.png";

const pipeUp = new Image();
pipeUp.src = "https://i.postimg.cc/LX8Vp9P6/20260203-222223.png";

const pipeDown = new Image();
pipeDown.src = "https://i.postimg.cc/XJKmq710/20260203-223653.png";

/* Game vars */
let bird, pipes, score, started, over;
let gravity = 0.35;
let flap = -6;
let gap = 240;
let speed = 2;

function reset() {
  bird = {
    x: canvas.width * 0.25,
    y: canvas.height / 2,
    w: 55,
    h: 45,
    v: 0
  };
  pipes = [];
  score = 0;
  started = false;
  over = false;
  gap = 240;
  speed = 2;

  startText.classList.remove("hidden");
  gameOverUI.classList.add("hidden");
}
reset();

/* Pipes */
function addPipe() {
  const top = Math.random() * (canvas.height * 0.4) + 80;
  pipes.push({ x: canvas.width, top, passed: false });
}

/* Update */
function update() {
  if (!started || over) return;

  bird.v += gravity;
  bird.y += bird.v;

  if (bird.y < 0 || bird.y + bird.h > canvas.height) end();

  pipes.forEach(p => {
    p.x -= speed;

    const hit =
      bird.x < p.x + 70 &&
      bird.x + bird.w > p.x &&
      (bird.y < p.top || bird.y + bird.h > p.top + gap);

    if (hit) end();

    if (!p.passed && p.x + 70 < bird.x) {
      p.passed = true;
      score++;
      if (gap > 140) gap -= 5;
      speed += 0.05;
    }
  });

  pipes = pipes.filter(p => p.x > -100);
}

/* Draw */
function draw() {
  // Fallback background
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (bg.complete) {
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
  }

  pipes.forEach(p => {
    ctx.drawImage(pipeUp, p.x, 0, 70, p.top);
    ctx.drawImage(pipeDown, p.x, p.top + gap, 70, canvas.height);
  });

  ctx.drawImage(birdImg, bird.x, bird.y, bird.w, bird.h);
}

/* Loop */
let last = 0;
function loop(t) {
  if (started && !over && t - last > 1500) {
    addPipe();
    last = t;
  }
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();

/* Controls */
function play() {
  if (over) return;
  started = true;
  startText.classList.add("hidden");
  bird.v = flap;
}

canvas.addEventListener("mousedown", play);
canvas.addEventListener("touchstart", play);
document.addEventListener("keydown", e => {
  if (e.code === "Space") play();
});

function end() {
  over = true;
  finalScore.textContent = score;
  gameOverUI.classList.remove("hidden");
}

restartBtn.onclick = reset;
