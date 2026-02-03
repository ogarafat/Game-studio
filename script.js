const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 360;
canvas.height = 640;

// Images
const birdImg = new Image();
birdImg.src = "https://i.postimg.cc/rsJBnF59/20260203-223756.png";

const pipeUp = new Image();
pipeUp.src = "https://i.postimg.cc/LX8Vp9P6/20260203-222223.png";

const pipeDown = new Image();
pipeDown.src = "https://i.postimg.cc/XJKmq710/20260203-223653.png";

// UI
const title = document.getElementById("title");
const scoreText = document.getElementById("score");
const restartBtn = document.getElementById("restart");

// Bird
let bird = {
  x: 80,
  y: canvas.height / 2,
  width: 48,
  height: 36,
  gravity: 0.4,
  lift: -7,
  velocity: 0
};

// Pipes
let pipes = [];
let frame = 0;
let score = 0;
let gap = 180;
let speed = 2;

// Game state
let started = false;
let gameOver = false;

// Controls
document.addEventListener("click", jump);
document.addEventListener("touchstart", jump);

function jump() {
  if (!started) {
    started = true;
    title.style.display = "none";
    restartBtn.style.display = "none";
    loop();
  }
  if (!gameOver) {
    bird.velocity = bird.lift;
  }
}

restartBtn.onclick = () => location.reload();

function addPipe() {
  let topHeight = Math.random() * 200 + 50;
  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: canvas.height - topHeight - gap
  });
}

function update() {
  frame++;

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (frame % 120 === 0) addPipe();

  pipes.forEach(p => {
    p.x -= speed;

    if (p.x + 80 < 0) {
      pipes.shift();
      score++;
      scoreText.innerText = "Score: " + score;

      if (score % 5 === 0 && gap > 120) {
        gap -= 10;
        speed += 0.3;
      }
    }

    if (
      bird.x < p.x + 80 &&
      bird.x + bird.width > p.x &&
      (bird.y < p.top || bird.y + bird.height > canvas.height - p.bottom)
    ) {
      endGame();
    }
  });

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    endGame();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  pipes.forEach(p => {
    ctx.drawImage(pipeUp, p.x, p.top - 320, 80, 320);
    ctx.drawImage(pipeDown, p.x, canvas.height - p.bottom, 80, 320);
  });
}

function endGame() {
  gameOver = true;
  title.innerText = "Game Over";
  title.style.display = "block";
  restartBtn.style.display = "inline-block";
}

function loop() {
  if (!gameOver) {
    update();
    draw();
    requestAnimationFrame(loop);
  }
}
