'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { ArrowLeft, CalendarDays, Check, Loader2, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import { toast } from 'sonner';

import { BrandLogo } from '@/components/brand/brand-assets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { extractApiError } from '@/lib/api/client';
import { publicApi } from '@/lib/api/public';
import type { FinaleRegistrationConfirmation } from '@/lib/types';
import { FinaleShareCardStudio } from './share-card-studio';

export function FinaleRegistrationExperience() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '' });
  const [registration, setRegistration] = useState<FinaleRegistrationConfirmation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
                <Link href="/finale/card" className="mt-4 inline-flex text-sm font-semibold text-[#8e4dff] hover:text-[#6f31d5]">
                  Already registered? Create your share card
                </Link>

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
              <FinaleShareCardStudio
                registration={registration}
                statusLabel="Registration confirmed"
                footerText={`A confirmation has been sent to ${registration.email}.`}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
