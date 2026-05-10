'use client';

import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShieldAlert,
  Users,
  Users2,
  FileText,
  KeyRound,
  Gavel,
  MessageSquare,
  Globe,
  Settings,
  Download,
  LogOut,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { BrandLogo } from '@/components/brand/brand-assets';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/hooks/use-auth';
import { SidebarCloseButton } from '@/components/ui/sidebar-close-button';
import { SidebarLink } from '@/components/ui/sidebar-link';

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Command',
    items: [
      { label: 'Overview', href: '/admin', icon: LayoutDashboard },
      { label: 'Verifications', href: '/admin/verifications', icon: ShieldAlert },
      { label: 'Students', href: '/admin/students', icon: Users },
      { label: 'Teams', href: '/admin/teams', icon: Users2 },
    ],
  },
  {
    label: 'Competition',
    items: [
      { label: 'Submissions', href: '/admin/submissions', icon: FileText },
      { label: 'Tokens', href: '/admin/tokens', icon: KeyRound },
      { label: 'Judges', href: '/admin/judges', icon: Gavel },
      { label: 'Feedback', href: '/admin/feedback', icon: MessageSquare },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Content', href: '/admin/content', icon: Globe },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
      { label: 'Exports', href: '/admin/exports', icon: Download },
    ],
  },
] as const;

const NAV_ITEMS = NAV_SECTIONS.flatMap((section) => section.items);

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const activeItem =
    NAV_ITEMS.find((item) =>
      item.href === '/admin'
        ? pathname === '/admin'
        : pathname.startsWith(item.href),
    ) ?? NAV_ITEMS[0];

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '18rem',
          '--sidebar-width-icon': '4.5rem',
        } as React.CSSProperties
      }
    >
      <Sidebar
        collapsible="icon"
        className="border-r border-[rgba(42,0,59,0.1)] bg-[#fbf9fd] shadow-[12px_0_36px_rgba(42,0,59,0.05)]"
      >
        <SidebarHeader className="px-4 pb-4 pt-5">
          <div className="flex items-center gap-3 rounded-2xl border border-[rgba(42,0,59,0.1)] bg-white px-3 py-3 shadow-[0_14px_34px_rgba(42,0,59,0.06)] transition-[box-shadow,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_18px_42px_rgba(42,0,59,0.08)] group-data-[collapsible=icon]:justify-center">
            <SidebarLink
              href="/admin"
              className="flex min-w-0 flex-1 items-center gap-3 group-data-[collapsible=icon]:flex-none"
              aria-label="PIDEC admin home"
            >
              <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5 shadow-[0_12px_22px_rgba(42,0,59,0.14)] ring-1 ring-[rgba(42,0,59,0.08)] group-data-[collapsible=icon]:flex">
                <BrandLogo width={44} height={19} sizes="44px" className="w-full" />
              </span>
              <span className="min-w-0 group-data-[collapsible=icon]:hidden">
                <BrandLogo priority width={122} height={52} sizes="122px" className="h-8 w-auto" />
              </span>
            </SidebarLink>
            <SidebarCloseButton />
          </div>
        </SidebarHeader>

        <SidebarContent className="gap-5 px-3 py-2">
          {NAV_SECTIONS.map((section) => (
            <SidebarGroup key={section.label} className="px-0 py-0">
              <SidebarGroupLabel className="mb-2 h-auto px-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--brand-plum-soft)]/60">
                {section.label}
              </SidebarGroupLabel>
              <SidebarMenu className="gap-1.5">
                {section.items.map((item) => {
                  const isActive =
                    item.href === '/admin'
                      ? pathname === '/admin'
                      : pathname.startsWith(item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                        size="lg"
                        className="h-11 rounded-xl px-3 text-[0.95rem] font-medium text-[var(--brand-plum-soft)] transition-[background-color,color,box-shadow] data-[active=true]:bg-[var(--brand-plum)] data-[active=true]:text-white data-[active=true]:shadow-[0_12px_28px_rgba(42,0,59,0.18)] hover:bg-white hover:text-[var(--brand-plum)] hover:shadow-[0_10px_24px_rgba(42,0,59,0.06)] group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:h-11 group-data-[collapsible=icon]:w-11"
                      >
                        <SidebarLink href={item.href}>
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[rgba(42,0,59,0.06)] text-[var(--brand-plum-soft)] group-data-[active=true]/menu-button:bg-white/14 group-data-[active=true]/menu-button:text-white">
                            <item.icon className="h-4 w-4" />
                          </span>
                          <span>{item.label}</span>
                          {isActive ? (
                            <span className="ml-auto h-2 w-2 rounded-full bg-[var(--brand-orange)] group-data-[collapsible=icon]:hidden" />
                          ) : null}
                        </SidebarLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="p-4">
          <div className="rounded-2xl border border-[rgba(42,0,59,0.1)] bg-white p-3 shadow-[0_16px_36px_rgba(42,0,59,0.06)] group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:shadow-none">
            <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--brand-purple),var(--brand-orange))] text-sm font-bold text-white shadow-[0_12px_22px_rgba(142,77,255,0.24)]">
                {user?.name?.charAt(0).toUpperCase() ?? 'A'}
              </div>
              <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-semibold text-[var(--brand-plum)]">
                  {user?.name ?? 'Admin'}
                </p>
                <p className="truncate text-xs text-[var(--brand-plum-soft)]/70">
                  {user?.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Sign out"
                className="ml-auto h-10 w-10 shrink-0 rounded-xl text-[var(--brand-plum-soft)] hover:bg-[rgba(214,64,69,0.08)] hover:text-destructive group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:hidden"
                onClick={() => logout()}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Sign out"
              className="mt-3 hidden h-10 w-10 justify-center rounded-xl text-[var(--brand-plum-soft)] hover:bg-[rgba(214,64,69,0.08)] hover:text-destructive group-data-[collapsible=icon]:flex"
              onClick={() => logout()}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-[#f7f4fb]">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-[rgba(42,0,59,0.08)] bg-[#f7f4fb]/92 px-5 backdrop-blur">
          <SidebarTrigger className="-ml-1 rounded-xl hover:bg-white" />
          <Separator orientation="vertical" className="mr-1 h-5 bg-[rgba(42,0,59,0.12)]" />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-plum-soft)]/60">
              Admin Console
            </p>
            <h1 className="font-heading text-xl font-semibold tracking-[-0.04em] text-[var(--brand-plum)]">
              {activeItem.label}
            </h1>
          </div>
        </header>

        <main className="admin-workspace flex-1 p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
