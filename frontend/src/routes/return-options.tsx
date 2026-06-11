import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppFooter, AppHeader } from "@/components/AppHeader";
import { Stepper } from "@/components/Stepper";
import { API_BASE, getState, setState } from "@/lib/return-store";

export const Route = createFileRoute("/return-options")({
  head: () => ({ meta: [{ title: "SwiftReturn AI | Return Options" }] }),
  component: ReturnOptionsPage,
});

const RETURN_TYPES = [
  { id: "refund", label: "Refund", desc: "Get your money back to original payment." },
  { id: "exchange", label: "Exchange", desc: "Swap for a different size or color." },
  { id: "store_credit", label: "Store Credit", desc: "Faster processing, extra bonus." },
];

const REASONS = [
  { id: "wrong_size", label: "Wrong Size" },
  { id: "damaged", label: "Damaged Item" },
  { id: "wrong_item", label: "Wrong Item" },
  { id: "changed_mind", label: "Changed Mind" },
];

function ReturnOptionsPage() {
  const navigate = useNavigate();
  const [returnType, setReturnType] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const s = getState();
    if (!s.selected_product_id) {
      navigate({ to: "/" });
    }
  }, [navigate]);

  async function submit() {
    if (!returnType || !reason) return;
    setError(null);
    setSubmitting(true);
    try {
      const s = getState();
      const res = await fetch(`${API_BASE}/start-return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_number: s.order_number,
          email: s.email,
          product_id: s.selected_product_id,
          quantity: 1,
          return_type: returnType,
          reason,
        }),
      });
      if (!res.ok) {
  const err = await res.json();
  throw new Error(err.detail);
}
const data = await res.json();

if (!data.return_id) {
  setError(data.message || "Return could not be created");
  return;
}

setState({
  return_type: returnType,
  reason,
  return_id: String(data.return_id),
});

navigate({ to: "/confirmation" });
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-12 py-12">
        <Stepper current={3} />
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold mb-2 tracking-tight">
              How can we help?
            </h1>
            <p className="text-on-surface-variant">
              Choose how you'd like your return resolved and tell us why.
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-4">Resolution</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {RETURN_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setReturnType(t.id)}
                  className={`text-left p-5 rounded-xl border transition-all bg-surface-container-lowest ${
                    returnType === t.id
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-outline-variant hover:border-primary/50"
                  }`}
                >
                  <div className="text-base font-semibold text-primary mb-1">{t.label}</div>
                  <div className="text-sm text-on-surface-variant">{t.desc}</div>
                </button>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-4">Reason</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {REASONS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setReason(r.id)}
                  className={`p-4 rounded-lg border text-sm font-semibold transition-all bg-surface-container-lowest ${
                    reason === r.id
                      ? "border-primary bg-primary-container text-on-primary-container ring-2 ring-primary/30"
                      : "border-outline-variant hover:border-primary/50"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </section>

          {error && (
            <div className="mb-4 text-sm text-error bg-error/10 border border-error/30 rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={() => navigate({ to: "/products" })}
              className="px-6 py-3 rounded-lg border border-outline-variant font-semibold hover:bg-surface-container transition-all"
            >
              Back
            </button>
            <button
              onClick={submit}
              disabled={!returnType || !reason || submitting}
              className="px-6 py-3 rounded-lg bg-primary text-on-primary font-semibold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Return →"}
            </button>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
