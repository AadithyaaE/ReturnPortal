import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppFooter, AppHeader } from "@/components/AppHeader";
import { Stepper } from "@/components/Stepper";
import { API_BASE, getState, setState } from "@/lib/return-store";
import {  useRef } from "react";

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
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatInput, setChatInput] = useState("");
  const navigate = useNavigate();

  const [issueDescription, setIssueDescription] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const [returnType, setReturnType] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyzeWithAI() {
    if (!issueDescription.trim()) return;

    setAiLoading(true);
    try {
      const response = await fetch(`${API_BASE}/ai/classify-reason`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: issueDescription,
        }),
      });

      const data = await response.json();




      console.log(data);

      const reasonMap: Record<string, string> = {
        "Wrong Size": "wrong_size",
        "Damaged Item": "damaged",
        "Wrong Item": "wrong_item",
        "Changed Mind": "changed_mind",
      };

      const returnTypeMap: Record<string, string> = {
        Refund: "refund",
        Exchange: "exchange",
        "Store Credit": "store_credit",
      };

      setReason(reasonMap[data.reason] || null);
      setReturnType(returnTypeMap[data.recommendation] || null);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  }


  useEffect(() => {
    const s = getState();
    if (!s.selected_product_id) {
      navigate({ to: "/" });
    }
  }, [navigate]);

async function sendMessage() {

  if (!chatInput.trim()) return;



  const response = await fetch(
    `${API_BASE}/ai/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: chatInput
      })
    }
  );


  const data = await response.json();
  const reasonMap: Record<string, string> = {
    "Wrong Size": "wrong_size",
    "Damaged Item": "damaged",
    "Wrong Item": "wrong_item",
    "Changed Mind": "changed_mind",
  };

  const returnTypeMap: Record<string, string> = {
    "Refund": "refund",
    "Exchange": "exchange",
    "Store Credit": "store_credit",
  };
  if (data.reason) {
  setReason(reasonMap[data.reason]);
}

if (data.recommendation) {
  setReturnType(
    returnTypeMap[data.recommendation]
  );
}

  

  setMessages(prev => [
    ...prev,
    {
      role: "user",
      content: chatInput
    },
    {
  role: "assistant",
  content:
`🤖 AI Analysis Complete

Reason: ${data.reason}
Recommended Resolution: ${data.recommendation}

✓ We've pre-filled the return form.
✓ You can change these selections before submitting.`
}
  ]);

  setChatInput("");
}


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
          variant_id: s.selected_variant_id,
          quantity: 1,
          return_type: returnType,
          reason,
        }),
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to create return record.");
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setSubmitting(false);
    }
  }
  const reasonLabelMap: Record<string, string> = {
  wrong_size: "Wrong Size",
  damaged: "Damaged Item",
  wrong_item: "Wrong Item",
  changed_mind: "Changed Mind",
};

const resolutionLabelMap: Record<string, string> = {
  refund: "Refund",
  exchange: "Exchange",
  store_credit: "Store Credit",
};

useEffect(() => {

  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });

}, [messages]);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-12 py-12">
        <Stepper current={3} />
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <section className="mb-10">

  <h2 className="text-lg font-semibold mb-4">
    AI Return Assistant
  </h2>

<div className="border rounded-xl p-4 mb-4 h-[450px] overflow-y-auto">
    {messages.map((msg, index) => (

      <div key={index} className="mb-4">

        <div
className={`p-4 rounded-xl ${
  msg.role === "user"
    ? "bg-primary text-on-primary"
    : "bg-surface-container-high border border-outline-variant"
}`}
        >
<div className="whitespace-pre-line leading-7">
  {msg.content}
</div>
        </div>
        

      </div>

    ))}
    <div ref={messagesEndRef} />

  </div>

  <div className="flex gap-2">

    <input
      value={chatInput}
      onChange={(e) =>
        setChatInput(e.target.value)
      }
      placeholder="Describe your issue..."
      className="flex-1 border rounded-lg p-3"
    />

    <button
      onClick={sendMessage}
      className="px-5 py-3 rounded-lg bg-primary text-on-primary cursor-pointer hover:opacity-90 transition-all"
    >
      Send
    </button>

  </div>

</section>
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
                  type="button"
                  onClick={() => setReturnType(t.id)}
                  className={`text-left p-5 rounded-xl border transition-all bg-surface-container-lowest ${
                    returnType === t.id
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-outline-variant hover:border-primary/50"
                  }`}
                >
                  <div className="text-base font-semibold text-primary mb-1">
                    {t.label}
                  </div>
                  <div className="text-sm text-on-surface-variant">
                    {t.desc}
                  </div>
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
                  type="button"
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

          <section className="mb-10">
  <h2 className="text-lg font-semibold mb-4">
    Review Return
  </h2>

  <div className="border rounded-xl p-4">

    <div className="border border-outline-variant rounded-xl p-5 bg-surface-container-low">

<h3 className="font-semibold text-lg mb-4">
  📋 Return Summary
</h3>

  <div className="flex items-center justify-between mb-3">
    <span className="text-on-surface-variant">
      Reason
    </span>

    <span className="px-3 py-1 rounded-full border font-medium">
      {reasonLabelMap[reason ?? ""]}
    </span>
  </div>

  <div className="flex items-center justify-between">
    <span className="text-on-surface-variant">
      Resolution
    </span>

    <span className="px-3 py-1 rounded-full border font-medium">
      {resolutionLabelMap[returnType ?? ""]}
    </span>
  </div>

  <p className="text-sm text-on-surface-variant mt-4">
    Please review the details before submitting your return request.
  </p>

</div>  
   
    
  </div>
</section>

          {error && (
            <div className="mb-4 text-sm text-error bg-error/10 border border-error/30 rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="px-6 py-3 rounded-lg border border-outline-variant font-semibold hover:bg-surface-container transition-all"
            >
              Back
            </button>
            <button
              type="button"
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