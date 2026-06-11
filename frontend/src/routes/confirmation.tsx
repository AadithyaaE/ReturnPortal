import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppFooter, AppHeader } from "@/components/AppHeader";
import { Stepper } from "@/components/Stepper";
import { getState } from "@/lib/return-store";

export const Route = createFileRoute("/confirmation")({
  head: () => ({ meta: [{ title: "SwiftReturn AI | Confirmation" }] }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const navigate = useNavigate();
  const [returnId, setReturnId] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const s = getState();
    console.log("CONFIRMATION STATE:", s);
    if (!s.return_id) {
      navigate({ to: "/" });
      return;
    }
    setReturnId(String(s.return_id));
    setEmail(s.email);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-12 py-12">
        <Stepper current={4} />
        <div className="max-w-xl mx-auto text-center mt-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-4xl mb-6">
            ✓
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold mb-3 tracking-tight">
            Your return is on its way!
          </h1>
          <p className="text-on-surface-variant mb-8">
            We've sent a confirmation email to <span className="font-semibold">{email}</span> with
            next steps and a prepaid shipping label.
          </p>

          <div className="tonal-layer-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 mb-8">
            <div className="text-xs uppercase tracking-wide text-on-surface-variant mb-2">
              Return ID
            </div>
            <div className="text-2xl font-bold text-primary font-mono">{returnId}</div>
          </div>

          <button
            onClick={() => {
              sessionStorage.removeItem("swiftreturn-state");
              navigate({ to: "/" });
            }}
            className="px-6 py-3 rounded-lg bg-primary text-on-primary font-semibold hover:opacity-90 transition-all"
          >
            Start another return
          </button>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
