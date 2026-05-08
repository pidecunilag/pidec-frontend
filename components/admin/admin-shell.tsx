'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
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
  ChevronRight,
} from 'lucide-react';

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

const NAV_ITEMS = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Verifications', href: '/admin/verifications', icon: ShieldAlert },
  { label: 'Students', href: '/admin/students', icon: Users },
  { label: 'Teams', href: '/admin/teams', icon: Users2 },
  { label: 'Submissions', href: '/admin/submissions', icon: FileText },
  { label: 'Tokens', href: '/admin/tokens', icon: KeyRound },
  { label: 'Judges', href: '/admin/judges', icon: Gavel },
  { label: 'Feedback', href: '/admin/feedback', icon: MessageSquare },
  { label: 'Content', href: '/admin/content', icon: Globe },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
  { label: 'Exports', href: '/admin/exports', icon: Download },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="p-4">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <span className="bg-brand text-white rounded-md px-2 py-0.5 text-sm font-black">P</span>
            <span className="group-data-[collapsible=icon]:hidden">PIDEC Admin</span>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
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
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                        {isActive && (
                          <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">
              {user?.name?.charAt(0).toUpperCase() ?? 'A'}
            </div>
            <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-medium truncate">{user?.name ?? 'Admin'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start mt-2 text-muted-foreground hover:text-destructive group-data-[collapsible=icon]:justify-center"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4 mr-2 group-data-[collapsible=icon]:mr-0" />
            <span className="group-data-[collapsible=icon]:hidden">Sign out</span>
          </Button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-sm font-semibold text-muted-foreground">
            {NAV_ITEMS.find(
              (n) =>
                n.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(n.href),
            )?.label ?? 'Admin'}
          </h1>
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
