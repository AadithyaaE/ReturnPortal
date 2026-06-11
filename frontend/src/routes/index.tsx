import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppFooter, AppHeader } from "@/components/AppHeader";
import { API_BASE, setState } from "@/lib/return-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SwiftReturn AI | Order Lookup" },
      { name: "description", content: "Start a seamless AI-powered return for your order." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const url = `${API_BASE}/shopify-order?order_number=${encodeURIComponent(
        orderNumber
      )}&email=${encodeURIComponent(email)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Order not found (${res.status})`);
      const data = await res.json();
      const products =
        data.products ?? data.line_items ?? data.order?.products ?? data.order?.line_items ?? [];
      setState({
        order_number: orderNumber,
        email,
        order: data.order ?? data,
        products,
        selected_product_id: null,
        return_type: null,
        reason: null,
        return_id: null,
      });
      navigate({ to: "/products" });
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow flex flex-col items-center justify-center hero-pattern px-4 md:px-12 py-12">
        <div className="relative z-10 w-full max-w-[520px]">
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3 tracking-tight">
              Find your order
            </h1>
            <p className="text-lg text-on-surface-variant">
              Enter your details below to start your seamless AI-powered return.
            </p>
          </div>
          <div className="tonal-layer-1 border border-outline-variant rounded-xl p-6 md:p-10 bg-surface-container-lowest">
            <form className="space-y-6" onSubmit={onSubmit}>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold" htmlFor="order-number">
                  Order Number
                </label>
                <input
                  id="order-number"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g. SWIFT-123456"
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
                <p className="text-xs text-on-surface-variant">Found in your confirmation email.</p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold" htmlFor="email-address">
                  Email Address
                </label>
                <input
                  id="email-address"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              {error && (
                <div className="text-sm text-error bg-error/10 border border-error/30 rounded-lg p-3">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-on-primary py-4 px-6 rounded-lg font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
              >
                {loading ? "Finding Order..." : "Find Order →"}
              </button>
            </form>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-3">
            <Feature title="AI Decisioning" desc="Instant approval for most items." icon="✨" />
            <Feature title="Easy Shipping" desc="Print labels at home or drop off." icon="🚚" />
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}

function Feature({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="bg-surface-container border border-outline-variant p-3 rounded-lg flex items-start gap-3">
      <div className="bg-primary-container p-2 rounded-lg text-on-primary-container">{icon}</div>
      <div>
        <h4 className="text-sm font-semibold text-primary">{title}</h4>
        <p className="text-xs text-on-surface-variant">{desc}</p>
      </div>
    </div>
  );
}
