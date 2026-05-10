'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';

import { useSidebar } from '@/components/ui/sidebar';

export function SidebarLink({ onClick, ...props }: ComponentProps<typeof Link>) {
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Link
      {...props}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented && isMobile) {
          setOpenMobile(false);
        }
      }}
    />
  );
}
