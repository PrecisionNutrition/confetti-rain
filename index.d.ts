declare class ConfettiRain {
  start(): void;
  stop(): void;

  areAllParticlesDead: boolean;
  livingParticles: ConfettiParticle[];
  _killParticle(index: number): void;
}

declare class ConfettiParticle {
  isDead: boolean;
}
