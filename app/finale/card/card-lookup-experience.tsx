'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { ArrowLeft, Check, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';

import { BrandLogo } from '@/components/brand/brand-assets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { extractApiError } from '@/lib/api/client';
import { publicApi } from '@/lib/api/public';
import type { FinaleCardRegistration } from '@/lib/types';
import { FinaleShareCardStudio } from '../share-card-studio';

export function FinaleCardLookupExperience() {
  const [email, setEmail] = useState('');
  const [registration, setRegistration] =
    useState<FinaleCardRegistration | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  async function lookupRegistration(event: FormEvent) {
    event.preventDefault();
    setIsLookingUp(true);
    try {
      const result = await publicApi.lookupFinaleCard({ email });
      setRegistration(result);
      toast.success('Registration found. Your card is ready to personalise.');
    } catch (error) {
      toast.error(extractApiError(error).message);
    } finally {
      setIsLookingUp(false);
    }
  }

  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-[#f8f5fb] text-[#2a003b]">
      <header className="border-b border-[#2a003b]/10 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link
            href="/finale"
            className="flex items-center gap-2 text-sm font-semibold text-[#5b376b] hover:text-[#2a003b]"
          >
            <ArrowLeft className="h-4 w-4" />
            Finale
          </Link>
          <BrandLogo
            priority
            width={126}
            height={48}
            sizes="126px"
            className="h-9 w-auto"
          />
          <span className="hidden text-xs font-bold uppercase text-[#8e4dff] sm:block">
            Share card
          </span>
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
            {registration ? (
              <FinaleShareCardStudio
                registration={registration}
                statusLabel="Registration found"
                footerText={`Card details loaded for ${registration.email}.`}
              />
            ) : (
              <>
                <p className="text-xs font-bold uppercase text-[#8e4dff]">
                  Already registered?
                </p>
                <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
                  Create your PIDEC Finale share card
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-[#694b76]">
                  Enter the same email address you used to register. We&apos;ll
                  find your details so you can personalise and download your
                  card again.
                </p>

                <form onSubmit={lookupRegistration} className="mt-8 space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="card-email">Registration email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7095]" />
                      <Input
                        id="card-email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        className="h-12 bg-white pl-10"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isLookingUp}
                    className="h-12 w-full bg-[#2a003b] px-5 text-base text-white hover:bg-[#431158]"
                  >
                    {isLookingUp ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Check />
                    )}
                    Find my registration
                  </Button>
                </form>

                <p className="mt-6 text-sm text-[#725a7d]">
                  Haven&apos;t registered yet?{' '}
                  <Link
                    href="/finale"
                    className="font-semibold text-[#8e4dff] hover:text-[#6f31d5]"
                  >
                    Register for the finale
                  </Link>
                </p>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
