"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { BrandIcon, BrandLogo } from "@/components/brand/brand-assets";

const SLIDESHOW_IMAGES = [
  "/auth/engineering-lab.jpg",
  "/auth/student-workspace.jpg",
  "/auth/prototype-build.jpg",
];

export default function PublicAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("auth-page");
    document.body.classList.add("auth-page");
    return () => {
      document.documentElement.classList.remove("auth-page");
      document.body.classList.remove("auth-page");
    };
  }, []);

  return (
    <div className="relative flex min-h-dvh w-full overflow-hidden bg-[#fbf9fd] text-[var(--brand-plum)] lg:h-dvh lg:max-h-dvh">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(18,183,234,0.18),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(255,85,0,0.16),transparent_28%),linear-gradient(180deg,#fbf9fd_0%,#f3ecfb_58%,#fff2e9_100%)] lg:hidden" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent_0,transparent_39px,rgba(42,0,59,0.05)_39px,rgba(42,0,59,0.05)_40px),linear-gradient(transparent_0,transparent_39px,rgba(42,0,59,0.05)_39px,rgba(42,0,59,0.05)_40px)] bg-[size:40px_40px] lg:hidden" />
      <BrandIcon
        name="gear"
        width={96}
        height={96}
        sizes="96px"
        className="brand-float-accent absolute -right-8 top-28 opacity-[0.08] lg:hidden"
      />
      <BrandIcon
        name="chip"
        width={72}
        height={76}
        sizes="72px"
        className="absolute bottom-20 left-4 opacity-[0.1] lg:hidden"
      />

      <div className="flex min-h-dvh w-full items-start py-8 sm:py-10 lg:h-dvh lg:min-h-0 lg:py-0">
        <div className="relative z-10 flex w-full flex-col justify-start lg:h-dvh lg:w-[46%] lg:overflow-y-auto lg:bg-[#fbf9fd] lg:py-10">
          <div className="px-5 pb-5 pt-2 sm:px-8 md:px-10">
            <div className="mx-auto flex max-w-xl items-center justify-between rounded-[1.25rem] border border-[rgba(42,0,59,0.08)] bg-white px-5 py-4 shadow-[0_14px_34px_rgba(42,0,59,0.06)] animate-in fade-in slide-in-from-top-3 duration-500">
              <Link
                href="/"
                className="flex items-center text-sm font-medium text-[var(--brand-plum-soft)] transition-colors hover:text-[var(--brand-plum)]"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>

              <BrandLogo priority width={112} height={48} sizes="112px" className="h-8 w-auto" />
            </div>
          </div>

          <div className="px-5 pb-4 pt-0 sm:px-8 md:px-10">
            <div className="mx-auto w-full max-w-xl rounded-[1.5rem] border border-white/60 bg-white/88 p-6 shadow-[0_22px_56px_rgba(42,0,59,0.1)] backdrop-blur animate-in fade-in zoom-in-95 duration-500 sm:rounded-[2rem] sm:p-9 lg:border-[rgba(42,0,59,0.08)] lg:bg-white">
              {children}
            </div>
          </div>
        </div>

        <div className="relative hidden h-dvh overflow-hidden lg:flex lg:w-[54%] lg:items-stretch">
          <div className="relative h-full w-full overflow-hidden border-l border-[rgba(42,0,59,0.06)] shadow-[0_28px_72px_rgba(42,0,59,0.12)] animate-in fade-in slide-in-from-right-4 duration-700">
            {SLIDESHOW_IMAGES.map((src, index) => (
              <Image
                key={src}
                src={src}
                alt="Engineering students collaborating"
                fill
                sizes="54vw"
                priority={index === 0}
                className={`object-cover transition-[opacity,transform] duration-[1400ms] ease-out ${
                  index === currentImageIndex ? "scale-100 opacity-100" : "scale-105 opacity-0"
                }`}
              />
            ))}

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(42,0,59,0.1)_0%,rgba(42,0,59,0.32)_52%,rgba(42,0,59,0.7)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(109,45,255,0.18)_0%,rgba(18,183,234,0.06)_48%,rgba(255,85,0,0.18)_100%)]" />
            <BrandLogo
              variant="white"
              width={150}
              height={64}
              sizes="150px"
              className="absolute left-10 top-10 h-10 w-auto opacity-90"
            />
            <BrandIcon
              name="gear"
              width={110}
              height={110}
              sizes="110px"
              className="brand-float-accent absolute right-10 top-12 opacity-30"
            />

            <div className="absolute bottom-12 left-10 right-10 text-white animate-in fade-in slide-in-from-bottom-3 duration-700">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-cyan-soft)]">
                Engineering for Impact
              </p>
              <h2 className="mt-4 max-w-xl font-heading text-5xl font-semibold leading-tight tracking-[-0.06em]">
                Access the PIDEC platform built for bold ideas.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-8 text-white/82">
                Manage your account, move through verification, and keep up with
                every part of the PIDEC journey in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
