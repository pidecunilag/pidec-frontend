'use client';

import { Play } from 'lucide-react';
import { useState } from 'react';

import { BrandIcon, BrandLogo } from '@/components/brand/brand-assets';
import { Reveal } from './motion-primitives';

const LOCAL_VIDEO_FALLBACK = '/PIDEC_Details_Video.mp4';

const CDN_SOURCES = {
  mobile: process.env.NEXT_PUBLIC_PIDEC_VIDEO_720_URL,
  desktop: process.env.NEXT_PUBLIC_PIDEC_VIDEO_1080_URL,
  cinema: process.env.NEXT_PUBLIC_PIDEC_VIDEO_4K_URL,
};

const POSTER_URL = process.env.NEXT_PUBLIC_PIDEC_VIDEO_POSTER_URL;

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

function getConnection(): NetworkInformation | undefined {
  const nav = navigator as Navigator & {
    connection?: NetworkInformation;
    mozConnection?: NetworkInformation;
    webkitConnection?: NetworkInformation;
  };

  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
}

function selectVideoSource() {
  const connection = getConnection();
  const width = window.innerWidth;
  const isConstrainedConnection =
    connection?.saveData || ['slow-2g', '2g', '3g'].includes(connection?.effectiveType ?? '');

  if (width < 768 || isConstrainedConnection) {
    return CDN_SOURCES.mobile || CDN_SOURCES.desktop || CDN_SOURCES.cinema || LOCAL_VIDEO_FALLBACK;
  }

  if (width >= 1600 && window.devicePixelRatio >= 1.25) {
    return CDN_SOURCES.cinema || CDN_SOURCES.desktop || CDN_SOURCES.mobile || LOCAL_VIDEO_FALLBACK;
  }

  return CDN_SOURCES.desktop || CDN_SOURCES.mobile || CDN_SOURCES.cinema || LOCAL_VIDEO_FALLBACK;
}

export function PidecVideoSection() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  return (
    <section id="details-video" className="relative overflow-hidden px-6 py-12 sm:py-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_8%,rgba(18,183,234,0.13),transparent_24%),radial-gradient(circle_at_82%_88%,rgba(255,85,0,0.12),transparent_28%)]" />
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="brand-panel relative overflow-hidden rounded-[2rem] p-4 sm:rounded-[2.5rem] sm:p-6 lg:p-8">
            <BrandIcon
              name="gear"
              width={170}
              height={170}
              sizes="170px"
              className="absolute -right-10 -top-12 opacity-[0.07]"
            />
            <BrandIcon
              name="chip"
              width={96}
              height={102}
              sizes="96px"
              className="absolute -bottom-8 left-8 opacity-[0.08]"
            />

            <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
              <div className="relative z-10 px-2 py-2 sm:px-4">
                <p className="brand-kicker text-[var(--brand-cyan)]">Watch the guide</p>
                <h2 className="mt-4 max-w-xl text-balance font-heading text-4xl font-semibold tracking-[-0.07em] text-[var(--brand-plum)] sm:text-5xl">
                  Understand PIDEC in a minute.
                </h2>
                <p className="mt-4 max-w-xl text-base leading-8 text-[var(--brand-plum-soft)] sm:text-lg">
                  See what the challenge is about, how teams get started, and what to expect across the competition.
                </p>
              </div>

              <div className="relative z-10 overflow-hidden rounded-[1.6rem] border border-[rgba(42,0,59,0.12)] bg-[var(--brand-plum)] shadow-[0_26px_70px_rgba(42,0,59,0.18)]">
                <div className="relative aspect-video">
                  {videoSrc ? (
                    <video
                      key={videoSrc}
                      className="h-full w-full bg-black object-cover"
                      controls
                      playsInline
                      preload="metadata"
                      poster={POSTER_URL}
                      aria-label="PIDEC details video"
                      autoPlay
                      onEnded={() => setVideoSrc(null)}
                    >
                      <source src={videoSrc} />
                      Your browser does not support this video.
                    </video>
                  ) : (
                    <button
                      type="button"
                      className="group absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden text-left"
                      onClick={() => setVideoSrc(selectVideoSource())}
                      aria-label="Play PIDEC details video"
                    >
                      {POSTER_URL ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={POSTER_URL}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_22%,rgba(18,183,234,0.32),transparent_30%),linear-gradient(135deg,#2a003b_0%,#431158_48%,#ff5500_120%)]" />
                      )}
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(42,0,59,0.72),rgba(42,0,59,0.34)_48%,rgba(255,85,0,0.36))]" />
                      <div className="relative z-10 flex max-w-md flex-col items-center px-6 text-center text-white">
                        <BrandLogo variant="white" width={150} height={64} sizes="150px" className="h-12 w-auto" />
                        <span className="mt-7 flex h-16 w-16 items-center justify-center rounded-full bg-white text-[var(--brand-plum)] shadow-[0_18px_44px_rgba(0,0,0,0.24)] transition duration-300 group-hover:scale-105">
                          <Play className="ml-1 h-7 w-7 fill-current" />
                        </span>
                        <span className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-cyan-soft)]">
                          Play video
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
