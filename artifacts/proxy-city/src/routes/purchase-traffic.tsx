import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Gauge,
  Loader2,
  Lock,
  Mail,
  Sparkles,
  Tag,
  Wallet,
  Bitcoin,
} from "lucide-react";
import { AppShell, Badge, PanelHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import {
  PRICING_TIERS,
  calcSubtotal,
  formatUsd,
  getNextTierSuggestion,
  getTier,
  isContactSales,
  MAX_SELF_SERVE_GB,
} from "@/lib/pricing";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/purchase-traffic")({
  head: () => ({
    meta: [
      { title: "Purchase Traffic — ProxyCity" },
      { name: "description", content: "Choose your bandwidth and get the best available rate on ProxyCity residential proxies." },
      { property: "og:title", content: "Purchase Traffic — ProxyCity" },
      { property: "og:description", content: "Tiered bandwidth pricing from $0.70/GB with smart discount suggestions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PurchaseTraffic,
});

const planNameSchema = z
  .string()
  .trim()
  .min(1, "Enter a plan name")
  .max(50, "Keep it under 50 characters")
  .regex(/^[\p{L}\p{N} _\-.'()&]+$/u, "Use letters, numbers, spaces and - _ . ' ( ) &");

type MethodId = "cryptomus" | "stripe";
interface PaymentMethod {
  id: MethodId;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  /** True only when the provider is actually configured on the backend. */
  configured: boolean;
}

// No payment provider is connected to this app yet. Flip `configured` only once
// a real backend integration exists.
const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "cryptomus", name: "Cryptomus", description: "USDT, BTC, ETH and more", icon: Bitcoin, configured: false },
  { id: "stripe", name: "Stripe", description: "Credit & debit cards", icon: CreditCard, configured: false },
];

type CheckoutState = { status: "idle" | "loading" | "success" | "error"; message?: string };

function PurchaseTraffic() {
  const [planName, setPlanName] = useState("");
  const [planTouched, setPlanTouched] = useState(false);
  const [gbInput, setGbInput] = useState("2");
  const [method, setMethod] = useState<MethodId | null>(null);
  const [coupon, setCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [checkout, setCheckout] = useState<CheckoutState>({ status: "idle" });

  const gb = gbInput === "" ? NaN : Number(gbInput);
  const gbValid = Number.isInteger(gb) && gb >= 1;
  const tier = gbValid ? getTier(gb) : null;
  const contactSales = gbValid && isContactSales(gb);
  const subtotal = gbValid ? calcSubtotal(gb) : null;
  const suggestion = gbValid ? getNextTierSuggestion(gb) : null;
  const discount = 0; // only set from a validated coupon (none can be validated yet)
  const total = subtotal !== null ? Math.max(0, subtotal - discount) : null;

  const planResult = planNameSchema.safeParse(planName);
  const planError =
    planTouched && !planResult.success ? (planResult.error.issues[0]?.message ?? "Invalid plan name") : null;
  const anyConfigured = PAYMENT_METHODS.some((m) => m.configured);

  const gbError = useMemo(() => {
    if (gbInput === "") return "Enter how much traffic you need";
    if (!Number.isInteger(gb)) return "Use whole gigabytes";
    if (gb < 1) return "Minimum order is 1 GB";
    return null;
  }, [gbInput, gb]);

  const canPay =
    planResult.success && tier !== null && total !== null && method !== null && checkout.status !== "loading";

  async function applyCoupon() {
    const code = coupon.trim();
    if (!code) return setCouponMsg("Enter a coupon code");
    setCouponLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setCouponLoading(false);
    setCouponMsg("Coupons can't be validated yet — no coupon service is connected. No discount applied.");
  }

  async function pay() {
    setPlanTouched(true);
    if (!canPay || checkout.status === "loading") return;
    setCheckout({ status: "loading" });
    // No provider is configured, so checkout cannot be created. Never mark as paid here.
    await new Promise((r) => setTimeout(r, 600));
    setCheckout({
      status: "error",
      message: "Checkout couldn't start: the selected payment provider isn't connected yet.",
    });
  }

  return (
    <AppShell
      title="Purchase Traffic"
      subtitle="Choose your bandwidth and get the best available rate."
      actions={
        <Link
          to="/"
          className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      }
    >
      <div className="mb-heading grid gap-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground sm:hidden"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Gauge className="h-4 w-4 text-lavender" />
          <span className="text-muted-foreground">Remaining traffic:</span>
          <span className="font-medium">Unavailable</span>
          <Badge tone="muted">Provider not connected</Badge>
        </div>
      </div>

      <div className="grid items-start gap-cards xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,1fr)]">
        {/* LEFT */}
        <div className="grid min-w-0 items-start gap-cards">
          <section className="panel h-auto p-panel">
            <PanelHeader icon={Sparkles} title="Configure your plan" subtitle="Name it and pick your bandwidth." />

            <label htmlFor="plan-name" className="mb-label block text-sm">Plan Name</label>
            <input
              id="plan-name"
              className={cn("field", planError && "border-destructive")}
              placeholder="My Residential Plan"
              value={planName}
              maxLength={50}
              onChange={(e) => setPlanName(e.target.value)}
              onBlur={() => setPlanTouched(true)}
            />
            <p className={cn("mt-label text-xs", planError ? "text-destructive" : "text-muted-foreground")}>
              {planError ?? `${planName.length}/50`}
            </p>

            <label htmlFor="gb" className="mb-label mt-fields block text-sm">Traffic Amount (GB)</label>
            <div className="relative">
              <input
                id="gb"
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                className={cn("field h-12 pr-16 font-mono text-2xl font-semibold", gbError && "border-destructive")}
                value={gbInput}
                onChange={(e) => {
                  setGbInput(e.target.value);
                  if (checkout.status !== "loading") setCheckout({ status: "idle" });
                }}
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">GB</span>
            </div>
            <div className="mt-fields flex flex-wrap gap-2">
              {[10, 50, 100, 200, 500, 1000].map((v) => (
                <Button variant="ghost"
                  key={v}
                  onClick={() => setGbInput(String(v))}
                  className={cn(
                    "h-8 rounded-md border px-3 py-1.5 text-xs transition-colors",
                    gb === v ? "border-brand bg-accent text-lavender" : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {v >= 1000 ? "1 TB" : `${v} GB`}
                </Button>
              ))}
            </div>
            {gbError && <p className="mt-2 text-xs text-destructive">{gbError}</p>}

            {tier && subtotal !== null && (
              <div className="mt-fields grid grid-cols-2 gap-fields">
                <div className="rounded-lg border border-border bg-background-2 p-3">
                  <p className="text-xs text-muted-foreground">Current rate</p>
                  <p className="mt-1 font-mono text-lg font-semibold">{formatUsd(tier.pricePerGb)}<span className="text-xs text-muted-foreground">/GB</span></p>
                </div>
                <div className="rounded-lg border border-border bg-background-2 p-3">
                  <p className="text-xs text-muted-foreground">Current subtotal</p>
                  <p className="mt-1 font-mono text-lg font-semibold">{formatUsd(subtotal)}</p>
                </div>
              </div>
            )}

            {suggestion && (
              <Button variant="ghost"
                onClick={() => setGbInput(String(suggestion.nextGb))}
                className="mt-fields h-auto whitespace-normal flex w-full items-start justify-start gap-3 rounded-lg border border-success/30 bg-success/10 p-3 text-left transition-colors hover:bg-success/15"
              >
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span className="text-sm">
                  Add <b>{suggestion.addGb} GB</b> more to unlock{" "}
                  <b className="text-success">{formatUsd(suggestion.nextTier.pricePerGb)}/GB</b> pricing.
                  <span className="mt-0.5 block font-mono text-xs text-muted-foreground">
                    {suggestion.nextGb} GB × {formatUsd(suggestion.nextTier.pricePerGb)} = {formatUsd(suggestion.nextTotal)}
                  </span>
                </span>
              </Button>
            )}
            {tier && !suggestion && (
              <p className="mt-3 flex items-center gap-2 rounded-lg border border-brand/30 bg-accent/40 p-3 text-sm text-lavender">
                <Check className="h-4 w-4" /> You're on our best self-serve rate.
              </p>
            )}
            {contactSales && (
              <p className="mt-3 rounded-lg border border-brand/30 bg-accent/40 p-3 text-sm text-lavender">
                Orders above {MAX_SELF_SERVE_GB.toLocaleString()} GB get custom pricing — contact our sales team.
              </p>
            )}
          </section>

          <section className="panel h-auto p-panel">
            <PanelHeader icon={Tag} title="Pricing tiers" subtitle="Your tier's rate applies to the whole order." />
            <div className="grid grid-cols-2 gap-2 min-[1200px]:grid-cols-4">
              {PRICING_TIERS.map((t) => (
                <div
                  key={t.id}
                  className={cn(
                    "rounded-lg border p-3",
                    tier?.id === t.id ? "border-brand bg-accent/60" : "border-border bg-background-2",
                  )}
                >
                  <p className="text-xs text-muted-foreground">{t.label}</p>
                  <p className={cn("font-mono font-semibold", tier?.id === t.id && "text-lavender")}>{formatUsd(t.pricePerGb)}/GB</p>
                </div>
              ))}
              <div className={cn("rounded-lg border p-3", contactSales ? "border-brand bg-accent/60" : "border-border bg-background-2")}>
                <p className="text-xs text-muted-foreground">Above 1,000 GB</p>
                <p className="font-semibold">Contact Sales</p>
              </div>
            </div>
          </section>


        </div>

        {/* RIGHT */}
        <aside className="grid min-w-0 items-start gap-cards self-start">
          <section className="panel h-auto p-panel">
            <h2 className="mb-4 font-semibold">Order Summary</h2>
            <dl className="space-y-2 text-sm">
              <Row label="Plan name" value={planName.trim() || "—"} />
              <Row label="Traffic" value={gbValid ? `${gb.toLocaleString()} GB` : "—"} />
              <Row label="Pricing tier" value={contactSales ? "Enterprise" : tier?.label ?? "—"} />
              <Row label="Rate per GB" value={tier ? formatUsd(tier.pricePerGb) : contactSales ? "Custom" : "—"} />
              <div className="border-t border-border pt-3">
                <Row label="Subtotal" value={subtotal !== null ? formatUsd(subtotal) : "—"} />
              </div>
            </dl>

            {!contactSales && (
              <div className="mt-fields">
                <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-[minmax(0,1fr)_auto]">
                  <input
                    className="field h-10 min-w-0 font-mono uppercase"
                    placeholder="Coupon code"
                    value={coupon}
                    maxLength={32}
                    onChange={(e) => { setCoupon(e.target.value.replace(/[^a-zA-Z0-9_-]/g, "")); setCouponMsg(null); }}
                  />
                  <Button variant="outline" className="h-10" onClick={applyCoupon} disabled={couponLoading}>
                    {couponLoading ? <Loader2 className="animate-spin" /> : "Apply Coupon"}
                  </Button>
                </div>
                {couponMsg && <p className="mt-2 text-xs text-muted-foreground">{couponMsg}</p>}
              </div>
            )}

            {discount > 0 && <Row label="Discount" value={`−${formatUsd(discount)}`} className="mt-3 text-success" />}

            <div className="mt-fields flex items-baseline justify-between border-t border-border pt-3">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-mono text-2xl font-bold">{total !== null ? formatUsd(total) : contactSales ? "Custom" : "—"}</span>
            </div>

            <div className="mt-fields">
              {contactSales ? (
                <Button variant="pay" asChild>
                  <a href="mailto:sales@proxycity.example?subject=Bulk%20traffic%20inquiry">
                    <Mail /> Contact Sales
                  </a>
                </Button>
              ) : (
                <Button variant="pay" onClick={pay} disabled={!canPay}>
                  {checkout.status === "loading" ? (
                    <><Loader2 className="animate-spin" /> Processing…</>
                  ) : (
                    <>Pay {total !== null ? formatUsd(total) : ""} <ArrowRight /></>
                  )}
                </Button>
              )}
              {!contactSales && !method && (
                <p className="mt-2 text-center text-xs text-muted-foreground">Select an available payment method to continue.</p>
              )}
              {checkout.status === "error" && (
                <p className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">{checkout.message}</p>
              )}
              {checkout.status === "success" && (
                <p className="mt-3 rounded-lg border border-success/30 bg-success/10 p-3 text-xs text-success">{checkout.message}</p>
              )}
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" /> Secure checkout · Orders are confirmed only after payment is verified
              </p>
            </div>
          </section>

          {!contactSales && (
            <section className="panel h-auto p-panel">
              <PanelHeader
                icon={Wallet}
                title="Payment method"
                subtitle="Choose how you'd like to pay."
                badge={!anyConfigured ? <Badge tone="muted">None connected</Badge> : undefined}
              />
              <div className="grid gap-2">
                {PAYMENT_METHODS.map((m) => {
                  const selected = method === m.id;
                  const Icon = m.icon;
                  return (
                    <Button variant="ghost"
                      key={m.id}
                      disabled={!m.configured}
                      onClick={() => setMethod(m.id)}
                      aria-pressed={selected}
                      className={cn(
                        "grid h-auto whitespace-normal grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 rounded-lg border p-3 text-left transition-colors min-[1200px]:grid-cols-[auto_minmax(0,1fr)_auto]",
                        selected ? "border-brand bg-accent/60" : "border-border bg-background-2",
                        m.configured ? "hover:border-brand/60" : "cursor-not-allowed opacity-55",
                      )}
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-muted text-lavender"><Icon className="h-4 w-4" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{m.name}</span>
                        <span className="block text-xs text-muted-foreground">{m.description}</span>
                      </span>
                      <span className="col-start-2 justify-self-start min-[1200px]:col-start-3">{selected ? <Badge>Selected</Badge> : m.configured ? <Badge tone="success">Available</Badge> : <Badge tone="muted">Not configured</Badge>}</span>
                    </Button>
                  );
                })}
              </div>
              {!anyConfigured && (
                <p className="mt-3 text-xs text-muted-foreground">
                  No payment provider is connected to this app yet, so checkout is unavailable.
                </p>
              )}
            </section>
          )}
        </aside>
      </div>
    </AppShell>
  );
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn("grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-3", className)}>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="truncate text-right font-medium">{value}</dd>
    </div>
  );
}
