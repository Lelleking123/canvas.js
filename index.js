window.focus;
const SCREENWIDTH = innerWidth;
const SCREENHEIGHT = innerHeight;
const gameCanvas = document.getElementById("gameCanvas");
const c = gameCanvas.getContext("2d");
gameCanvas.height = 650;
gameCanvas.width = 850;
let spaceship = document.getElementById("spaceship");
let score = 0;
let wave = 0;
let playerX = 425;
let playerY = 325;
let dx = 9;
let dy = 9;
let directions = {
  left: false,
  right: false,
  up: false,
  down: false,
};
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
      for (let i = 0; i <= 5; i++) {
        let wall = Math.random();
        if (wall < 1 / 4) {
          let enemy = new Enemy(Math.floor(Math.random() * 845), -50);
          enemies.push(enemy);
        } else if (wall < 2 / 4) {
          let enemy = new Enemy(900, Math.floor(Math.random() * 645));
          enemies.push(enemy);
        } else if (wall < 3 / 4) {
          let enemy = new Enemy(Math.floor(Math.random() * 845), 700);
          enemies.push(enemy);
        } else if (wall < 1) {
          let enemy = new Enemy(-50, Math.floor(Math.random() * 645));
          enemies.push(enemy);
        }
      }
  }
});

function enemySpawner() {
  let spawnRate = 5750;
  wave = 0;

  function spawnEnemies() {
    for (let i = 0; i <= 4; i++) {
      let wall = Math.random();
      if (wall < 1 / 4) {
        let enemy = new Enemy(Math.floor(Math.random() * 845), -50);
        enemies.push(enemy);
      } else if (wall < 2 / 4) {
        let enemy = new Enemy(900, Math.floor(Math.random() * 645));
        enemies.push(enemy);
      } else if (wall < 3 / 4) {
        let enemy = new Enemy(Math.floor(Math.random() * 845), 700);
        enemies.push(enemy);
      } else if (wall < 1) {
        let enemy = new Enemy(-50, Math.floor(Math.random() * 645));
        enemies.push(enemy);
      }
    }

    spawnRate -= 325;
    wave += 1;

    if (spawnRate > 0) {
      setTimeout(spawnEnemies, spawnRate);
    }
  }

  spawnEnemies();
}
enemySpawner();

let ammo = 0;
setInterval(() => {
  if (ammo < 1) {
    ammo += 1;
  }
}, 300);

document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      if (ammo == 1) {
        bullet = new Bullet(playerX - 20, playerY, -30, 0);
        bullets.push(bullet);
        spaceship.style.transform = "rotate(270deg)";
        ammo -= 1;
      }
      break;
    case "ArrowRight":
      if (ammo == 1) {
        bullet = new Bullet(playerX + 20, playerY, 30, 0);
        bullets.push(bullet);
        spaceship.style.transform = "rotate(90deg)";
        ammo -= 1;
      }
      break;
    case "ArrowUp":
      if (ammo == 1) {
        bullet = new Bullet(playerX, playerY - 40, 0, -30);
        bullets.push(bullet);
        spaceship.style.transform = "rotate(0deg)";
        ammo -= 1;
      }
      break;
    case "ArrowDown":
      if (ammo == 1) {
        bullet = new Bullet(playerX, playerY + 40, 0, 30);
        bullets.push(bullet);
        spaceship.style.transform = "rotate(180deg)";
        ammo -= 1;
      }
      break;
    default:
      break;
  }
});

function detectCollision(bullet, bulletIndex, score) {
  for (var enemyIndex = enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
    let enemy = enemies[enemyIndex];
    if (
      bullet.x >= enemy.x - 15 &&
      bullet.x <= enemy.x + 65 &&
      bullet.y >= enemy.y - 20 &&
      bullet.y <= enemy.y + 70
    ) {
      console.log("hit");
      enemies.splice(enemyIndex, 1);
      bullets.splice(bulletIndex, 1);
      score += 1;
    }
  }
  return score;
}

function enemyMovement(enemy) {
  if (enemy.x > playerX - 40) {
    enemy.x += -3;
  }
  if (enemy.x < playerX) {
    enemy.x += 3;
  }
  if (enemy.y > playerY - 40) {
    enemy.y += -3;
  }
  if (enemy.y < playerY) {
    enemy.y += 3;
  }
  if (
    enemy.y >= playerY - 75 &&
    enemy.y <= playerY + 50 &&
    enemy.x >= playerX - 60 &&
    enemy.x <= playerX + 40
  ) {
    location.reload();
  }
}
// -------------------------------------
// ------------ Animation ------------
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  for (var i = bullets.length - 1; i >= 0; i--) {
    let bullet = bullets[i];
    c.fillStyle = "yellow";
    if (bullet.dy == 0) {
      c.fillRect(bullet.x, bullet.y, 30, 8);
    } else if (bullet.dx == 0) {
      c.fillRect(bullet.x, bullet.y, 8, 30);
    }
    bullet.x += bullet.dx;
    bullet.y += bullet.dy;
    score = detectCollision(bullet, i, score);
    if (
      bullet.x < 0 ||
      bullet.x > gameCanvas.width ||
      bullet.y < 0 ||
      bullet.y > gameCanvas.height
    ) {
      bullets.splice(i, 1);
    }
  }

  document.getElementById("score").innerHTML = `Score:${score}`;
  document.getElementById("wave").innerHTML = `Wave:${wave}`;

  const enemyImage = new Image();
  enemyImage.src = "Alien.png";
  enemies.forEach((enemy) => {
    c.fillRect(enemy.x, enemy.y, 40, 40);
    c.drawImage(enemyImage, enemy.x - 30, enemy.y - 30, 100, 100);
    enemyMovement(enemy);
  });

  var playerImage = document.getElementById("spaceship");
  playerImage.style.top = `${playerY - 10}px`;
  playerImage.style.left = `${playerX - 10}px`;

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
  } else if (playerY >= 645) {
    playerY -= dy;
  } else if (playerX <= -5) {
    playerX += dx;
  } else if (playerX >= 845) {
    playerX -= dx;
  }
}

animate();
