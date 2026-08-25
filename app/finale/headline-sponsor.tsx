import Image from 'next/image';

export function FinaleHeadlineSponsor() {
  return (
    <div className="mt-6 flex min-h-16 items-center justify-between gap-5 border-l-4 border-[#009572] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(42,0,59,0.06)] sm:justify-start">
      <p className="text-[11px] font-bold uppercase text-[#725a7d]">
        Headline sponsor
      </p>
      <Image
        src="/sponsors/bitnob-primary.svg"
        alt="Bitnob"
        width={183}
        height={40}
        className="h-7 w-auto"
      />
    </div>
  );
}
