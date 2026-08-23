import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Create your personalised PIDEC 1.0 Grand Finale share card';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

function publicAssetDataUri(path: string, mimeType: string) {
  const file = readFileSync(join(process.cwd(), 'public', ...path.split('/')));
  return `data:${mimeType};base64,${file.toString('base64')}`;
}

export default function FinaleCardOpenGraphImage() {
  const logoSrc = publicAssetDataUri('logos/Coloured Logo Black text Trans.png', 'image/png');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#12081c',
          backgroundImage:
            'linear-gradient(30deg, #8142df 12%, transparent 12.5%, transparent 87%, #8142df 87.5%), linear-gradient(150deg, #8142df 12%, transparent 12.5%, transparent 87%, #8142df 87.5%)',
          backgroundSize: '112px 194px',
          color: '#2a003b',
          fontFamily: 'Arial, sans-serif',
          padding: 42,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'stretch',
            background: '#ffffff',
            border: '6px solid rgba(255, 255, 255, 0.55)',
            boxShadow: '0 20px 60px rgba(18, 8, 28, 0.35)',
          }}
        >
          <div
            style={{
              width: 654,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '46px 52px 42px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <img
                src={logoSrc}
                width={218}
                height={78}
                alt="PIDEC 1.0"
                style={{ width: 218, height: 78, objectFit: 'contain' }}
              />
              <div
                style={{
                  display: 'flex',
                  color: '#6d3fa0',
                  fontSize: 17,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                Engineering for Impact
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  display: 'flex',
                  color: '#8e4dff',
                  fontSize: 20,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  marginBottom: 15,
                }}
              >
                Registered for the finale?
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 58,
                  lineHeight: 0.98,
                  fontWeight: 800,
                  maxWidth: 560,
                }}
              >
                Create your PIDEC share card
              </div>
              <div
                style={{
                  display: 'flex',
                  color: '#684577',
                  fontSize: 23,
                  lineHeight: 1.35,
                  marginTop: 22,
                  maxWidth: 540,
                }}
              >
                Look up your registration by email, add your photo and download your personalised card.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 18 }}>
              <div
                style={{
                  display: 'flex',
                  background: '#2a003b',
                  color: '#ffffff',
                  padding: '13px 18px',
                  fontWeight: 800,
                }}
              >
                pidec.com.ng/finale/card
              </div>
              <div style={{ display: 'flex', color: '#684577', fontWeight: 700 }}>
                28 August 2026 · 9 AM
              </div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f4eef9',
              borderLeft: '2px solid #ede3f5',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: -52,
                top: -58,
                width: 188,
                height: 188,
                background: '#ff5500',
                transform: 'rotate(18deg)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 16,
                bottom: -54,
                width: 154,
                height: 154,
                background: '#12b7ea',
                transform: 'rotate(45deg)',
              }}
            />

            <div
              style={{
                width: 396,
                height: 464,
                display: 'flex',
                flexDirection: 'column',
                background: '#ffffff',
                border: '14px solid #8142df',
                boxShadow: '14px 14px 0 #ff5500',
                padding: 26,
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '2px solid #ede3f5',
                  paddingBottom: 18,
                }}
              >
                <img
                  src={logoSrc}
                  width={126}
                  height={42}
                  alt="PIDEC 1.0"
                  style={{ width: 126, height: 42, objectFit: 'contain' }}
                />
                <div style={{ display: 'flex', color: '#8e4dff', fontSize: 12, fontWeight: 800 }}>
                  GRAND FINALE
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 18 }}>
                <div
                  style={{
                    width: 120,
                    height: 150,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: '#2a003b',
                    border: '6px solid #8e4dff',
                    boxShadow: '8px 8px 0 #ff5500',
                    color: '#ffffff',
                    fontSize: 68,
                    fontWeight: 800,
                  }}
                >
                  T
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', color: '#8e4dff', fontSize: 20, fontWeight: 700 }}>
                    Teslim
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      color: '#2a003b',
                      fontSize: 29,
                      lineHeight: 0.95,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      marginTop: 5,
                    }}
                  >
                    Is going to
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      color: '#ff5500',
                      fontSize: 18,
                      lineHeight: 1.03,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      marginTop: 13,
                    }}
                  >
                    <span>PIDEC 1.0</span>
                    <span>Grand Finale</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '2px solid #ede3f5',
                  paddingTop: 16,
                  fontSize: 13,
                  fontWeight: 800,
                }}
              >
                <div style={{ display: 'flex' }}>J.F. Ajayi Auditorium, UNILAG</div>
                <div style={{ display: 'flex', background: '#2a003b', color: '#ffffff', padding: '7px 9px' }}>
                  PIDEC26
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
