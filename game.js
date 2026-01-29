const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let bike = {
  x: canvas.width / 2,
  y: canvas.height - 100,
  width: 30,
  height: 50,
  speed: 5
};

let obstacles = [];
let score = 0;

function spawnObstacle() {
  obstacles.push({
    x: Math.random() * canvas.width,
    y: -50,
    size: 30
  });
}

setInterval(spawnObstacle, 1000);

function update() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // road
  ctx.fillStyle = "#333";
  ctx.fillRect(canvas.width/2 - 80, 0, 160, canvas.height);

  // bike
  ctx.fillStyle = "yellow";
  ctx.fillRect(bike.x, bike.y, bike.width, bike.height);

  // obstacles
  ctx.fillStyle = "red";
  obstacles.forEach(o => {
    o.y += 6;
    ctx.fillRect(o.x, o.y, o.size, o.size);

    // collision
    if (
      o.x < bike.x + bike.width &&
      o.x + o.size > bike.x &&
      o.y < bike.y + bike.height &&
      o.y + o.size > bike.y
    ) {
      alert("Game Over! Score: " + score);
      location.reload();
    }
  });

  score++;
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 20, 30);

  requestAnimationFrame(update);
}

document.addEventListener("touchmove", e => {
  bike.x = e.touches[0].clientX - bike.width/2;
});

update();
