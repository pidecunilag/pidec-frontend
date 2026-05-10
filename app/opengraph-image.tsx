import { ImageResponse } from 'next/og';

import { seo } from '@/lib/seo';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #fcfbfe 0%, #efe5fb 55%, #c4f0ff 100%)',
          color: '#2a003b',
          padding: 72,
          fontFamily: 'Arial, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -120,
            top: -120,
            width: 360,
            height: 360,
            borderRadius: 999,
            background: '#ff5500',
            opacity: 0.9,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -70,
            bottom: -70,
            width: 240,
            height: 240,
            borderRadius: 999,
            background: '#12b7ea',
            opacity: 0.75,
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: 72,
              borderRadius: 20,
              background: '#2a003b',
              color: 'white',
              fontSize: 42,
              fontWeight: 800,
            }}
          >
            P
          </div>
          <div style={{ fontSize: 34, fontWeight: 800 }}>{seo.name}</div>
        </div>
        <div style={{ maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div style={{ fontSize: 78, lineHeight: 0.95, fontWeight: 900, letterSpacing: -4 }}>
            Prototype Inter Departmental Engineering Challenge
          </div>
          <div style={{ maxWidth: 760, fontSize: 30, lineHeight: 1.35, color: '#431158' }}>
            {seo.theme}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 24, fontSize: 24, color: '#431158' }}>
          <span>10 Departments</span>
          <span>3 Stages</span>
          <span>Grand Finale July 4, 2026</span>
        </div>
      </div>
    ),
    size,
  );
}
