import { Projectile } from "./Projectile.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const heartBar = document.getElementById("health");
const scoreBoard = document.getElementById("scoreboard");
const infoBar = document.getElementById("info");
canvas.width = 1024;
canvas.height = 576;

export class Player {
  constructor({ position, width, height, health, speed }) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.health = health;
    this.speed = speed;
    this.xvel = 0;
    this.yvel = 0;
    this.facing = "e";
    this.projectiles = [];
    this.enemies = [];
    this.onShootCooldown = false;
    this.onHitCooldown = false;
    this.isPressed = {
      w: false,
      a: false,
      s: false,
      d: false,
      space: false,
    };
    this.points = 0;
    this.fasterShoot = false;
    this.biggerProjectiles = false;
    this.penetratingProjectiles = false;
    this.buffOnMap = null;
  }

  update() {
    this.xvel = 0;
    this.yvel = 0;

    if (this.onHitCooldown) {
      c.fillStyle = "lightblue";
    } else if (this.fasterShoot) {
      c.fillStyle = "orange";
    } else if (this.biggerProjectiles) {
      c.fillStyle = "purple";
    } else if (this.penetratingProjectiles) {
      c.fillStyle = "green";
    } else {
      c.fillStyle = "blue";
    }

    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    if (this.isPressed.w && this.position.y > 0) {
      this.yvel = -this.speed;
      this.facing = "n";
    }
    if (this.isPressed.a && this.position.x > 0) {
      this.xvel = -this.speed;
      this.facing = "w";
    }
    if (this.isPressed.s && this.position.y + this.height < canvas.height) {
      this.yvel = this.speed;
      this.facing = "s";
    }
    if (this.isPressed.d && this.position.x + this.width < canvas.width) {
      this.xvel = this.speed;
      this.facing = "e";
    }
    if (this.isPressed.space) {
      this.shoot();
    }

    // update projectiles (start from right for deletion)
    for (let i = this.projectiles.length - 1; i >= 0; --i) {
      this.projectiles[i].update();

      if (this.projectiles[i].isInvalid) {
        this.projectiles.splice(i, 1);
      }
    }

    // projectile hit enemy logic
    for (let i = this.enemies.length - 1; i >= 0; --i) {
      this.enemies[i].update();
      for (let j = this.projectiles.length - 1; j >= 0; --j) {
        const enemy = this.enemies[i];
        const proj = this.projectiles[j];
        if (
          proj.currentPos.x + proj.width / 2 >= enemy.position.x &&
          proj.currentPos.x + proj.width / 2 <=
            enemy.position.x + enemy.width &&
          proj.currentPos.y + proj.height / 2 >= enemy.position.y &&
          proj.currentPos.y + proj.height / 2 <= enemy.position.y + enemy.height
        ) {
          this.enemies.splice(i, 1);

          // if not penetrating projectiles, then remove!
          if (!this.penetratingProjectiles) {
            this.projectiles.splice(j, 1);
          }

          this.points += 50;
          scoreBoard.innerHTML = `Score: ${this.points} `;
          console.log(this.points);
        }
      }
    }

    // enemy hit player logic
    if (!this.onHitCooldown) {
      for (let i = 0; i < this.enemies.length; ++i) {
        const e = this.enemies[i];
        if (
          e.position.x + e.width / 2 >= this.position.x &&
          e.position.x + e.width / 2 <= this.position.x + this.width &&
          e.position.y + e.height / 2 >= this.position.y &&
          e.position.y + e.height / 2 <= this.position.y + this.height
        ) {
          this.health -= 1;
          this.onHitCooldown = true;
          // 1 second cooldown after hit once
          heartBar.innerHTML = heartBar.innerHTML.substring(
            1,
            heartBar.innerHTML.length
          );

          setTimeout(() => (this.onHitCooldown = false), 1000);
          console.log(this.health);
        }
      }
    }

    // update buff on map
    if (this.buffOnMap) {
      const buff = this.buffOnMap;
      if (buff.type == 0) {
        c.fillStyle = "orange";
      } else if (buff.type == 1) {
        c.fillStyle = "purple";
      } else if (buff.type == 2) {
        c.fillStyle = "green";
      }

      c.fillRect(buff.position.x, buff.position.y, buff.width, buff.height);
    }

    // detect player hit on buff
    if (this.buffOnMap) {
      const buff = this.buffOnMap;
      if (
        this.position.x + this.width / 2 >= buff.position.x &&
        this.position.x + this.width / 2 <= buff.position.x + buff.width &&
        this.position.y + this.height / 2 >= buff.position.y &&
        this.position.y + this.height / 2 <= buff.position.y + buff.height
      ) {
        if (buff.type == 0) {
          this.fasterShoot = true;
          infoBar.innerHTML = "Buff activated! You shoot faster!";
          setTimeout(() => {
            this.fasterShoot = false;
            infoBar.innerHTML = "";
          }, 7500);
        } else if (buff.type == 1) {
          this.biggerProjectiles = true;
          infoBar.innerHTML = "Buff activated! You shoot bigger projectiles!";
          setTimeout(() => {
            this.biggerProjectiles = false;
            infoBar.innerHTML = "";
          }, 7500);
        } else if (buff.type == 2) {
          this.penetratingProjectiles = true;
          infoBar.innerHTML = "Buff activated! You shoot penetrating shots!";
          setTimeout(() => {
            this.penetratingProjectiles = false;
            infoBar.innerHTML = "";
          }, 7500);
        }

        this.buffOnMap = null;
      }
    }

    // move player
    this.position.x = this.position.x + this.xvel;
    this.position.y = this.position.y + this.yvel;
  }

  shoot() {
    if (this.onShootCooldown) return;
    let projWidth = this.biggerProjectiles ? 40 : 10;
    let projHeight = this.biggerProjectiles ? 40 : 10;
    let endCoords;
    let startCoords;
    let xvel = 0;
    let yvel = 0;

    switch (this.facing) {
      case "n":
        startCoords = {
          x: this.position.x + this.width / 2 - projWidth / 2,
          y: this.position.y - projHeight,
        };
        endCoords = { x: this.position.x, y: 0 };
        yvel = -5;
        break;
      case "e":
        startCoords = {
          x: this.position.x + this.width,
          y: this.position.y + this.height / 2 - projHeight / 2,
        };
        endCoords = { x: canvas.width, y: this.position.y };
        xvel = 5;
        break;
      case "s":
        startCoords = {
          x: this.position.x + this.width / 2 - projWidth / 2,
          y: this.position.y + this.height,
        };
        endCoords = { x: this.position.x, y: canvas.height };
        yvel = 5;
        break;
      case "w":
        startCoords = {
          x: this.position.x - projWidth,
          y: this.position.y + this.height / 2 - projHeight / 2,
        };
        endCoords = { x: 0, y: this.position.y };
        xvel = -5;
        break;
    }

    const proj = new Projectile({
      currentPos: startCoords,
      endPos: endCoords,
      width: projWidth,
      height: projHeight,
      xvel: xvel,
      yvel: yvel,
    });

    this.projectiles.push(proj);

    this.onShootCooldown = true;
    let cooldown = this.fasterShoot ? 500 : 1000;
    setTimeout(() => {
      this.onShootCooldown = false;
    }, cooldown);
  }

  addNewEnemy(Enemy) {
    this.enemies.push(Enemy);
  }
}
