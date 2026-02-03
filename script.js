const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Home menu
const homeMenu = document.getElementById("homeMenu");
const startGameBtn = document.getElementById("startGameBtn");

// Game wrapper
const gameWrapper = document.getElementById("gameWrapper");
const startText = document.getElementById("startText");
const retryBtnContainer = document.getElementById("retryBtnContainer");
const retryBtn = document.getElementById("retryBtn");
const scoreEl = document.getElementById("scoreRight");
const scoreLeftEl = document.getElementById("scoreLeft");

/* Images */
const bgImg = new Image();
bgImg.src = "https://i.postimg.cc/qMyDQ7XD/09d433e3-85c1-4190-b276-2ad504a68e0c.jpg";

const birdImg = new Image();
birdImg.src = "https://i.postimg.cc/rsJBnF59/20260203-223756.png";

const pipeUpImg = new Image();
pipeUpImg.src = "https://i.postimg.cc/LX8Vp9P6/20260203-222223.png";

const pipeDownImg = new Image();
pipeDownImg.src = "https://i.postimg.cc/XJKmq710/20260203-223653.png";

/* Game Settings */
let GRAVITY = 0.35;
let FLAP = -6;
const PIPE_WIDTH = 60;

let PIPE_GAP = 220;       // start bigger
let PIPE_DISTANCE = 320;  // start farther
let PIPE_SPEED = 2.0;

const MIN_TOP_HEIGHT = 80;
const MAX_TOP_HEIGHT = 300;

const GAP_DECREASE = 0.4;
const DISTANCE_DECREASE = 1.5;
const SPEED_INCREASE = 0.02;

let pipes = [];
let lastPipeX = 0;

let started = false;
let gameOver = false;
let score = 0;

const bird = { x: 80, y: canvas.height/2, width: 50, height: 45, velocity: 0 }; // bigger bird

/* Reset game */
function resetGame() {
  bird.y = canvas.height/2;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  PIPE_GAP = 220;
  PIPE_DISTANCE = 320;
  PIPE_SPEED = 2.0;
  lastPipeX = 0;
  scoreEl.textContent = score;
  scoreLeftEl.textContent = score;
  started = false;
  gameOver = false;
  startText.classList.remove("hidden");
  retryBtnContainer.classList.add("hidden");
}

/* Spawn pipe */
function spawnPipe() {
  const topHeight = Math.random()*(MAX_TOP_HEIGHT-MIN_TOP_HEIGHT)+MIN_TOP_HEIGHT;
  const bottomHeight = canvas.height - topHeight - PIPE_GAP;

  pipes.push({
    x: lastPipeX + PIPE_DISTANCE,
    top: topHeight,
    bottom: bottomHeight,
    passed: false
  });

  lastPipeX += PIPE_DISTANCE;
}

/* Pipe passed */
function onPipePassed() {
  score++;
  scoreEl.textContent = score;
  scoreLeftEl.textContent = score;

  // Gradual difficulty
  if (PIPE_GAP>120) PIPE_GAP -= GAP_DECREASE;
  if (PIPE_DISTANCE>180) PIPE_DISTANCE -= DISTANCE_DECREASE;
  if (PIPE_SPEED<5) PIPE_SPEED += SPEED_INCREASE;
}

/* Update */
function update() {
  if (!started || gameOver) return;

  bird.velocity += GRAVITY;
  bird.y += bird.velocity;

  if (bird.y <=0 || bird.y+bird.height >= canvas.height) endGame();

  pipes.forEach(p=>{
    p.x -= PIPE_SPEED;

    if (!p.passed && p.x + PIPE_WIDTH < bird.x) {
      p.passed = true;
      onPipePassed();
    }

    const hitTop = bird.x < p.x+PIPE_WIDTH && bird.x+bird.width>p.x && bird.y < p.top;
    const hitBottom = bird.x < p.x+PIPE_WIDTH && bird.x+bird.width>p.x && bird.y+bird.height > canvas.height - p.bottom;
    if (hitTop || hitBottom) endGame();
  });

  pipes = pipes.filter(p => p.x + PIPE_WIDTH >0);
}

/* Draw */
function draw() {
  ctx.drawImage(bgImg,0,0,canvas.width,canvas.height);

  pipes.forEach(p=>{
    ctx.drawImage(pipeUpImg,p.x,0,PIPE_WIDTH,p.top); // upper
    ctx.drawImage(pipeDownImg,p.x,canvas.height-p.bottom,PIPE_WIDTH,p.bottom); // lower
  });

  ctx.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
}

/* Game loop */
let lastPipeTime = 0;
function gameLoop(time){
  if(started && !gameOver && time - lastPipeTime > 1500){
    spawnPipe();
    lastPipeTime = time;
  }
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

/* Controls */
function flap(){
  if(gameOver) return;
  started = true;
  startText.classList.add("hidden");
  bird.velocity = FLAP;
}

document.addEventListener("keydown",e=>{ if(e.code==="Space") flap(); });
canvas.addEventListener("mousedown", flap);
retryBtn.addEventListener("click", resetGame);

/* Start Game Button from Home Menu */
startGameBtn.addEventListener("click", ()=>{
  homeMenu.classList.add("hidden");
  gameWrapper.classList.remove("hidden");
  resetGame();
});

resetGame();
requestAnimationFrame(gameLoop);

function endGame(){
  gameOver = true;
  retryBtnContainer.classList.remove("hidden");
}
