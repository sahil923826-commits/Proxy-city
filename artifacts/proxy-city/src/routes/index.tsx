import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Copy,
  Database,
  Download,
  Gauge,
  Layers,
  KeyRound,
  SlidersHorizontal,
  Terminal,
  AlertTriangle,
  ShoppingCart,
  Plus,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";
import { AppShell, Badge, PanelHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — ProxyCity" },
      { name: "description", content: "Manage your ProxyCity proxies, configure gateways and track traffic usage." },
      { property: "og:title", content: "Dashboard — ProxyCity" },
      { property: "og:description", content: "Proxy management and traffic purchasing platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Overview,
});

// Demo values only — no proxy provider is connected.
const DEMO = { purchased: 50, used: 18.4 };

const FORMATS = {
  hpup: { label: "Host:Port:Username:Password", tpl: "{ENDPOINT_HOST}:{PORT}:{USERNAME}:{PASSWORD}" },
  uphp: { label: "Username:Password@Host:Port", tpl: "{USERNAME}:{PASSWORD}@{ENDPOINT_HOST}:{PORT}" },
  url: { label: "protocol://user:pass@host:port", tpl: "{PROTO}://{USERNAME}:{PASSWORD}@{ENDPOINT_HOST}:{PORT}" },
} as const;

function Overview() {
  const remaining = DEMO.purchased - DEMO.used;
  const pct = (DEMO.used / DEMO.purchased) * 100;
  return (
    <AppShell title="Dashboard" subtitle="Welcome back — manage your proxies and traffic.">
      <div className="mb-heading grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
        <h2 className="text-lg font-semibold">Traffic Overview</h2>
        <Badge>Demo data — provider not connected</Badge>
      </div>
      <div className="grid grid-cols-2 items-start gap-cards xl:grid-cols-4">
        <Stat label="Purchased Traffic" value={`${DEMO.purchased} GB`} icon={Database} />
        <Stat label="Used Traffic" value={`${DEMO.used} GB`} hint={`${pct.toFixed(1)}% of total`} icon={Download} />
        <Stat label="Remaining Traffic" value={`${remaining.toFixed(1)} GB`} icon={Gauge} />
        <Stat label="Proxy Type" value="Residential" icon={Layers} />
      </div>

      <section className="panel mt-cards grid items-center gap-fields p-panel xl:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <div className="mb-2 flex justify-between text-sm">
            <span>Bandwidth usage</span>
            <span className="text-muted-foreground">{pct.toFixed(1)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Used {DEMO.used} GB · Remaining {remaining.toFixed(1)} GB · Total {DEMO.purchased} GB
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2 xl:flex">
          <Button variant="outline" asChild><Link to="/purchase-traffic"><Plus /> Add Bandwidth</Link></Button>
          <Button asChild><Link to="/purchase-traffic"><ShoppingCart /> Purchase Traffic</Link></Button>
        </div>
      </section>

      <ProxyWorkspace />
    </AppShell>
  );
}

function Stat({ label, value, hint, icon: Icon }: { label: string; value: string; hint?: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="panel traffic-stat min-w-0 p-panel">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
        <span className="traffic-stat-icon">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-2 break-words text-xl font-bold leading-tight tabular-nums sm:text-2xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Segmented<T extends string>({ value, options, onChange }: { value: T; options: T[]; onChange: (v: T) => void }) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-md border border-border bg-background p-1">
      {options.map((o) => (
        <Button variant="ghost" key={o} onClick={() => onChange(o)} className={cn("h-9 min-w-0 rounded px-2 py-1.5 text-sm transition-colors", value === o ? "bg-accent text-lavender" : "text-muted-foreground hover:text-foreground")}>
          {o}
        </Button>
      ))}
    </div>
  );
}

const copy = (text: string, what: string) => {
  navigator.clipboard?.writeText(text).then(() => toast.success(`${what} copied`), () => toast.error("Couldn't copy"));
};

export function ProxyWorkspace() {
  const [country, setCountry] = useState("United States");
  const [asn, setAsn] = useState("");
  const [protocol, setProtocol] = useState<"HTTP" | "SOCKS5">("HTTP");
  const [mode, setMode] = useState<"Rotating" | "Sticky">("Rotating");
  const [gateway, setGateway] = useState("Global (auto)");
  const [format, setFormat] = useState<keyof typeof FORMATS>("hpup");
  const [showPw, setShowPw] = useState(false);

  const reset = () => { setCountry("United States"); setAsn(""); setProtocol("HTTP"); setMode("Rotating"); setGateway("Global (auto)"); setFormat("hpup"); };
  const generated = FORMATS[format].tpl.replace("{PROTO}", protocol === "HTTP" ? "http" : "socks5");
  const creds = [
    ["Endpoint / Host", "{ENDPOINT_HOST}"],
    ["Port", "{PORT}"],
    ["Username", "{USERNAME}"],
    ["Password", "{PASSWORD}"],
    ["Gateway", gateway],
  ] as const;

  return (
    <div className="mt-cards grid items-start gap-cards xl:grid-cols-2">
      <section id="proxy-configuration" className="panel h-auto min-w-0 self-start p-panel">
        <PanelHeader icon={SlidersHorizontal} title="Proxy Configuration" subtitle="Target location, protocol and output." />
        <div className="space-y-fields">
          <Field label="Country">
            <select className="field" value={country} onChange={(e) => setCountry(e.target.value)}>
              {["United States", "United Kingdom", "Germany", "India", "Canada", "Japan"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
           <div className="grid gap-fields min-[380px]:grid-cols-2">
            <Field label="State / Region"><select className="field"><option>Any region</option></select></Field>
            <Field label="City"><select className="field" disabled><option>Select region first</option></select></Field>
          </div>
          <Field label="ASN" hint="Optional">
            <input className="field" placeholder="e.g. AS15169" value={asn} maxLength={12} onChange={(e) => setAsn(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))} />
          </Field>
           <div className="grid gap-fields min-[380px]:grid-cols-2">
            <Field label="Protocol"><Segmented value={protocol} options={["HTTP", "SOCKS5"]} onChange={setProtocol} /></Field>
            <Field label="Proxy Mode"><Segmented value={mode} options={["Rotating", "Sticky"]} onChange={setMode} /></Field>
            <Field label="Gateway">
              <select className="field" value={gateway} onChange={(e) => setGateway(e.target.value)}>
                {["Global (auto)", "US East", "EU Central", "Asia Pacific"].map((g) => <option key={g}>{g}</option>)}
              </select>
            </Field>
            <Field label="Proxy Format">
              <select className="field" value={format} onChange={(e) => setFormat(e.target.value as keyof typeof FORMATS)}>
                {Object.entries(FORMATS).map(([k, f]) => <option key={k} value={k}>{f.label}</option>)}
              </select>
            </Field>
          </div>
          <div className="flex gap-2 border-t border-border pt-3">
            <Button onClick={() => toast("Configuration saved locally", { description: "It will apply once a proxy provider is connected." })}>Apply Configuration</Button>
            <Button variant="outline" onClick={reset}><RotateCcw /> Reset</Button>
          </div>
        </div>
      </section>

      <div className="grid min-w-0 items-start gap-cards">
        <section className="panel h-auto p-panel">
          <PanelHeader icon={KeyRound} title="Proxy Access Details" subtitle="Credentials for the selected gateway." badge={<Badge>Placeholders</Badge>} />
          <div className="mb-3 flex gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            Integration required — endpoint resolution needs a connected proxy provider.
          </div>
          <div className="space-y-2">
            {creds.map(([k, v]) => (
              <div key={k} className="flex items-center gap-2 rounded-lg border border-border bg-background-2 px-3 py-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</p>
                  <p className="truncate font-mono text-sm">{k === "Password" && !showPw ? "••••••••••" : v}</p>
                </div>
                {k === "Password" && (
                  <Button variant="ghost" size="icon" aria-label="Toggle password" onClick={() => setShowPw((s) => !s)} className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                )}
                <Button variant="outline" size="icon" aria-label={`Copy ${k}`} onClick={() => copy(v, k)} className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground">
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-3 w-full" onClick={() => copy(creds.map(([k, v]) => `${k}: ${v}`).join("\n"), "Credentials")}>
            <Copy /> Copy All Credentials
          </Button>
        </section>

        <section className="panel h-auto p-panel">
          <PanelHeader icon={Terminal} title="Generated Proxy" subtitle="Connection string in your selected format." badge={<Badge>Not a working proxy</Badge>} />
          <div className="rounded-lg border border-border bg-background-2 p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{protocol} · {mode}</p>
            <code className="mt-1 block break-all font-mono text-sm text-lavender">{generated}</code>
          </div>
          <Button variant="outline" className="mt-3 w-full" onClick={() => copy(generated, "Proxy string")}><Copy /> Copy Proxy</Button>
          <p className="mt-2 text-xs text-muted-foreground">Values in braces are placeholders. Real credentials appear only after the provider returns them.</p>
        </section>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-label flex justify-between text-sm">{label}{hint && <span className="text-xs text-muted-foreground">{hint}</span>}</span>
      {children}
    </label>
  );
}
