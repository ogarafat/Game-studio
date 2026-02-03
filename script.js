* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* FULL SCREEN */
html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* ONLY GAME – NO BACKGROUND */
body {
  background: none;
}

/* Canvas fullscreen */
canvas {
  display: block;
  width: 100vw;
  height: 100vh;
}

/* Start Text */
#startText {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 28px;
  color: yellow;
  font-weight: bold;
  text-shadow: 0 0 10px black;
  animation: pulse 1.4s infinite;
}

@keyframes pulse {
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
}

/* Game Over UI */
#gameOverUI {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
}

#gameOverUI h2 {
  font-size: 36px;
  margin-bottom: 10px;
}

#gameOverUI button {
  margin-top: 15px;
  padding: 10px 25px;
  font-size: 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.hidden {
  display: none;
}
