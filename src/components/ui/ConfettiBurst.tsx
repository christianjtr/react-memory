import { useEffect, useState, type ReactElement } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export interface ConfettiBurstProps {
  active: boolean;
  particleCount?: number;
}

const COLORS = [
  '#7c3aed',
  '#d946ef',
  '#06b6d4',
  '#f59e0b',
  '#fb7185',
  '#22c55e',
  '#facc15',
] as const;

interface Particle {
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly rotation: number;
  readonly color: string;
  readonly delay: number;
  readonly duration: number;
  readonly radius: string;
}

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, index) => {
    const direction = Math.random() > 0.5 ? 1 : -1;

    return {
      id: index,
      x: direction * (60 + Math.random() * 360),
      y: -80 - Math.random() * 240,
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 720 - 360,
      color: COLORS[index % COLORS.length]!,
      delay: Math.random() * 0.25,
      duration: 1.4 + Math.random() * 1.1,
      radius: Math.random() > 0.6 ? '9999px' : '2px',
    };
  });
}

export function ConfettiBurst({
  active,
  particleCount = 54,
}: ConfettiBurstProps): ReactElement | null {
  const prefersReducedMotion = useReducedMotion();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    setParticles(createParticles(particleCount));

    const timeoutId = window.setTimeout(() => {
      setParticles([]);
    }, 3200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [active, particleCount]);

  if (!active || particles.length === 0 || prefersReducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute top-1/2 left-1/2 block"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: particle.radius,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.4, rotate: 0 }}
          animate={{
            x: [0, particle.x, particle.x * 0.75],
            y: [0, particle.y, particle.y + 320],
            opacity: [1, 1, 0],
            scale: [0.4, 1, 0.8],
            rotate: particle.rotation,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: 'easeOut',
            times: [0, 0.35, 1],
          }}
        />
      ))}
    </div>
  );
}
