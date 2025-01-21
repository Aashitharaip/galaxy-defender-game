// Get Canvas and Context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load Images
const playerImg = new Image();
playerImg.src = 'static/images/space-invaders.png';

const enemyImg = new Image();
enemyImg.src = 'static/images/alien.png';

const bulletImg = new Image();
bulletImg.src = 'static/images/bullet.png';

// Load Sounds
const bulletSound = new Audio('static/music/laser.wav');
const explosionSound = new Audio('static/music/explosion.wav');

// Player
const player = {
  x: 380,
  y: 480,
  width: 64,
  height: 64,
  speed: 5,
  dx: 0
};

// Enemies
const enemies = [];
const noOfEnemies = 6;

for (let i = 0; i < noOfEnemies; i++) {
  enemies.push({
    x: Math.random() * 735,
    y: Math.random() * 150,
    width: 64,
    height: 64,
    speed:5,
    dx: 2,
    dy: 40
  });
}

// Bullet
const bullet = {
  x: 0,
  y: player.y,
  width: 8,
  height: 20,
  speed: 50,
  isFired: false
};

// Score
let score = 0;

// Draw Player
function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

// Draw Enemy
function drawEnemies() {
  enemies.forEach(enemy => {
    ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
  });
}

// Draw Bullet
function drawBullet() {
  if (bullet.isFired) {
    ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
  }
}

// Show Score
function showScore() {
  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// Collision Detection
function isCollision(enemy, bullet) {
  return (
    bullet.x < enemy.x + enemy.width &&
    bullet.x + bullet.width > enemy.x &&
    bullet.y < enemy.y + enemy.height &&
    bullet.y + bullet.height > enemy.y
  );
}

// Game Over Flag
let isGameOver = false;

// Game Over Function
function gameOver() {
  isGameOver = true; // Set the flag
  enemies = []; // Clear all enemies
  ctx.fillStyle = '#fff';
  ctx.font = '50px Arial';
  ctx.fillText('GAME OVER', canvas.width / 2 - 150, canvas.height / 2);
}

// Update Game Elements
function update() {
  if (isGameOver) return; // Stop all updates if the game is over

  // Move Player
  player.x += player.dx;
  if (player.x < 0) player.x = 0;
  if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;

  // Move Bullet
  if (bullet.isFired) {
    bullet.y -= bullet.speed;
    if (bullet.y < 0) bullet.isFired = false;
  }

  // Move Enemies
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];

    enemy.x += enemy.dx;

    // Reverse enemy direction and move down
    if (enemy.x < 0 || enemy.x > canvas.width - enemy.width) {
      enemy.dx *= -1;
      enemy.y += enemy.dy;
    }

    // Check for collision with bullet
    if (isCollision(enemy, bullet)) {
      explosionSound.play();
      score++;
      bullet.isFired = false;
      bullet.y = player.y;

      // Reset enemy position
      enemy.x = Math.random() * 735;
      enemy.y = Math.random() * 150;
    }

    // Check for collision with player (Game Over)
    if (enemy.y + enemy.height >= player.y) { // Game over condition
      gameOver();
      clearInterval(gameLoopInterval);
      return; // Stop further updates in this frame
    }
  }
}

// Render Game Elements
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear Canvas

  if (!isGameOver) {
    drawPlayer();
    drawEnemies();
    drawBullet();
  }

  showScore(); // Always show the score

  if (isGameOver) {
    // Show Game Over message
    ctx.fillStyle = '#fff';
    ctx.font = '50px Arial';
    ctx.fillText('GAME OVER', canvas.width / 2 - 150, canvas.height / 2);
  }
}

// Show Score Function
function showScore() {
  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// Game Loop
function gameLoop() {
  update();
  render();
}

// Event Listeners
document.addEventListener('keydown', e => {
  if (isGameOver) return; // Prevent actions after game over

  if (e.key === 'ArrowLeft') player.dx = -player.speed;
  if (e.key === 'ArrowRight') player.dx = player.speed;

  if (e.key === ' ') {
    if (!bullet.isFired) {
      bulletSound.play();
      bullet.x = player.x + player.width / 2 - bullet.width / 2;
      bullet.y = player.y;
      bullet.isFired = true;
    }
  }
});

document.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') player.dx = 0;
});

// Start Game
const gameLoopInterval = setInterval(gameLoop, 1000 / 60);

// Pause the game
function pauseGame() {
  clearInterval(gameLoopInterval);  // Stop the game loop
}

// Play the game
function playGame() {
  if (isGameOver) return;  // Prevent starting the game if it's already over
  gameLoopInterval = setInterval(gameLoop, 1000 / 60);  // Start or resume the game loop
}

// End the game
function endGame() {
  gameOver();  // Call the game over function
  clearInterval(gameLoopInterval);  // Stop the game loop
}


// Event Listeners for Buttons
document.getElementById('pauseBtn').addEventListener('click', pauseGame);
document.getElementById('playBtn').addEventListener('click', playGame);
document.getElementById('endBtn').addEventListener('click', endGame);
