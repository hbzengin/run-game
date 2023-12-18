const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;

export class Projectile {
  constructor({ currentPos, endPos, width, height, xvel, yvel }) {
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

    if (
      (this.xvel > 0 && this.currentPos.x >= this.endPos.x) ||
      (this.xvel < 0 && this.currentPos.x <= this.endPos.x) ||
      (this.yvel > 0 && this.currentPos.y >= this.endPos.y) ||
      (this.yvel < 0 && this.currentPos.y <= this.endPos.y)
    ) {
      this.isInvalid = true;
    }
  }
}
