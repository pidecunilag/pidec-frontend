'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  Camera,
  Check,
  Download,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Share2,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { BrandLogo } from '@/components/brand/brand-assets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { publicApi } from '@/lib/api/public';
import { extractApiError } from '@/lib/api/client';
import type { FinaleRegistrationConfirmation } from '@/lib/types';
import { FinaleShareCard } from './finale-share-card';

const WHATSAPP_URL = 'https://chat.whatsapp.com/Fs4FQGkmTE48dAwt6fb4DY';

export function FinaleRegistrationExperience() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '' });
  const [registration, setRegistration] = useState<FinaleRegistrationConfirmation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoPosition, setPhotoPosition] = useState(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cardScale, setCardScale] = useState(1);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = cardViewportRef.current;
    if (!viewport) return;
    const updateScale = () => setCardScale(Math.min(1, viewport.clientWidth / 540));
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [registration]);

  useEffect(() => () => {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
  }, [photoUrl]);

  async function submitRegistration(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await publicApi.registerForFinale(form);
      setRegistration(result);
      toast.success('Registration confirmed. Welcome to the finale!');
    } catch (error) {
      toast.error(extractApiError(error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function selectPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Choose a JPG, PNG, or WEBP photo.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error('Choose a photo smaller than 8MB.');
      return;
    }
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(URL.createObjectURL(file));
    setPhotoPosition(50);
  }

  async function makeCardBlob(): Promise<Blob> {
    if (!cardRef.current) throw new Error('Share card is not ready');
    const { toBlob } = await import('html-to-image');
    const blob = await toBlob(cardRef.current, {
      width: 540,
      height: 540,
      pixelRatio: 2,
      backgroundColor: '#8142df',
    });
    if (!blob) throw new Error('Could not generate the share card');
    return blob;
  }

  async function downloadCard() {
    if (!registration) return;
    setIsGenerating(true);
    try {
      const blob = await makeCardBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${registration.firstName}-is-going-to-PIDEC-1.0.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
      toast.success('Your share card has been downloaded.');
    } catch {
      toast.error('We could not generate the card. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }

  async function shareCard() {
    if (!registration) return;
    setIsGenerating(true);
    try {
      const blob = await makeCardBlob();
      const file = new File([blob], `${registration.firstName}-PIDEC-finale.png`, {
        type: 'image/png',
      });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: 'PIDEC 1.0 Grand Finale',
          text: `${registration.firstName} is going to the PIDEC 1.0 Grand Finale!`,
          files: [file],
        });
      } else {
        await downloadCard();
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      toast.error('Sharing is not available here. Download the card instead.');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-[#f8f5fb] text-[#2a003b]">
      <header className="border-b border-[#2a003b]/10 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-[#5b376b] hover:text-[#2a003b]">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <BrandLogo priority width={126} height={48} sizes="126px" className="h-9 w-auto" />
          <span className="hidden text-xs font-bold uppercase text-[#8e4dff] sm:block">Grand Finale</span>
        </div>
      </header>

      <div className="mx-auto grid w-full min-w-0 max-w-7xl gap-0 lg:min-h-[calc(100dvh-73px)] lg:grid-cols-[0.92fr_1.08fr]">
        <section className="relative hidden overflow-hidden bg-[#180d22] p-8 lg:flex lg:items-center lg:justify-center">
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(30deg,#8244da_12%,transparent_12.5%,transparent_87%,#8244da_87.5%,#8244da),linear-gradient(150deg,#8244da_12%,transparent_12.5%,transparent_87%,#8244da_87.5%,#8244da)] [background-size:90px_156px]" />
          <div className="relative h-[min(78dvh,720px)] w-full max-w-[576px] overflow-hidden border border-white/15 bg-black shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
            <Image
              src="/finale-poster.jpg"
              alt="PIDEC 1.0 Grand Finale poster"
              fill
              priority
              sizes="46vw"
              className="object-contain"
            />
          </div>
        </section>

        <section className="flex min-w-0 items-center overflow-hidden px-5 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-10 sm:px-8 lg:overflow-visible lg:px-14 lg:py-12">
          <div className="mx-auto w-full min-w-0 max-w-2xl">
            {!registration ? (
              <>
                <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                  Register for the PIDEC 1.0 Grand Finale
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-[#694b76]">
                  Engineering for Impact: Building Inclusive Solutions for a Sustainable Future.
                </p>

                <div className="mt-7 grid gap-3 border-y border-[#2a003b]/10 py-5 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="mt-0.5 h-5 w-5 text-[#ff5500]" />
                    <div>
                      <p className="text-sm font-bold">Friday, 28 August 2026</p>
                      <p className="mt-1 text-xs text-[#795d84]">Registration remains open on the day</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-[#12a9d7]" />
                    <div>
                      <p className="text-sm font-bold">J.F. Ajayi Auditorium</p>
                      <p className="mt-1 text-xs text-[#795d84]">University of Lagos</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={submitRegistration} className="mt-7 space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full name</Label>
                    <div className="relative">
                      <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7095]" />
                      <Input id="full-name" autoComplete="name" required minLength={2} maxLength={120} value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} placeholder="Your full name" className="h-11 bg-white pl-10" />
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7095]" />
                        <Input id="email" type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="you@example.com" className="h-11 bg-white pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7095]" />
                        <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" required value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} placeholder="0801 234 5678" className="h-11 bg-white pl-10" />
                      </div>
                    </div>
                  </div>
                  <Button type="submit" size="lg" disabled={isSubmitting} className="h-12 w-full bg-[#2a003b] px-5 text-base text-white hover:bg-[#431158]">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Check />}
                    Complete registration
                  </Button>
                  <p className="text-center text-xs leading-5 text-[#806a89]">
                    Your details are used for event registration, admission, and your confirmation email.
                  </p>
                </form>
              </>
            ) : (
              <div>
                <div className="flex items-center gap-3 border-b border-[#2a003b]/10 pb-5">
                  <span className="flex h-11 w-11 items-center justify-center bg-[#e4f8ee] text-[#167447]"><Check /></span>
                  <div>
                    <p className="text-sm font-bold text-[#167447]">Registration confirmed</p>
                    <p className="font-mono text-sm text-[#765784]">{registration.registrationNumber}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-xs font-bold uppercase text-[#8e4dff]">Optional sharing step</p>
                  <h1 className="mt-2 text-3xl font-semibold">Make your “I&apos;m going” card</h1>
                  <p className="mt-2 text-sm leading-6 text-[#725a7d]">
                    Add a photo if you like, adjust it, then download or share your square card.
                    Your photo never leaves this device.
                  </p>
                </div>

                <div
                  ref={cardViewportRef}
                  className="mt-6 w-full min-w-0 max-w-full overflow-hidden"
                  style={{ height: 540 * cardScale }}
                >
                  <div className="w-[540px]" style={{ transform: `scale(${cardScale})`, transformOrigin: 'top left' }}>
                    <FinaleShareCard ref={cardRef} firstName={registration.firstName} registrationNumber={registration.registrationNumber} photoUrl={photoUrl} photoPosition={photoPosition} />
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Label htmlFor="finale-photo" className="inline-flex h-10 cursor-pointer items-center gap-2 border border-[#2a003b]/15 bg-white px-4 text-sm font-semibold hover:bg-[#f3edf7]">
                    <Camera className="h-4 w-4" />
                    {photoUrl ? 'Change photo' : 'Add a photo'}
                  </Label>
                  <Input id="finale-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={selectPhoto} className="hidden" />
                  {photoUrl ? (
                    <Button type="button" variant="ghost" onClick={() => setPhotoUrl(null)}><X />Remove</Button>
                  ) : null}
                </div>
                {photoUrl ? (
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="photo-position">Photo position</Label>
                    <input id="photo-position" type="range" min="0" max="100" value={photoPosition} onChange={(event) => setPhotoPosition(Number(event.target.value))} className="w-full accent-[#8e4dff]" />
                  </div>
                ) : null}

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Button type="button" size="lg" disabled={isGenerating} onClick={downloadCard} className="h-11 bg-[#2a003b] text-white hover:bg-[#431158]">
                    {isGenerating ? <Loader2 className="animate-spin" /> : <Download />}Download PNG
                  </Button>
                  <Button type="button" size="lg" variant="outline" disabled={isGenerating} onClick={shareCard} className="h-11 bg-white"><Share2 />Share card</Button>
                </div>

                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-5 flex items-center justify-between border border-[#2a003b]/10 bg-[#edfff4] px-4 py-3 text-sm font-semibold text-[#12643d] hover:bg-[#dff9e9]">
                  Join the PIDEC Finale WhatsApp group
                  <ExternalLink className="h-4 w-4" />
                </a>
                <p className="mt-5 flex items-center gap-2 text-xs text-[#7b6485]"><Sparkles className="h-4 w-4 text-[#ff5500]" />A confirmation has been sent to {registration.email}.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
