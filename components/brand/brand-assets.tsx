import Image from 'next/image';
import type { ImageProps } from 'next/image';

import { cn } from '@/lib/utils';

export const brandAssets = {
  logos: {
    darkText: '/logos/Coloured Logo Black text Trans.png',
    whiteText: '/logos/Coloured Logo White text Trans.png',
  },
  icons: {
    bulb: '/icons/Bulb.png',
    chip: '/icons/CHIP.png',
    gear: '/icons/Gear.png',
    nut: '/icons/Nut.png',
  },
} as const;

type BrandLogoProps = {
  variant?: 'dark' | 'white';
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
} & Omit<ImageProps, 'alt' | 'src' | 'width' | 'height' | 'priority' | 'sizes'>;

export function BrandLogo({
  variant = 'dark',
  className,
  priority = false,
  width = 148,
  height = 63,
  sizes = '148px',
  ...props
}: BrandLogoProps) {
  return (
    <Image
      src={variant === 'white' ? brandAssets.logos.whiteText : brandAssets.logos.darkText}
      alt="PIDEC 1.0"
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      className={cn('h-auto w-auto object-contain', className)}
      {...props}
    />
  );
}

type BrandIconName = keyof typeof brandAssets.icons;

type BrandIconProps = {
  name: BrandIconName;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
} & Omit<ImageProps, 'alt' | 'src' | 'width' | 'height' | 'priority' | 'sizes'>;

const ICON_DIMENSIONS: Record<BrandIconName, { width: number; height: number }> = {
  bulb: { width: 179, height: 264 },
  chip: { width: 210, height: 222 },
  gear: { width: 289, height: 289 },
  nut: { width: 216, height: 250 },
};

export function BrandIcon({
  name,
  className,
  priority = false,
  width,
  height,
  sizes = '96px',
  ...props
}: BrandIconProps) {
  const dimensions = ICON_DIMENSIONS[name];

  return (
    <Image
      src={brandAssets.icons[name]}
      alt=""
      aria-hidden="true"
      width={width ?? dimensions.width}
      height={height ?? dimensions.height}
      priority={priority}
      sizes={sizes}
      className={cn('pointer-events-none select-none object-contain', className)}
      {...props}
    />
  );
}
