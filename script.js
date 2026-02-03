const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const startText = document.getElementById("startText");
const gameOverUI = document.getElementById("gameOverUI");
const restartBtn = document.getElementById("restartBtn");
const finalScoreEl = document.getElementById("finalScore");

/* FULLSCREEN CANVAS */
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* Images */
const bgImg = new Image();
bgImg.src = "https://i.postimg.cc/qMyDQ7XD/09d433e3-85c1-4190-b276-2ad504a68e0c.jpg";

const birdImg = new Image();
birdImg.src = "https://i.postimg.cc/rsJBnF59/20260203-223756.png";

const pipeUpImg = new Image();
pipeUpImg.src = "https://i.postimg.cc/LX8Vp9P6/20260203-222223.png";

const pipeDownImg = new Image();
pipeDownImg.src = "https://i.postimg.cc/XJKmq710/20260203-223653.png";

/* Game variables */
let gravity = 0.35;
let flapPower = -6;

let pipeGap = 240;
let pipeDistance = 350;
let pipeSpeed = 2;

let bird, pipes, score, started, gameOver;

/* Reset */
function resetGame() {
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
  gameOver = false;

  pipeGap = 240;
  pipeDistance = 350;
  pipeSpeed = 2;

  startText.classList.remove("hidden");
  gameOverUI.classList.add("hidden");
}

resetGame();

/* Spawn pipe */
function spawnPipe() {
  const topHeight = Math.random() * (canvas.height * 0.4) + 80;
  pipes.push({
    x: canvas.width + pipeDistance,
    top: topHeight,
    passed: false
  });
}

/* Update */
function update() {
  if (!started || gameOver) return;

  bird.v += gravity;
  bird.y += bird.v;

  if (bird.y < 0 || bird.y + bird.h > canvas.height) endGame();

  pipes.forEach(p => {
    p.x -= pipeSpeed;

    const hitTop =
      bird.x < p.x + 70 &&
      bird.x + bird.w > p.x &&
      bird.y < p.top;

    const hitBottom =
      bird.x < p.x + 70 &&
      bird.x + bird.w > p.x &&
      bird.y + bird.h > p.top + pipeGap;

    if (hitTop || hitBottom) endGame();

    if (!p.passed && p.x + 70 < bird.x) {
      p.passed = true;
      score++;

      if (pipeGap > 140) pipeGap -= 5;
      pipeSpeed += 0.05;
    }
  });

  pipes = pipes.filter(p => p.x > -100);
}

/* Draw */
function draw() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  pipes.forEach(p => {
    ctx.drawImage(pipeUpImg, p.x, 0, 70, p.top);
    ctx.drawImage(
      pipeDownImg,
      p.x,
      p.top + pipeGap,
      70,
      canvas.height - p.top - pipeGap
    );
  });

  ctx.drawImage(birdImg, bird.x, bird.y, bird.w, bird.h);
}

/* Loop */
let lastPipe = 0;
function loop(time) {
  if (started && !gameOver && time - lastPipe > 1500) {
    spawnPipe();
    lastPipe = time;
  }

  update();
  draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* Controls */
function flap() {
  if (gameOver) return;
  started = true;
  startText.classList.add("hidden");
  bird.v = flapPower;
}

canvas.addEventListener("touchstart", flap);
canvas.addEventListener("mousedown", flap);
document.addEventListener("keydown", e => {
  if (e.code === "Space") flap();
});

/* Game Over */
function endGame() {
  gameOver = true;
  finalScoreEl.textContent = score;
  gameOverUI.classList.remove("hidden");
}

restartBtn.onclick = resetGame;
