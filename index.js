//  ------------ Setup ------------
window.focus;
const SCREENWIDTH = innerWidth;
const SCREENHEIGHT = innerHeight;
let gameCanvas = document.getElementById("gameCanvas");
let c = gameCanvas.getContext("2d"); // Drawing object
gameCanvas.height = 500;
gameCanvas.width = 700;
let spaceship = document.getElementById("spaceship");
// -------------------------------------
// Player variables
let playerX = 100;
let playerY = 100;
let playerWidth = 10;
let playerHeight = 10;
let dx = 7;
let dy = 7;
let directions = {
  left: false,
  right: false,
  up: false,
  down: false,
};

let powerUp = {
  x: 50,
  y: 100,
  width: 30,
  height: 30,
  image: new Image(),
  collected: false,
};

powerUp.image.src = "powerup.png";

function checkCollisions(player, powerUp) {
  if (
    player.x < powerUp.x + powerUp.width &&
    player.x + player.width > powerUp.x &&
    player.y < powerUp.y + powerUp.height &&
    player.y + player.height > powerUp.y
  ) {
    return true;
  }
  return false;
}

class Bullet {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
  }
}

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let bullets = [];

let enemies = [];
// -------------------------------------
// ------------ Player movement ------------
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "a":
      directions.left = true;
      break;
    case "d":
      directions.right = true;
      break;
    case "w":
      directions.up = true;
      break;
    case "s":
      directions.down = true;
      break;
    default:
      break;
  }
});

document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "a":
      directions.left = false;
      break;
    case "d":
      directions.right = false;
      break;
    case "w":
      directions.up = false;
      break;
    case "s":
      directions.down = false;
      break;
    default:
      break;
  }
});

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "e":
      let enemy = new Enemy(Math.floor(Math.random() * 695), 10);
      enemies.push(enemy);
  }
});

let ammo = 0;
setInterval(() => {
  if (ammo < 1) {
    ammo += 1;
  }
}, 500);

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      if (ammo == 1) {
        bullet = new Bullet(playerX - 20, playerY, -10, 0);
        bullets.push(bullet);
        ammo -= 1;
        break;
      }
    case "ArrowRight":
      if (ammo == 1) {
        bullet = new Bullet(playerX + 20, playerY, 10, 0);
        bullets.push(bullet);
        ammo -= 1;
        break;
      }
    case "ArrowUp":
      if (ammo == 1) {
        bullet = new Bullet(playerX, playerY - 20, 0, -10);
        bullets.push(bullet);
        ammo -= 1;
        break;
      }
    case "ArrowDown":
      if (ammo == 1) {
        bullet = new Bullet(playerX, playerY + 20, 0, 10);
        bullets.push(bullet);
        ammo -= 1;
        break;
      }
    default:
      break;
  }
});

function detectCollision(bullet, bulletIndex) {
  for (var enemyIndex = enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
    let enemy = enemies[enemyIndex];
    if (
      bullet.x >= enemy.x &&
      bullet.x <= enemy.x + 35 &&
      bullet.y >= enemy.y &&
      bullet.y <= enemy.y + 35
    ) {
      console.log("hit");
      enemies.splice(enemyIndex, 1);
      bullets.splice(bulletIndex, 1);
    }
  }
}

// -------------------------------------
// ------------ Animation ------------
function animate() {
  requestAnimationFrame(animate); // Run gameloop recursively
  c.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // Clear screen
  // console.log(bullets);

  for (var i = bullets.length - 1; i >= 0; i--) {
    let bullet = bullets[i];
    c.fillStyle = "orange";
    c.fillRect(bullet.x, bullet.y, 10, 10);
    bullet.x += bullet.dx;
    bullet.y += bullet.dy;
    detectCollision(bullet, i);
    ("");
    if (
      bullet.x < 0 ||
      bullet.x > gameCanvas.width ||
      bullet.y < 0 ||
      bullet.y > gameCanvas.height
    ) {
      bullets.splice(i, 1);
    }
  }

  enemies.forEach((enemy) => {
    c.fillStyle = "purple";
    c.fillRect(enemy.x, enemy.y, 35, 35);
  });

  c.fillStyle = "white";
  c.fillRect(playerX, playerY, playerWidth, playerHeight); // Draw player

  if (directions.right && directions.up) {
    playerX += dx / 2;
    playerY += dy / 2;
  } else if (directions.right && directions.down == false) {
    playerX += dx;
  }
  if (directions.left && directions.up) {
    playerX -= dx / 2;
    playerY += dy / 2;
  } else if (directions.left && directions.down == false) {
    playerX -= dx;
  }
  if (directions.right && directions.down) {
    playerX += dx / 2;
    playerY -= dy / 2;
  }
  if (directions.left && directions.down) {
    playerX -= dx / 2;
    playerY -= dy / 2;
  }

  if (directions.up) {
    playerY -= dy;
  }
  if (directions.down) {
    playerY += dy;
  }

  if (playerY <= -5) {
    playerY += dy;
  } else if (playerY >= 495) {
    playerY -= dy;
  } else if (playerX <= -5) {
    playerX += dx;
  } else if (playerX >= 695) {
    playerX -= dx;
  }
}

animate();
