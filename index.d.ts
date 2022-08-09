declare module 'confetti-rain' {
  class ConfettiRain {
    start(): void;
    pause(): void;
    uninstall(): void;

    areAllParticlesDead: boolean;
    livingParticles: ConfettiParticle[];
    _killParticle(index: number): void;
  }

  class ConfettiParticle {
    isDead: boolean;
  }

  export default ConfettiRain;
}
