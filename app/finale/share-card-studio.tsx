'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  Camera,
  Check,
  Download,
  ExternalLink,
  Loader2,
  Sparkles,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FinaleCardRegistration } from '@/lib/types';
import { FinaleShareCard } from './finale-share-card';
import { renderFinaleCard } from './render-finale-card';

const WHATSAPP_URL = 'https://chat.whatsapp.com/Fs4FQGkmTE48dAwt6fb4DY';

type FinaleShareCardStudioProps = {
  registration: FinaleCardRegistration;
  statusLabel: string;
  footerText: string;
};

export function FinaleShareCardStudio({
  registration,
  statusLabel,
  footerText,
}: FinaleShareCardStudioProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoPosition, setPhotoPosition] = useState(50);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cardScale, setCardScale] = useState(1);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardViewportRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const viewport = cardViewportRef.current;
    if (!viewport) return;
    const updateScale = () =>
      setCardScale(Math.min(1, viewport.clientWidth / 540));
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  async function selectPhoto(event: ChangeEvent<HTMLInputElement>) {
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
    setIsPhotoLoading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () =>
          typeof reader.result === 'string'
            ? resolve(reader.result)
            : reject(new Error('Could not read the selected photo'));
        reader.onerror = () => reject(reader.error ?? new Error('Could not read the selected photo'));
        reader.readAsDataURL(file);
      });
      setPhotoUrl(dataUrl);
      setPhotoPosition(50);
    } catch {
      toast.error('We could not prepare that photo. Please choose another one.');
      event.target.value = '';
    } finally {
      setIsPhotoLoading(false);
    }
  }

  function removePhoto() {
    setPhotoUrl(null);
    if (photoInputRef.current) photoInputRef.current.value = '';
  }

  async function makeCardBlob(): Promise<Blob> {
    return renderFinaleCard({
      firstName: registration.firstName,
      registrationNumber: registration.registrationNumber,
      photoUrl,
      photoPosition,
    });
  }

  async function downloadCard() {
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

  return (
    <div>
      <div className="flex items-center gap-3 border-b border-[#2a003b]/10 pb-5">
        <span className="flex h-11 w-11 items-center justify-center bg-[#e4f8ee] text-[#167447]">
          <Check />
        </span>
        <div>
          <p className="text-sm font-bold text-[#167447]">{statusLabel}</p>
          <p className="font-mono text-sm text-[#765784]">
            {registration.registrationNumber}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs font-bold uppercase text-[#8e4dff]">
          Share the moment
        </p>
        <h1 className="mt-2 text-3xl font-semibold">
          Make your “I&apos;m going” card
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#725a7d]">
          Add a photo if you like, adjust it, then download your square card to
          share. Your photo never leaves this device.
        </p>
      </div>

      <div
        ref={cardViewportRef}
        className="mt-6 w-full min-w-0 max-w-full overflow-hidden"
        style={{ height: 540 * cardScale }}
      >
        <div
          className="w-[540px]"
          style={{
            transform: `scale(${cardScale})`,
            transformOrigin: 'top left',
          }}
        >
          <FinaleShareCard
            ref={cardRef}
            firstName={registration.firstName}
            registrationNumber={registration.registrationNumber}
            photoUrl={photoUrl}
            photoPosition={photoPosition}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Label
          htmlFor="finale-photo"
          className="inline-flex h-10 cursor-pointer items-center gap-2 border border-[#2a003b]/15 bg-white px-4 text-sm font-semibold hover:bg-[#f3edf7]"
        >
          <Camera className="h-4 w-4" />
          {photoUrl ? 'Change photo' : 'Add a photo'}
        </Label>
        <Input
          ref={photoInputRef}
          id="finale-photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={selectPhoto}
          className="hidden"
        />
        {photoUrl ? (
          <Button
            type="button"
            variant="ghost"
            onClick={removePhoto}
          >
            <X />
            Remove
          </Button>
        ) : null}
      </div>
      {photoUrl ? (
        <div className="mt-4 space-y-2">
          <Label htmlFor="photo-position">Photo position</Label>
          <input
            id="photo-position"
            type="range"
            min="0"
            max="100"
            value={photoPosition}
            onChange={(event) => setPhotoPosition(Number(event.target.value))}
            className="w-full accent-[#8e4dff]"
          />
        </div>
      ) : null}

      <div className="mt-6">
        <Button
          type="button"
          size="lg"
          disabled={isGenerating || isPhotoLoading}
          onClick={downloadCard}
          className="h-11 w-full bg-[#2a003b] text-white hover:bg-[#431158]"
        >
          {isGenerating || isPhotoLoading ? <Loader2 className="animate-spin" /> : <Download />}
          {isPhotoLoading ? 'Preparing photo' : 'Download PNG'}
        </Button>
      </div>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        className="mt-5 flex items-center justify-between border border-[#2a003b]/10 bg-[#edfff4] px-4 py-3 text-sm font-semibold text-[#12643d] hover:bg-[#dff9e9]"
      >
        Join the PIDEC Finale WhatsApp group
        <ExternalLink className="h-4 w-4" />
      </a>
      <p className="mt-5 flex items-center gap-2 text-xs text-[#7b6485]">
        <Sparkles className="h-4 w-4 shrink-0 text-[#ff5500]" />
        {footerText}
      </p>
    </div>
  );
}
