'use client';

import { useState, useEffect } from 'react';

type WavyLinesProps = {
  className?: string;
  waveCount?: number;
};

type ScreenSize = 'mobile' | 'tablet' | 'desktop';

function getScreenSize(): ScreenSize {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

// Helper function to get theme colors from CSS custom properties
function getThemeColors() {
  if (typeof window === 'undefined') {
    // Default fallback colors
    return {
      primary: '#60a5fa',
      accent: '#a78bfa',
      secondary: '#ffffff',
      glow: '#60a5fa',
      glowSecondary: '#a78bfa',
    };
  }

  const style = getComputedStyle(document.documentElement);
  return {
    primary:
      style.getPropertyValue('--text-color-variable').trim() || '#60a5fa',
    accent: style.getPropertyValue('--gradient-start').trim() || '#a78bfa',
    secondary: style.getPropertyValue('--white-100').trim() || '#ffffff',
    glow: style.getPropertyValue('--text-color-variable').trim() || '#60a5fa',
    glowSecondary:
      style.getPropertyValue('--gradient-start').trim() || '#a78bfa',
  };
}

function generateWavePath(
  width: number,
  height: number,
  amplitude: number,
  frequency: number,
  phase: number,
  verticalOffset: number = 0
): string {
  const points: string[] = [];
  const steps = 150;

  for (let i = 0; i <= steps; i++) {
    const x = Math.round((i / steps) * width * 100) / 100;
    const y =
      Math.round(
        (height / 2 +
          verticalOffset +
          amplitude * Math.sin((i / steps) * frequency * Math.PI * 2 + phase)) *
          100
      ) / 100;
    points.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }

  return points.join(' ');
}

function WavyLines({ className = '', waveCount }: WavyLinesProps) {
  const [mounted, setMounted] = useState(false);
  const [screenSize, setScreenSize] = useState<ScreenSize>('desktop');
  const [themeColors, setThemeColors] = useState(getThemeColors());

  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      setScreenSize(getScreenSize());
    };

    const updateThemeColors = () => {
      setThemeColors(getThemeColors());
    };

    handleResize();
    updateThemeColors();

    window.addEventListener('resize', handleResize);

    // Listen for theme changes by observing CSS custom property changes
    const observer = new MutationObserver(updateThemeColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  if (!mounted) {
    return <div className={`absolute inset-0 overflow-hidden ${className}`} />;
  }

  // Mobile-specific geometric design
  if (screenSize === 'mobile') {
    return (
      <div
        className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
        suppressHydrationWarning
      >
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 400 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Radial gradients for orbs */}
            <radialGradient id="orbGradient1" cx="30%" cy="30%">
              <stop
                offset="0%"
                stopColor={themeColors.primary}
                stopOpacity="0.6"
              />
              <stop
                offset="30%"
                stopColor={themeColors.primary}
                stopOpacity="0.3"
              />
              <stop
                offset="60%"
                stopColor={themeColors.primary}
                stopOpacity="0.15"
              />
              <stop
                offset="100%"
                stopColor={themeColors.primary}
                stopOpacity="0"
              />
            </radialGradient>

            <radialGradient id="orbGradient2" cx="40%" cy="40%">
              <stop
                offset="0%"
                stopColor={themeColors.accent}
                stopOpacity="0.5"
              />
              <stop
                offset="35%"
                stopColor={themeColors.accent}
                stopOpacity="0.25"
              />
              <stop
                offset="70%"
                stopColor={themeColors.accent}
                stopOpacity="0.1"
              />
              <stop
                offset="100%"
                stopColor={themeColors.accent}
                stopOpacity="0"
              />
            </radialGradient>

            <radialGradient id="orbGradient3" cx="50%" cy="30%">
              <stop
                offset="0%"
                stopColor={themeColors.secondary}
                stopOpacity="0.25"
              />
              <stop
                offset="40%"
                stopColor={themeColors.secondary}
                stopOpacity="0.15"
              />
              <stop
                offset="70%"
                stopColor={themeColors.secondary}
                stopOpacity="0.08"
              />
              <stop
                offset="100%"
                stopColor={themeColors.secondary}
                stopOpacity="0"
              />
            </radialGradient>

            {/* Mesh gradient effect for premium look */}
            <radialGradient id="orbGlow1" cx="50%" cy="50%">
              <stop
                offset="0%"
                stopColor={themeColors.glow}
                stopOpacity="0.4"
              />
              <stop
                offset="100%"
                stopColor={themeColors.glow}
                stopOpacity="0"
              />
            </radialGradient>

            <radialGradient id="orbGlow2" cx="50%" cy="50%">
              <stop
                offset="0%"
                stopColor={themeColors.glowSecondary}
                stopOpacity="0.3"
              />
              <stop
                offset="100%"
                stopColor={themeColors.glowSecondary}
                stopOpacity="0"
              />
            </radialGradient>

            {/* Blur effects */}
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
              <feColorMatrix type="saturate" values="1.2" />
            </filter>

            <filter
              id="ultraSoftBlur"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
              <feColorMatrix type="saturate" values="1.5" />
            </filter>

            <filter
              id="glowEffect"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background glow orbs for depth */}
          <ellipse
            cx="380"
            cy="120"
            rx="180"
            ry="180"
            fill="url(#orbGlow1)"
            filter="url(#ultraSoftBlur)"
            opacity="0.3"
          />

          <ellipse
            cx="60"
            cy="220"
            rx="120"
            ry="120"
            fill="url(#orbGlow2)"
            filter="url(#ultraSoftBlur)"
            opacity="0.25"
          />

          {/* Main premium orbs */}
          <ellipse
            cx="350"
            cy="100"
            rx="110"
            ry="110"
            fill="url(#orbGradient1)"
            filter="url(#softGlow)"
          />

          <ellipse
            cx="50"
            cy="200"
            rx="75"
            ry="75"
            fill="url(#orbGradient2)"
            filter="url(#softGlow)"
          />

          <ellipse
            cx="300"
            cy="350"
            rx="90"
            ry="90"
            fill="url(#orbGradient3)"
            filter="url(#softGlow)"
          />

          {/* Inner glow rings for premium effect */}
          <circle
            cx="350"
            cy="100"
            r="60"
            fill="none"
            stroke="url(#orbGradient1)"
            strokeWidth="0.5"
            opacity="0.6"
          />

          <circle
            cx="50"
            cy="200"
            r="40"
            fill="none"
            stroke="url(#orbGradient2)"
            strokeWidth="0.5"
            opacity="0.5"
          />

          {/* Subtle light rays */}
          <path
            d="M 350 100 L 380 50 M 350 100 L 400 90 M 350 100 L 360 140"
            stroke={themeColors.primary}
            strokeWidth="0.5"
            strokeOpacity="0.2"
            strokeLinecap="round"
          />

          <path
            d="M 50 200 L 20 180 M 50 200 L 30 230 M 50 200 L 80 210"
            stroke={themeColors.accent}
            strokeWidth="0.5"
            strokeOpacity="0.15"
            strokeLinecap="round"
          />

          {/* Noise texture overlay for premium feel */}
          <filter id="noise">
            <feTurbulence baseFrequency="0.9" numOctaves="4" seed="5" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues="0 0.03 0.03 0.03" />
            </feComponentTransfer>
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>

          {/* Apply subtle noise to entire composition */}
          <rect
            width="100%"
            height="100%"
            fill="transparent"
            filter="url(#noise)"
            opacity="0.5"
          />

          {/* Subtle ambient particles */}
          <circle
            cx="120"
            cy="150"
            r="2"
            fill={themeColors.primary}
            opacity="0.3"
          />
          <circle
            cx="250"
            cy="280"
            r="1.5"
            fill={themeColors.accent}
            opacity="0.25"
          />
          <circle
            cx="180"
            cy="100"
            r="1"
            fill={themeColors.secondary}
            opacity="0.2"
          />
          <circle
            cx="320"
            cy="230"
            r="1.5"
            fill={themeColors.primary}
            opacity="0.2"
          />
          <circle
            cx="80"
            cy="320"
            r="1"
            fill={themeColors.secondary}
            opacity="0.15"
          />
        </svg>
      </div>
    );
  }

  // Tablet and Desktop wave design
  const getWaveParams = () => {
    if (screenSize === 'tablet') {
      return {
        waveCount: waveCount || 6,
        baseAmplitude: 35,
        amplitudeIncrement: 15,
        baseFrequency: 0.8,
        frequencyIncrement: 0.25,
        viewBox: '0 0 1000 700',
        strokeWidth: 1.5,
        verticalOffset: 0,
      };
    }
    // desktop
    return {
      waveCount: waveCount || 7,
      baseAmplitude: 45,
      amplitudeIncrement: 20,
      baseFrequency: 1.0,
      frequencyIncrement: 0.3,
      viewBox: '0 0 1200 800',
      strokeWidth: 2,
      verticalOffset: 0,
    };
  };

  const params = getWaveParams();

  // Premium wave generation with golden ratio spacing
  const waves = Array.from({ length: params.waveCount }, (_, i) => {
    const goldenRatio = 1.618;
    const layerDepth = i / params.waveCount;

    return {
      id: i,
      amplitude:
        params.baseAmplitude +
        i * params.amplitudeIncrement * Math.pow(goldenRatio, 0.3),
      frequency:
        params.baseFrequency +
        i * params.frequencyIncrement * Math.pow(goldenRatio, 0.2),
      phase: (i * Math.PI) / goldenRatio,
      opacity: Math.pow(0.85 - layerDepth * 0.7, 1.5), // Exponential falloff for smoother gradients
      strokeWidth: params.strokeWidth * Math.pow(0.9, i * 0.5), // Gradual thinning
      gradientId: i % 4, // More gradient variety
      verticalOffset: params.verticalOffset + i * 8 * Math.sin(i * 0.5), // Organic vertical distribution
      blur: i > params.waveCount * 0.6 ? 2 : 0, // Back waves get subtle blur
    };
  });

  const viewBoxDimensions = params.viewBox.split(' ').slice(2).map(Number);
  const [viewWidth, viewHeight] = viewBoxDimensions;

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      suppressHydrationWarning
    >
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox={params.viewBox}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Premium mesh gradient - primary aurora */}
          <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={themeColors.primary} stopOpacity="0">
              <animate
                attributeName="stopOpacity"
                values="0;0.2;0"
                dur="8s"
                repeatCount="indefinite"
              />
            </stop>
            <stop
              offset="20%"
              stopColor={themeColors.primary}
              stopOpacity="0.3"
            />
            <stop
              offset="40%"
              stopColor={themeColors.primary}
              stopOpacity="0.5"
            />
            <stop
              offset="60%"
              stopColor={themeColors.primary}
              stopOpacity="0.3"
            />
            <stop
              offset="100%"
              stopColor={themeColors.primary}
              stopOpacity="0"
            />
          </linearGradient>

          {/* Glass morphism gradient */}
          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              stopColor={themeColors.secondary}
              stopOpacity="0"
            />
            <stop
              offset="25%"
              stopColor={themeColors.secondary}
              stopOpacity="0.08"
            />
            <stop
              offset="50%"
              stopColor={themeColors.secondary}
              stopOpacity="0.12"
            />
            <stop
              offset="75%"
              stopColor={themeColors.secondary}
              stopOpacity="0.08"
            />
            <stop
              offset="100%"
              stopColor={themeColors.secondary}
              stopOpacity="0"
            />
          </linearGradient>

          {/* Deep accent */}
          <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={themeColors.accent} stopOpacity="0" />
            <stop
              offset="30%"
              stopColor={themeColors.accent}
              stopOpacity="0.25"
            />
            <stop
              offset="50%"
              stopColor={themeColors.accent}
              stopOpacity="0.4"
            />
            <stop
              offset="70%"
              stopColor={themeColors.accent}
              stopOpacity="0.25"
            />
            <stop
              offset="100%"
              stopColor={themeColors.accent}
              stopOpacity="0"
            />
          </linearGradient>

          {/* Cyan accent for variety */}
          <linearGradient id="waveGradient4" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={themeColors.glow} stopOpacity="0" />
            <stop offset="35%" stopColor={themeColors.glow} stopOpacity="0.2" />
            <stop
              offset="50%"
              stopColor={themeColors.glow}
              stopOpacity="0.35"
            />
            <stop offset="65%" stopColor={themeColors.glow} stopOpacity="0.2" />
            <stop offset="100%" stopColor={themeColors.glow} stopOpacity="0" />
          </linearGradient>

          {/* Premium glow effects */}
          <filter id="premiumGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feColorMatrix
              in="coloredBlur"
              type="matrix"
              values="1.2 0 0 0 0
                      0 1.2 0 0 0
                      0 0 1.5 0 0
                      0 0 0 1 0"
            />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="softBlur">
            <feGaussianBlur stdDeviation="2" />
          </filter>

          <filter id="ultraSoftBlur">
            <feGaussianBlur stdDeviation="6" />
          </filter>

          {/* Noise texture for premium matte finish */}
          <filter id="waveNoise">
            <feTurbulence baseFrequency="0.02" numOctaves="3" seed="5" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues="0 0.02 0.02 0.02" />
            </feComponentTransfer>
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
        </defs>

        {/* Background ambient glow */}
        <ellipse
          cx={viewWidth * 0.3}
          cy={viewHeight * 0.5}
          rx={viewWidth * 0.4}
          ry={viewHeight * 0.3}
          fill="url(#waveGradient1)"
          opacity="0.15"
          filter="url(#ultraSoftBlur)"
        />

        {/* Render waves */}
        {waves.map((wave, index) => (
          <g key={wave.id}>
            {/* Glow layer for depth */}
            {index < 2 && (
              <path
                d={generateWavePath(
                  viewWidth,
                  viewHeight,
                  wave.amplitude * 1.2,
                  wave.frequency,
                  wave.phase,
                  wave.verticalOffset
                )}
                fill="none"
                stroke={`url(#waveGradient${(wave.gradientId % 4) + 1})`}
                strokeWidth={wave.strokeWidth * 3}
                strokeOpacity={wave.opacity * 0.3}
                filter="url(#ultraSoftBlur)"
              />
            )}

            {/* Main wave path */}
            <path
              d={generateWavePath(
                viewWidth,
                viewHeight,
                wave.amplitude,
                wave.frequency,
                wave.phase,
                wave.verticalOffset
              )}
              fill="none"
              stroke={`url(#waveGradient${(wave.gradientId % 4) + 1})`}
              strokeWidth={wave.strokeWidth}
              strokeOpacity={wave.opacity}
              filter={
                wave.blur
                  ? 'url(#softBlur)'
                  : index === 0
                    ? 'url(#premiumGlow)'
                    : undefined
              }
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        ))}

        {/* Subtle noise overlay for texture */}
        <rect
          width="100%"
          height="100%"
          fill="transparent"
          filter="url(#waveNoise)"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}

export default WavyLines;
