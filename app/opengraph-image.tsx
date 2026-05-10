/* eslint-disable @next/next/no-img-element -- ImageResponse renders standard img elements for generated social cards. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

import { seo } from '@/lib/seo';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

function publicAssetDataUri(path: string, mimeType: string) {
  const file = readFileSync(join(process.cwd(), 'public', ...path.split('/')));
  return `data:${mimeType};base64,${file.toString('base64')}`;
}

export default function OpenGraphImage() {
  const logoSrc = publicAssetDataUri('logos/Coloured Logo Black text Trans.png', 'image/png');
  const gearSrc = publicAssetDataUri('icons/Gear.png', 'image/png');
  const chipSrc = publicAssetDataUri('icons/CHIP.png', 'image/png');

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
          <img
            src={logoSrc}
            width={220}
            height={94}
            alt="PIDEC 1.0"
            style={{
              width: 220,
              height: 94,
              objectFit: 'contain',
            }}
          />
          <img
            src={gearSrc}
            width={70}
            height={70}
            alt=""
            style={{
              position: 'absolute',
              right: 84,
              top: 76,
              width: 70,
              height: 70,
              objectFit: 'contain',
              opacity: 0.9,
            }}
          />
          <img
            src={chipSrc}
            width={60}
            height={63}
            alt=""
            style={{
              position: 'absolute',
              left: 86,
              bottom: 76,
              width: 60,
              height: 63,
              objectFit: 'contain',
              opacity: 0.75,
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 999,
              background: 'rgba(255, 85, 0, 0.12)',
              color: '#ff5500',
              fontSize: 22,
              fontWeight: 800,
              padding: '16px 22px',
            }}
          >
            10 departments
          </div>
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
