import { ImageResponse } from 'next/og';

export const alt = 'Aiden Kopec - Full-Stack Software Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Default theme tokens, mirrored from app/globals.css:91-97
const BACKGROUND = '#0a0a0a';
const SURFACE = '#1a1a1a';
const ACCENT = '#ff6b6b';
const FOREGROUND = '#ffffff';

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: `linear-gradient(135deg, ${BACKGROUND} 0%, ${SURFACE} 100%)`,
        padding: '80px',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '9999px',
              background: ACCENT,
            }}
          />
          <div
            style={{
              fontSize: '26px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: ACCENT,
            }}
          >
            Full-Stack Developer
          </div>
        </div>

        <div
          style={{
            fontSize: '104px',
            fontWeight: 700,
            color: FOREGROUND,
            lineHeight: 1.05,
          }}
        >
          Aiden Kopec
        </div>

        <div
          style={{
            fontSize: '36px',
            color: 'rgba(255, 255, 255, 0.7)',
            marginTop: '28px',
            maxWidth: '900px',
            lineHeight: 1.35,
          }}
        >
          Scalable web apps, AI tools, and backend automations.
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '2px solid rgba(255, 255, 255, 0.12)',
          paddingTop: '32px',
        }}
      >
        <div style={{ fontSize: '30px', color: FOREGROUND }}>
          aidenkopec.com
        </div>
        <div
          style={{
            fontSize: '26px',
            color: 'rgba(255, 255, 255, 0.55)',
          }}
        >
          Next.js · TypeScript · Node.js
        </div>
      </div>
    </div>,
    { ...size },
  );
}
