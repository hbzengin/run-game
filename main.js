import { Player } from "./Player.js";
import { Enemy } from "./Enemy.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const scoreBoard = document.getElementById("scoreboard");
canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const HEALTH = 3;
const SPEED = 1;
const WIDTH = 25;
const HEIGHT = 25;
const STARTINGLOC = {
  x: Math.random() * (canvas.width - WIDTH),
  y: Math.random() * (canvas.height - HEIGHT),
};

const player = new Player({
  position: STARTINGLOC,
  width: WIDTH,
  height: HEIGHT,
  health: HEALTH,
  speed: SPEED,
});
const hearthBar = document.getElementById("health");
for (let i = 0; i < HEALTH; ++i) {
  hearthBar.innerHTML += "&hearts;";
}

const intervalId = setInterval(() => {
  // const enemyWidth = Math.random() * 20;
  // const enemyHeight = Math.random() * 20;
  const enemyWidth = 25;
  const enemyHeight = 25;

  const posx = Math.random() * (canvas.width - enemyWidth);
  const posy = Math.random() * (canvas.height - enemyHeight);
  const health = 100;
  const speed = 0.5;

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
}, 1000);

function animate() {
  let animationId = window.requestAnimationFrame(animate);

  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();

  if (player.health == 0) {
    cancelAnimationFrame(animationId);
    scoreBoard.innerHTML = "Game over! You lose!";
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
      player.isPressed.space = true;
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
