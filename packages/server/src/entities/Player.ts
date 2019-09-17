import {
  Constants,
  Maths,
} from '@tosios/common';
import { type } from '@colyseus/schema';
import { Circle } from './Circle';

const validateName = (name: string) => name.trim().slice(0, 16);

export class Player extends Circle {

  @type('number')
  lives: number;

  @type('string')
  name: string;

  @type('number')
  color: number;

  @type('number')
  score: number;

  @type('number')
  rotation: number;

  // These properties are needed to limit rates
  lastMoveAt: number;
  lastShootAt: number;

  // Init
  constructor(x: number, y: number, radius: number, lives: number, name: string) {
    super(x, y, radius);
    this.lives = lives;
    this.name = validateName(name);
    this.score = 0;
    this.rotation = 0;
    this.lastMoveAt = undefined;
    this.lastShootAt = undefined;
  }

  // Methods
  move(dirX: number, dirY: number, speed: number) {
    const magnitude = Maths.normalize2D(dirX, dirY);

    const speedX = Math.round(Maths.round2Digits(dirX * (speed / magnitude)));
    const speedY = Math.round(Maths.round2Digits(dirY * (speed / magnitude)));

    this.x = this.x + speedX;
    this.y = this.y + speedY;
  }

  hurt() {
    this.lives -= 1;
  }

  heal() {
    console.log('PLAYER before', this.lives)
    this.lives = this.lives + 1;
    console.log('PLAYER after', this.lives)
  }

  // Getters
  get isAlive(): boolean {
    return this.lives > 0;
  }

  get isFullLives(): boolean {
    return this.lives === Constants.PLAYER_LIVES;
  }

  get canShoot(): boolean {
    if (!this.isAlive) {
      return false;
    }

    const now: number = Date.now();
    if (this.lastShootAt && (now - this.lastShootAt) < Constants.BULLET_RATE) {
      return false;
    }

    this.lastShootAt = now;
    return true;
  }

  // Setters
  setLives(lives: number) {
    if (lives) {
      this.lives = lives;
      this.score = 0;
    } else {
      this.lives = 0;
    }
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setRotation(rotation: number) {
    this.rotation = rotation;
  }

  setName(name: string) {
    this.name = validateName(name);
  }

  setScore(score: number) {
    this.score = score;
  }
}
