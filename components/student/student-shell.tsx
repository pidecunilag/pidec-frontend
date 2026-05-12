"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Loader2,
  LogOut,
  MessageSquareText,
  ShieldAlert,
  ShieldCheck,
  Users2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { BrandLogo } from "@/components/brand/brand-assets";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SidebarCloseButton } from "@/components/ui/sidebar-close-button";
import { SidebarLink } from "@/components/ui/sidebar-link";
import { useAuth } from "@/lib/hooks/use-auth";
import { useNotifications } from "@/lib/hooks/use-notifications";
import { useVerification } from "@/lib/hooks/use-verification";
import type { VerificationStatus } from "@/lib/types";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Team", href: "/dashboard/team", icon: Users2 },
  { label: "Submissions", href: "/dashboard/submissions", icon: FileText },
  { label: "Feedback", href: "/dashboard/feedback", icon: MessageSquareText },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
];

export function StudentShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const shouldWatchVerification =
    user?.role === "student" && user.verificationStatus !== "verified";
  const { status: liveVerificationStatus } = useVerification({
    poll: shouldWatchVerification,
  });
  const { unreadCount } = useNotifications();
  const verificationStatus =
    liveVerificationStatus ?? user?.verificationStatus ?? "pending";
  const isVerified = verificationStatus === "verified";
  const activeItem =
    NAV_ITEMS.find((item) =>
      item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname.startsWith(item.href),
    ) ?? NAV_ITEMS[0];

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
          "--sidebar-width-icon": "4.5rem",
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
              href="/dashboard"
              className="flex min-w-0 flex-1 items-center gap-3 group-data-[collapsible=icon]:flex-none"
              aria-label="PIDEC student dashboard"
            >
              <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5 shadow-[0_12px_22px_rgba(42,0,59,0.14)] ring-1 ring-[rgba(42,0,59,0.08)] group-data-[collapsible=icon]:flex">
                <BrandLogo
                  width={44}
                  height={19}
                  sizes="44px"
                  className="w-full"
                />
              </span>
              <span className="min-w-0 group-data-[collapsible=icon]:hidden">
                <BrandLogo
                  priority
                  width={122}
                  height={52}
                  sizes="122px"
                  className="h-8 w-auto"
                />
              </span>
            </SidebarLink>
            <SidebarCloseButton />
          </div>
        </SidebarHeader>

        <SidebarContent className="gap-5 px-3 py-2">
          <SidebarGroup className="px-0 py-0">
            <SidebarMenu className="gap-1.5">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
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
                        {item.href.endsWith("notifications") &&
                        unreadCount > 0 ? (
                          <Badge className="ml-auto rounded-full bg-[var(--brand-orange)] px-2 py-0 text-[0.65rem] text-white group-data-[collapsible=icon]:hidden">
                            {unreadCount}
                          </Badge>
                        ) : isActive ? (
                          <span className="ml-auto h-2 w-2 rounded-full bg-[var(--brand-orange)] group-data-[collapsible=icon]:hidden" />
                        ) : null}
                      </SidebarLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <div className="rounded-2xl border border-[rgba(42,0,59,0.1)] bg-white p-3 shadow-[0_16px_36px_rgba(42,0,59,0.06)] group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:shadow-none">
            <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--brand-purple),var(--brand-orange))] text-sm font-bold text-white shadow-[0_12px_22px_rgba(142,77,255,0.24)]">
                {user?.name?.charAt(0).toUpperCase() ?? "S"}
              </div>
              <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-semibold text-[var(--brand-plum)]">
                  {user?.name ?? "Student"}
                </p>
                <p className="truncate text-xs text-[var(--brand-plum-soft)]/70">
                  {user?.department}
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
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-[rgba(42,0,59,0.08)] bg-[#f7f4fb]/92 px-5 backdrop-blur">
          <SidebarTrigger className="-ml-1 rounded-xl hover:bg-white" />
          <Separator
            orientation="vertical"
            className="mr-1 h-5 bg-[rgba(42,0,59,0.12)]"
          />
          <div className="min-w-0">
            <h1 className="font-heading text-xl font-semibold tracking-[-0.04em] text-[var(--brand-plum)]">
              {activeItem.label}
            </h1>
          </div>
          {isVerified ? (
            <Button
              asChild
              size="sm"
              className="ml-auto hidden rounded-xl sm:inline-flex"
            >
              <Link href="/dashboard/submissions">
                <ClipboardList className="mr-2 h-4 w-4" />
                Submit
              </Link>
            </Button>
          ) : null}
        </header>

        <main className="student-workspace flex-1 p-5 lg:p-8">
          {isVerified ? (
            children
          ) : (
            <VerificationGate status={verificationStatus} onLogout={logout} />
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function VerificationGate({
  status,
  onLogout,
}: {
  status: VerificationStatus;
  onLogout: () => Promise<unknown>;
}) {
  if (status === "rejected") {
    return (
      <div className="mx-auto flex min-h-[calc(100dvh-8rem)] max-w-2xl items-center">
        <div className="w-full rounded-2xl border border-[rgba(214,64,69,0.2)] bg-white p-6 shadow-[0_18px_44px_rgba(42,0,59,0.08)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(214,64,69,0.1)]">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <h2 className="mt-5 font-heading text-3xl font-semibold tracking-[-0.04em] text-[var(--brand-plum)]">
            Verification unsuccessful
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            The final document check could not match your registration details.
            Upload a clearer exam docket or course form to try again.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/register">Re-upload document</Link>
            </Button>
            <Button variant="outline" onClick={() => void onLogout()}>
              Sign out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "flagged") {
    return (
      <div className="mx-auto flex min-h-[calc(100dvh-8rem)] max-w-2xl items-center">
        <div className="w-full rounded-2xl border border-amber-500/25 bg-white p-6 shadow-[0_18px_44px_rgba(42,0,59,0.08)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
            <ShieldAlert className="h-6 w-6 text-amber-600" />
          </div>
          <h2 className="mt-5 font-heading text-3xl font-semibold tracking-[-0.04em] text-[var(--brand-plum)]">
            Verification needs review
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            The automated checks could not confidently finalize your document.
            Team and submission actions remain locked until your account is
            verified.
          </p>
          <div className="mt-6">
            <Button variant="outline" onClick={() => void onLogout()}>
              Sign out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-8rem)] max-w-2xl items-center">
      <div className="w-full rounded-2xl border border-[rgba(18,183,234,0.2)] bg-white p-6 shadow-[0_18px_44px_rgba(42,0,59,0.08)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(18,183,234,0.12)]">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--brand-cyan)]" />
        </div>
        <h2 className="mt-5 font-heading text-3xl font-semibold tracking-[-0.04em] text-[var(--brand-plum)]">
          Finalizing verification
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          We are comparing your registration details with the uploaded document.
          This usually finishes within a minute, and dashboard actions unlock
          automatically once verified.
        </p>
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-[rgba(18,183,234,0.08)] px-4 py-3 text-sm font-medium text-[var(--brand-plum)]">
          <ShieldCheck className="h-4 w-4 text-[var(--brand-cyan)]" />
          Keep this page open; no action is needed.
        </div>
      </div>
    </div>
  );
}
