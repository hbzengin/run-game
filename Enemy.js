const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;

export class Enemy {
  constructor({ position, target, width, height, health, speed }) {
    this.position = position;
    this.target = target;
    this.width = width;
    this.height = height;
    this.health = health;
    this.speed = speed;
  }

  update() {
    c.fillStyle = "red";

    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    let xDist = this.target.position.x - this.position.x;
    let yDist = this.target.position.y - this.position.y;
    let magnitude = Math.sqrt(xDist * xDist + yDist * yDist);

    xDist = xDist / magnitude;
    yDist = yDist / magnitude;

    xDist = xDist * this.speed;
    yDist = yDist * this.speed;

    this.position.x = this.position.x + xDist;
    this.position.y = this.position.y + yDist;
  }
}
