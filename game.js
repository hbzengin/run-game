const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0,0, canvas.width, canvas.height)

class Character {
  constructor({ position, width, height, health, speed}) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.health = health;
    this.speed = speed;
    this.xvel = 0;
    this.yvel = 0;
  }

  update() {

    c.fillStyle = "red";

    c.fillRect(
      player.position.x,
      player.position.y,
      player.width,
      player.height
    );

    this.position.x = this.position.x + this.xvel;
    this.position.y = this.position.y + this.yvel;
  }
};

const player = new Character({position: {x: 0, y:0}, width: 50, height: 50, health: 100, speed: 10});


function animate() {
    window.requestAnimationFrame(animate);

    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);

    player.update()

}

document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "w":
        console.log("w pressed");
        player.yvel = -player.speed;
        break;
      case "a":
        console.log("a pressed");
        player.xvel = -player.speed;
        break;
      case "s":
        console.log("s pressed");
        player.yvel = player.speed;
        break;
      case "d":
        console.log("d pressed");
        player.xvel = player.speed;
        break;
    }
});

document.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "w":
      console.log("w pressed");
      player.yvel = 0;
      break;
    case "a":
      console.log("a pressed");
      player.xvel = 0;
      break;
    case "s":
      console.log("s pressed");
      player.yvel = 0;
      break;
    case "d":
      console.log("d pressed");
      player.xvel = 0;
      break;
  }
});

animate();