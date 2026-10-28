import { Link } from "@tanstack/react-router";
import type { ComponentType } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export function EmptyPage({ title, subtitle, icon: Icon, message }: { title: string; subtitle: string; icon: ComponentType<{ className?: string }>; message: string }) {
  return (
    <AppShell title={title} subtitle={subtitle}>
       <div className="grid items-center gap-fields p-panel sm:grid-cols-[auto_minmax(0,1fr)_auto]">
         <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-accent/50 text-lavender"><Icon className="h-5 w-5" /></span>
         <p className="min-w-0 text-sm text-muted-foreground">{message}</p>
         <Button asChild className="justify-self-start"><Link to="/purchase-traffic">Purchase Traffic</Link></Button>
      </div>
    </AppShell>
  );
}
