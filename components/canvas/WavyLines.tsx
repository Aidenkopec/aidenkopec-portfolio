'use client';

import { useState, useEffect } from 'react';

type WavyLinesProps = {
  className?: string;
  opacity?: number;
  waveCount?: number;
  animationDuration?: number;
};

function generateWavePath(
  width: number,
  height: number,
  amplitude: number,
  frequency: number,
  phase: number
): string {
  const points: string[] = [];
  const steps = 100;
  
  for (let i = 0; i <= steps; i++) {
    const x = Math.round((i / steps) * width * 100) / 100;
    const y = Math.round((height / 2 + amplitude * Math.sin((i / steps) * frequency * Math.PI * 2 + phase)) * 100) / 100;
    points.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }
  
  return points.join(' ');
}

function WavyLines({ 
  className = '', 
  opacity = 0.3, 
  waveCount = 6,
  animationDuration = 20 
}: WavyLinesProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything on server to avoid hydration mismatch
  if (!mounted) {
    return <div className={`absolute inset-0 overflow-hidden ${className}`} />;
  }

  const waves = Array.from({ length: waveCount }, (_, i) => ({
    id: i,
    amplitude: 40 + i * 20,
    frequency: 1.2 + i * 0.4,
    phase: i * Math.PI / 4,
    opacity: opacity * (1 - i * 0.08),
    duration: animationDuration + i * 3,
    direction: i % 2 === 0 ? 'normal' : 'reverse'
  }));

  return (
    <div 
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      suppressHydrationWarning
    >
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1200 800"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--gradient-start, #ff6b6b)" stopOpacity="0" />
            <stop offset="25%" stopColor="var(--gradient-start, #ff6b6b)" stopOpacity="0.6" />
            <stop offset="75%" stopColor="var(--gradient-end, #ff6b6b)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--gradient-end, #ff6b6b)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--tertiary-color, #1a1a1a)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--tertiary-color, #1a1a1a)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--tertiary-color, #1a1a1a)" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {waves.map((wave) => (
          <g key={wave.id}>
            <path
              d={generateWavePath(1200, 800, wave.amplitude, wave.frequency, wave.phase)}
              fill="none"
              stroke={wave.id % 2 === 0 ? "url(#waveGradient1)" : "url(#waveGradient2)"}
              strokeWidth="3"
              strokeOpacity={wave.opacity}
              className={`wave-path wave-flow-${wave.direction}`}
              style={{
                animationDuration: `${wave.duration}s`,
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                transformOrigin: 'center',
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

export default WavyLines;