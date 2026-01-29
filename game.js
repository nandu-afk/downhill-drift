const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// GAME STATE
let speed = 4;
let gravity = 0.8;
let jumpForce = -14;
let isJumping = false;
let score = 0;

// BIKE
let bike = {
  x: canvas.width / 2,
  y: canvas.height - 120,
  w: 30,
  h: 50,
  vy: 0
};

// ROAD CURVE
let roadOffset = 0;
let curveDir = 1;

// OBSTACLES
let obstacles = [];

function spawnObstacle() {
  obstacles.push({
    x: canvas.width / 2 + (Math.random() * 120 - 60),
    y: -40,
    size: 30
  });
}
setInterval(spawnObstacle, 1200);

// CONTROLS
canvas.addEventListener("touchstart", () => {
  if (!isJumping) {
    bike.vy = jumpForce;
    isJumping = true;
  }
});

canvas.addEventListener("touchmove", e => {
  bike.x = e.touches[0].clientX - bike.w / 2;
});

// GAME LOOP
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // SPEED UP
  speed += 0.002;

  // ROAD CURVE LOGIC
  roadOffset += curveDir * 0.5;
  if (Math.abs(roadOffset) > 60) curveDir *= -1;

  // DRAW ROAD
  ctx.fillStyle = "#444";
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 100 + roadOffset, 0);
  ctx.lineTo(canvas.width / 2 + 100 + roadOffset, 0);
  ctx.lineTo(canvas.width / 2 + 140, canvas.height);
  ctx.lineTo(canvas.width / 2 - 140, canvas.height);
  ctx.fill();

  // BIKE PHYSICS
  bike.vy += gravity;
  bike.y += bike.vy;
  if (bike.y >= canvas.height - 120) {
    bike.y = canvas.height - 120;
    bike.vy = 0;
    isJumping = false;
  }

  // DRAW BIKE
  ctx.fillStyle = "yellow";
  ctx.fillRect(bike.x, bike.y, bike.w, bike.h);

  // OBSTACLES
  ctx.fillStyle = "red";
  obstacles.forEach(o => {
    o.y += speed;
    ctx.fillRect(o.x, o.y, o.size, o.size);

    // COLLISION
    if (
      o.x < bike.x + bike.w &&
      o.x + o.size > bike.x &&
      o.y < bike.y + bike.h &&
      o.y + o.size > bike.y
    ) {
      alert("Crash! Score: " + score);
      location.reload();
    }
  });

  // SCORE
  score++;
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText("Speed: " + speed.toFixed(1), 20, 30);
  ctx.fillText("Score: " + score, 20, 50);

  requestAnimationFrame(update);
}

update();
