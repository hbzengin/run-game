import { Player } from "./Player.js";
import { Enemy } from "./Enemy.js";
import { Buff } from "./Buff.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const scoreBoard = document.getElementById("scoreboard");
const timer = document.getElementById("timer");
const hearthBar = document.getElementById("health");
const infoBar = document.getElementById("info");
canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

let isGamePaused = false;

const HEALTH = 3;
const SPEED = 1;
const WIDTH = 25;
const HEIGHT = 25;
const STARTINGLOC = {
  x: Math.random() * (canvas.width - WIDTH),
  y: Math.random() * (canvas.height - HEIGHT),
};

let player = new Player({
  position: STARTINGLOC,
  width: WIDTH,
  height: HEIGHT,
  health: HEALTH,
  speed: SPEED,
});

for (let i = 0; i < HEALTH; ++i) {
  hearthBar.innerHTML += "&hearts;";
}

let timeInterval;
let secondsTime = 0;
let minutesTime = 0;
function startTimer(startingTime) {
  secondsTime = startingTime % 60 || 0;
  minutesTime = Math.floor(startingTime / 60 || 0);
  timeInterval = setInterval(() => {
    ++secondsTime;
    if (secondsTime / 60 == 1) {
      ++minutesTime;
      secondsTime = 0;
    }
    if (minutesTime == 0) {
      timer.innerHTML = `Time: ${secondsTime} `;
    } else {
      timer.innerHTML = `Time: ${minutesTime}:${secondsTime}`;
    }
  }, 1000);
}

startTimer();

let enemyTimeout;
function spawnEnemy() {
  let duration = 3000 * (95 / 100) ** ((minutesTime * 60 + secondsTime) / 5);
  console.log("duration is ", duration);
  const enemyWidth = 25;
  const enemyHeight = 25;

  let posx;
  let posy;

  do {
    posx = Math.random() * (canvas.width - enemyWidth);
  } while (posx - player.position.x < 50);

  do {
    posy = Math.random() * (canvas.height - enemyHeight);
  } while (posx - player.position.y < 50);

  const health = 100;
  const speed = 0.6;

  const enemy = new Enemy({
    position: { x: posx, y: posy },
    target: player,
    width: enemyWidth,
    height: enemyHeight,
    health: health,
    speed: speed,
  });

  player.addNewEnemy(enemy);
  console.log("Enemy added!");
  enemyTimeout = setTimeout(spawnEnemy, duration);
}

spawnEnemy();

function buffInterval() {
  const interval = setInterval(() => {
    if (
      !player.buffOnMap &&
      !player.fasterShoot &&
      !player.biggerProjectiles &&
      !player.penetratingProjectiles
    ) {
      const WIDTH = 25;
      const HEIGHT = 25;
      const DURATION = 10000;
      const xLoc = Math.random() * (canvas.width - WIDTH);
      const yLoc = Math.random() * (canvas.height - HEIGHT);

      const type = Math.floor(Math.random() * 3);

      const buff = new Buff({
        position: { x: xLoc, y: yLoc },
        width: WIDTH,
        height: HEIGHT,
        type: type,
        duration: DURATION,
      });

      player.buffOnMap = buff;
    }
  }, 1);
}

buffInterval();

let animationId;
function animate() {
  animationId = window.requestAnimationFrame(animate);

  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();

  if (player.health <= 0) {
    cancelAnimationFrame(animationId);
    hearthBar.innerHTML = "Game over!";
    infoBar.innerHTML = "Press SPACE to start another game.";
    clearTimeout(enemyTimeout);
    clearInterval(timeInterval);
  }
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "w":
      console.log("w pressed");
      player.isPressed.w = true;
      break;
    case "a":
      console.log("a pressed");
      player.isPressed.a = true;
      break;
    case "s":
      console.log("s pressed");
      player.isPressed.s = true;
      break;
    case "d":
      console.log("d pressed");
      player.isPressed.d = true;
      break;
    case " ":
      console.log("space presssed");
      if (player.health <= 0) {
        player = new Player({
          position: STARTINGLOC,
          width: WIDTH,
          height: HEIGHT,
          health: HEALTH,
          speed: SPEED,
        });
        animate();
        startTimer();
        spawnEnemy();
        hearthBar.innerHTML = "";
        infoBar.innerHTML = "";
        timer.innerHTML = "Time : 0";
        for (let i = 0; i < HEALTH; ++i) {
          hearthBar.innerHTML += "&hearts;";
        }
        scoreBoard.innerHTML = "Score: 0";
      } else {
        player.isPressed.space = true;
      }
      break;
    case "Escape":
      if (player.health <= 0) return;
      if (!isGamePaused) {
        info.innerHTML = "Game paused. Press ESC to continue.";
        cancelAnimationFrame(animationId);
        clearTimeout(enemyTimeout);
        clearInterval(timeInterval);
      } else {
        animate();
        startTimer(minutesTime * 60 + secondsTime);
        spawnEnemy();
        info.innerHTML = "Game continuing...";
        setTimeout(() => {
          info.innerHTML = "";
        }, 2000);
      }
      isGamePaused = !isGamePaused;
      break;
  }
});

document.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "w":
      console.log("w unpressed");
      player.isPressed.w = false;
      break;
    case "a":
      console.log("a unpressed");
      player.isPressed.a = false;
      break;
    case "s":
      console.log("s unpressed");
      player.isPressed.s = false;
      break;
    case "d":
      console.log("d unpressed");
      player.isPressed.d = false;
      break;
    case " ":
      console.log("space unpressed");
      player.isPressed.space = false;
      break;
  }
});

animate();
