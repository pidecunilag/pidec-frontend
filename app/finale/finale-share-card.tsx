'use client';

import Image from 'next/image';
import { forwardRef } from 'react';

type FinaleShareCardProps = {
  firstName: string;
  registrationNumber: string;
  photoUrl: string | null;
  photoPosition: number;
};

export const FinaleShareCard = forwardRef<HTMLDivElement, FinaleShareCardProps>(
  ({ firstName, registrationNumber, photoUrl, photoPosition }, ref) => (
    <div
      ref={ref}
      className="relative h-[540px] w-[540px] overflow-hidden bg-[#12081c] text-[#230031]"
      aria-label={`${firstName} is going to the PIDEC 1.0 Grand Finale`}
    >
      <div className="absolute inset-0 bg-[#8142df]" />
      <div className="absolute inset-0 opacity-100 [background-image:linear-gradient(30deg,#12081c_12%,transparent_12.5%,transparent_87%,#12081c_87.5%,#12081c),linear-gradient(150deg,#12081c_12%,transparent_12.5%,transparent_87%,#12081c_87.5%,#12081c),linear-gradient(30deg,#12081c_12%,transparent_12.5%,transparent_87%,#12081c_87.5%,#12081c),linear-gradient(150deg,#12081c_12%,transparent_12.5%,transparent_87%,#12081c_87.5%,#12081c)] [background-position:0_0,0_0,38px_66px,38px_66px] [background-size:76px_132px]" />

      <div className="absolute inset-[24px] flex flex-col bg-white px-10 pb-8 pt-7 shadow-[0_0_0_5px_rgba(255,255,255,0.5)]">
        <div className="flex items-center justify-between gap-6 border-b-2 border-[#ede3f5] pb-4">
          <Image
            src="/logos/Coloured Logo Black text Trans.png"
            alt="PIDEC 1.0"
            width={170}
            height={66}
            className="h-[46px] w-auto object-contain"
          />
          <p className="max-w-[180px] text-right text-[11px] font-bold uppercase leading-[1.35] text-[#6d3fa0]">
            Engineering for Impact
          </p>
        </div>

        <div className="mt-5 flex min-h-0 flex-1 items-center gap-7">
          <div className="relative h-[210px] w-[180px] shrink-0 overflow-hidden border-[7px] border-[#8e4dff] bg-[#eadff8] shadow-[10px_10px_0_#ff5500]">
            {photoUrl ? (
              // The object URL is local to the attendee's browser and is never uploaded.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt="Attendee"
                className="h-full w-full object-cover"
                style={{ objectPosition: `center ${photoPosition}%` }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#2a003b] text-[72px] font-bold text-white">
                {firstName.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[19px] font-semibold leading-tight text-[#8e4dff]">{firstName}</p>
            <p className="mt-1 text-[39px] font-semibold uppercase leading-[0.98] text-[#2a003b]">
              is going to
            </p>
            <p className="mt-3 text-[25px] font-bold uppercase leading-[1.02] text-[#ff5500]">
              PIDEC 1.0
              <br />
              Grand Finale
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto] items-end gap-5 border-t-2 border-[#ede3f5] pt-4">
          <div>
            <p className="text-[14px] font-bold text-[#2a003b]">Friday, 28 August 2026</p>
            <p className="mt-1 text-[12px] leading-tight text-[#684577]">
              J.F. Ajayi Auditorium, University of Lagos
            </p>
          </div>
          <p className="bg-[#2a003b] px-3 py-2 font-mono text-[11px] font-semibold text-white">
            {registrationNumber}
          </p>
        </div>
      </div>
    </div>
  ),
);

FinaleShareCard.displayName = 'FinaleShareCard';
