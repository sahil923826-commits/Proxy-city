import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutGrid,
  Server,
  CreditCard,
  BarChart3,
  LifeBuoy,
  Settings,
  Menu,
  X,
  Bell,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutGrid },
  { to: "/my-proxies", label: "My Proxies", icon: Server },
  { to: "/purchase-traffic", label: "Purchase Traffic", icon: CreditCard },
  { to: "/usage", label: "Usage & Analytics", icon: BarChart3 },
  { to: "/support", label: "Support", icon: LifeBuoy },
  { to: "/settings", label: "Account Settings", icon: Settings },
] as const;

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
        PC
      </span>
      <span className="text-lg font-bold tracking-tight">
        Proxy<span className="text-brand">City</span>
      </span>
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = to === "/" ? path === "/" : path.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function UserCard() {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-sidebar-border bg-background-2 px-2.5 py-2">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-[11px] font-semibold text-lavender">
        DU
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium leading-4">Demo User</p>
        <p className="text-[11px] leading-4 text-muted-foreground">Not signed in</p>
      </div>
      <LogOut className="h-4 w-4 shrink-0 text-muted-foreground" />
    </div>
  );
}

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-dvh items-stretch bg-background">
      <aside className="sticky top-0 hidden h-dvh min-h-0 w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-3 lg:flex">
        <div className="flex min-h-0 flex-1 flex-col gap-6">
          <div className="px-1 pt-1">
            <Logo />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <NavList />
          </div>
        </div>
        <UserCard />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
           <Button variant="ghost"
            aria-label="Close menu"
             className="absolute inset-0 h-full w-full rounded-none bg-background/80 p-0 backdrop-blur-sm hover:bg-background/80"
            onClick={() => setOpen(false)}
           />
          <aside className="relative flex h-full w-72 flex-col border-r border-sidebar-border bg-sidebar p-4">
            <div className="flex min-h-0 flex-1 flex-col gap-6">
              <div className="flex items-center justify-between">
                <Logo />
                 <Button variant="ghost" size="icon"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="rounded-md p-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                 </Button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <NavList onNavigate={() => setOpen(false)} />
              </div>
            </div>
            <UserCard />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
         <header className="sticky top-0 z-30 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-b border-border bg-background/90 px-page py-3 backdrop-blur sm:flex">
           <Button variant="outline" size="icon"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
             className="shrink-0 text-muted-foreground lg:hidden"
          >
            <Menu className="h-5 w-5" />
           </Button>
           <div className="min-w-0 flex-1 lg:col-span-2">
            <h1 className="truncate text-lg font-bold tracking-tight sm:text-xl">{title}</h1>
            {subtitle && (
              <p className="truncate text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
            )}
          </div>
           {actions && <div className="hidden shrink-0 sm:block">{actions}</div>}
           <Button variant="outline" size="icon"
            aria-label="Notifications"
             className="hidden shrink-0 text-muted-foreground sm:inline-flex"
          >
            <Bell className="h-4 w-4" />
           </Button>
        </header>
          <main className="w-full min-w-0 flex-1 p-page">{children}</main>
      </div>
    </div>
  );
}

export function Badge({
  children,
  tone = "brand",
}: {
  children: ReactNode;
  tone?: "brand" | "success" | "muted" | "error";
}) {
  const tones = {
    brand: "border-brand/30 bg-accent/60 text-lavender",
    success: "border-success/30 bg-success/10 text-success",
    muted: "border-border bg-muted text-muted-foreground",
    error: "border-destructive/30 bg-destructive/10 text-destructive",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        tones[tone],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function PanelHeader({
  icon: Icon,
  title,
  subtitle,
  badge,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  badge?: ReactNode;
}) {
  return (
     <div className="mb-heading grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-2 min-[480px]:grid-cols-[auto_minmax(0,1fr)_auto]">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-accent/50 text-lavender">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="font-semibold">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
       {badge && <div className="col-start-2 justify-self-start min-[480px]:col-start-3">{badge}</div>}
    </div>
  );
}
