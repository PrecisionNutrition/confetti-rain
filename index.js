/**
 * Based on ember-confetti
 *
 * @see https://github.com/san650/ember-confetti/blob/master/addon/components/confetti-rain.js
 * @license MIT. Copyright (c) 2017 Santiago Ferreira
 */

const COLORS = [
  'DodgerBlue',
  'OliveDrab',
  'Gold',
  'pink',
  'SlateBlue',
  'lightblue',
  'Violet',
  'PaleGreen',
  'SteelBlue',
  'SandyBrown',
  'Chocolate',
  'Crimson',
];

const MAX_PARTICLES = 150;

const MAX_ZINDEX = 2147483647;

/**
 * Implements a canvas-powered confetti rain.
 *
 * @example
 *   const confettiRain = new ConfettiRain();
 *   confettiRain.start();
 */
export default class ConfettiRain {
  canvas = document.createElement('canvas');
  maxParticles = MAX_PARTICLES;
  particles = [];
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  angle = 0;
  tiltAngle = 0;

  /**
   * MAKE IT RAIN!
   */
  start() {
    this._initializeCanvas();
    this._initializeParticles();
    this._animationLoop();
  }

  /**
   * Pause all confetti. This effectively "kills" all particles.
   */
  pause() {
    for (let index = 0; index < this.particles.length; index++) {
      const particle = this.particles[index];

      if (!particle.isDead) {
        this._killParticle(index);
      }
    }
  }

  /**
   * Stop all confetti, remove it from the DOM
   */
  uninstall() {
    this.pause();
    this.canvas.remove();
  }

  get livingParticles() {
    if (this.particles.length > 0) {
      return this.particles.filter((particle) => !particle.isDead);
    } else {
      return [];
    }
  }

  get areAllParticlesDead() {
    return this.livingParticles.length === 0;
  }

  _initializeCanvas() {
    this.canvas.width = this.windowWidth;
    this.canvas.height = this.windowHeight;
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = 0;
    this.canvas.style.right = 0;
    this.canvas.style.bottom = 0;
    this.canvas.style.left = 0;
    this.canvas.style.zIndex = MAX_ZINDEX;
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.context = this.canvas.getContext('2d');

    document.body.appendChild(this.canvas);
  }

  _initializeParticles() {
    const { context, maxParticles, windowHeight, windowWidth } = this;

    for (let i = 0; i < this.maxParticles; i++) {
      const particle = new ConfettiParticle({
        color: colorGenerator.getColor(),
        width: windowWidth,
        height: windowHeight,
        ctx: context,
        maxParticles: maxParticles,
      });

      this.particles.push(particle);
    }
  }

  _animationLoop() {
    if (this.areAllParticlesDead) {
      // Used to debug disabling the animation loop
      this.canvas.dataset.isDoneRunning = true;

      return;
    }

    window.requestAnimationFrame(this._animationLoop.bind(this));

    return this._draw();
  }

  _draw() {
    this.context.clearRect(0, 0, this.windowWidth, this.windowHeight);

    let results = this.particles.map((p) => p.draw());

    this._update();

    return results;
  }

  _update() {
    this.angle += 0.01;
    this.tiltAngle += 0.1;

    this.particles.forEach((particle, i) => {
      this._stepParticle(particle, i);
      this._checkForReposition(particle, i);
    });
  }

  _killParticle(index) {
    this.particles[index].isDead = true;
  }

  _checkForReposition(particle, index) {
    const isOffscreen =
      particle.x > this.windowWidth + 20 || particle.x < -20 || particle.y > this.windowHeight;

    if (isOffscreen) {
      if (!this.isEnabled) {
        this._killParticle(index);
        return;
      }

      if (index % 5 > 0 || index % 2 === 0) {
        //66.67% of the flakes
        this._repositionParticle(
          particle,
          Math.random() * this.windowWidth,
          -10,
          Math.floor(Math.random() * 10) - 10
        );
      } else {
        if (Math.sin(this.angle) > 0) {
          // enter from the left
          this.repositionParticle(
            particle,
            -5,
            Math.random() * this.windowHeight,
            Math.floor(Math.random() * 10) - 10
          );
        } else {
          // enter from the right
          this.repositionParticle(
            particle,
            this.windowWidth + 5,
            Math.random() * this.windowHeight,
            Math.floor(Math.random() * 10) - 10
          );
        }
      }
    }
  }

  _stepParticle(particle, particleIndex) {
    particle.tiltAngle += particle.tiltAngleIncremental;
    particle.y += (Math.cos(this.angle + particle.d) + 3 + particle.r / 2) / 2;
    particle.x += Math.sin(this.angle);
    particle.tilt = Math.sin(particle.tiltAngle - particleIndex / 3) * 15;
  }

  _repositionParticle(particle, xCoordinate, yCoordinate, tilt) {
    particle.x = xCoordinate;
    particle.y = yCoordinate;
    particle.tilt = tilt;
  }
}

function randomFromTo(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

class ConfettiParticle {
  constructor({ color, width, height, ctx, maxParticles }) {
    this.ctx = ctx;
    this.x = Math.random() * width; // x-coordinate
    this.y = Math.random() * height - height; //y-coordinate
    this.r = randomFromTo(10, 30); //radius;
    this.d = Math.random() * maxParticles + 10; //density;
    this.color = color;
    this.tilt = Math.floor(Math.random() * 10) - 10;
    this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
    this.tiltAngle = 0;
    this.isDead = false;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.lineWidth = this.r / 2;
    this.ctx.strokeStyle = this.color;
    this.ctx.moveTo(this.x + this.tilt + this.r / 4, this.y);
    this.ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 4);
    return this.ctx.stroke();
  }
}

const colorGenerator = {
  colorIndex: 0,
  colorIncrementer: -1,
  colorThreshold: 10,
  getColor() {
    this.colorIncrementer = (this.colorIncrementer + 1) % 10;

    if (!this.colorIncrementer) {
      this.colorIndex = (this.colorIndex + 1) % COLORS.length;
    }

    return COLORS[this.colorIndex];
  },
};
