const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

canvas.width = 1024;
canvas.height = 576;


const isPressed = {
  w: false,
  a: false,
  s: false,
  d: false,
  space: false
};

c.fillRect(0,0, canvas.width, canvas.height)

class Projectile {
    constructor({currentPos, endPos, width, height, xvel, yvel}) {
        this.currentPos = currentPos;
        this.endPos = endPos;
        this.width = width;
        this.height = height;
        this.xvel = xvel;
        this.yvel = yvel;
        this.isInvalid = false;
    }

    update() {

        c.fillStyle = "yellow";

        c.fillRect(this.currentPos.x, this.currentPos.y, this.width, this.height);

        this.currentPos.x = this.currentPos.x + this.xvel;
        this.currentPos.y = this.currentPos.y + this.yvel;

        if ((this.xvel > 0 && this.currentPos.x >= this.endPos.x) ||
            (this.xvel < 0 && this.currentPos.x <= this.endPos.x) ||
            (this.yvel > 0 && this.currentPos.x >= this.endPos.y) ||
            this.yvel < 0 && this.currentPos.y <= this.endPos.y) {
            this.isInvalid = true;
        }
    }
};

class Character {
  constructor({ position, width, height, health, speed}) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.health = health;
    this.speed = speed;
    this.xvel = 0;
    this.yvel = 0;
    this.facing = 'e';
    this.projectiles = [];
    this.onCooldown = false;
  }

  update() {
    this.xvel = 0;
    this.yvel = 0;
    c.fillStyle = "blue";

    c.fillRect(
      player.position.x,
      player.position.y,
      player.width,
      player.height
    );

    if (isPressed.w) {
        this.yvel = -this.speed;
        this.facing = 'n';
    }
    if (isPressed.a) {
        this.xvel = -this.speed;
        this.facing = "w";
    }
    if (isPressed.s) {
        this.yvel = this.speed;
        this.facing = "s";
    }
    if (isPressed.d) {
        this.xvel = this.speed;
        this.facing = "e";
    }
    if (isPressed.space) {
        this.shoot();
    }

    let newProjectiles = [];
    for (let i = 0; i < this.projectiles.length; ++i) {
        this.projectiles[i].update();

        if (!this.projectiles[i].isInvalid) {
            newProjectiles.push(this.projectiles[i]);
        }
    }

    this.projectiles = newProjectiles;

    this.position.x = this.position.x + this.xvel;
    this.position.y = this.position.y + this.yvel;
  }

  shoot() {
    if (player.onCooldown) return;
    
    let endCoords;
    let xvel = 0;
    let yvel = 0;

    switch (this.facing) {
        case "n":
            endCoords = {x: this.position.x, y: 0};
            yvel = -5
            break;
        case "e":
            endCoords = {x: canvas.width, y: this.position.y};
            xvel = 5;
            break;
        case "s":
            endCoords = {x: this.position.x, y: canvas.height};
            yvel = 5;
            break;
        case "w":
            endCoords = {x: 0, y: this.position.y};
            xvel = -5;
            break;
    }

    const proj = new Projectile({
        currentPos: {x: this.position.x, y: this.position.y},
        endPos: endCoords,
        width: 10,
        height: 10,
        xvel: xvel,
        yvel: yvel
        }
    )

    this.projectiles.push(proj);

    player.onCooldown = true;
    setTimeout(() => {
    player.onCooldown = false;
    }, 1000);
  }
};

class Enemy {
    constructor({position, target, width, height, health, speed}) {
        this.position = position
        this.target = target;
        this.width = width;
        this.height = height;
        this.health = health;
        this.speed = speed;
    }

    update() {
        c.fillStyle = "red";

        const xDist = target.position.x - this.position.x;
        const yDist = target.position.y - this.position.y;
        const ratio = xDist / yDist;

        // const xVel = this.speed * ratio;
        // const yVel = this.speed * (1-ratio);

    }
};

const player = new Character({position: {x: 0, y:0}, width: 25, height: 25, health: 100, speed: 3});


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
        isPressed.w = true;
        break;
      case "a":
        console.log("a pressed");
        isPressed.a = true;
        break;
      case "s":
        console.log("s pressed");
        isPressed.s = true;
        break;
      case "d":
        console.log("d pressed");
        isPressed.d = true;
        break;
      case " ":
        console.log("space presssed");
        isPressed.space = true;
        break;
    }
});

document.addEventListener("keyup", (event) => {
    switch (event.key) {
      case "w":
        console.log("w unpressed");
        isPressed.w = false;
        break;
      case "a":
        console.log("a unpressed");
        isPressed.a = false;
        break;
      case "s":
        console.log("s unpressed");
        isPressed.s = false;
        break;
      case "d":
        console.log("d unpressed");
        isPressed.d = false;
        break;
      case " ":
        console.log("space unpressed");
        isPressed.space = false;
        break;
    }
});

animate();
