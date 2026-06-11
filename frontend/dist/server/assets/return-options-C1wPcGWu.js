import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { g as getState, A as AppHeader, a as AppFooter, b as API_BASE, s as setState } from "./return-store-DPh-VvjW.js";
import { S as Stepper } from "./Stepper-yYKVAx_7.js";
const RETURN_TYPES = [{
  id: "refund",
  label: "Refund",
  desc: "Get your money back to original payment."
}, {
  id: "exchange",
  label: "Exchange",
  desc: "Swap for a different size or color."
}, {
  id: "store_credit",
  label: "Store Credit",
  desc: "Faster processing, extra bonus."
}];
const REASONS = [{
  id: "wrong_size",
  label: "Wrong Size"
}, {
  id: "damaged",
  label: "Damaged Item"
}, {
  id: "wrong_item",
  label: "Wrong Item"
}, {
  id: "changed_mind",
  label: "Changed Mind"
}];
function ReturnOptionsPage() {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [chatInput, setChatInput] = useState("");
  const navigate = useNavigate();
  const [issueDescription, setIssueDescription] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [returnType, setReturnType] = useState(null);
  const [reason, setReason] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const s = getState();
    if (!s.selected_product_id) {
      navigate({
        to: "/"
      });
    }
  }, [navigate]);
  async function sendMessage() {
    if (!chatInput.trim()) return;
    const response = await fetch(`${API_BASE}/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: chatInput
      })
    });
    const data = await response.json();
    const reasonMap = {
      "Wrong Size": "wrong_size",
      "Damaged Item": "damaged",
      "Wrong Item": "wrong_item",
      "Changed Mind": "changed_mind"
    };
    const returnTypeMap = {
      "Refund": "refund",
      "Exchange": "exchange",
      "Store Credit": "store_credit"
    };
    if (data.reason) {
      setReason(reasonMap[data.reason]);
    }
    if (data.recommendation) {
      setReturnType(returnTypeMap[data.recommendation]);
    }
    setMessages((prev) => [...prev, {
      role: "user",
      content: chatInput
    }, {
      role: "assistant",
      content: `🤖 AI Analysis Complete

Reason: ${data.reason}
Recommended Resolution: ${data.recommendation}

✓ We've pre-filled the return form.
✓ You can change these selections before submitting.`
    }]);
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          order_number: s.order_number,
          email: s.email,
          product_id: s.selected_product_id,
          quantity: 1,
          return_type: returnType,
          reason
        })
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
        return_id: String(data.return_id)
      });
      navigate({
        to: "/confirmation"
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setSubmitting(false);
    }
  }
  const reasonLabelMap = {
    wrong_size: "Wrong Size",
    damaged: "Damaged Item",
    wrong_item: "Wrong Item",
    changed_mind: "Changed Mind"
  };
  const resolutionLabelMap = {
    refund: "Refund",
    exchange: "Exchange",
    store_credit: "Store Credit"
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsx(AppHeader, {}),
    /* @__PURE__ */ jsxs("main", { className: "flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-12 py-12", children: [
      /* @__PURE__ */ jsx(Stepper, { current: 3 }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-8 text-center", children: [
          /* @__PURE__ */ jsxs("section", { className: "mb-10", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mb-4", children: "AI Return Assistant" }),
            /* @__PURE__ */ jsxs("div", { className: "border rounded-xl p-4 mb-4 h-[450px] overflow-y-auto", children: [
              messages.map((msg, index) => /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx("div", { className: `p-4 rounded-xl ${msg.role === "user" ? "bg-primary text-on-primary" : "bg-surface-container-high border border-outline-variant"}`, children: /* @__PURE__ */ jsx("div", { className: "whitespace-pre-line leading-7", children: msg.content }) }) }, index)),
              /* @__PURE__ */ jsx("div", { ref: messagesEndRef })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx("input", { value: chatInput, onChange: (e) => setChatInput(e.target.value), placeholder: "Describe your issue...", className: "flex-1 border rounded-lg p-3" }),
              /* @__PURE__ */ jsx("button", { onClick: sendMessage, className: "px-5 py-3 rounded-lg bg-primary text-on-primary cursor-pointer hover:opacity-90 transition-all", children: "Send" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-semibold mb-2 tracking-tight", children: "How can we help?" }),
          /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant", children: "Choose how you'd like your return resolved and tell us why." })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "mb-10", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mb-4", children: "Resolution" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: RETURN_TYPES.map((t) => /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setReturnType(t.id), className: `text-left p-5 rounded-xl border transition-all bg-surface-container-lowest ${returnType === t.id ? "border-primary ring-2 ring-primary/30" : "border-outline-variant hover:border-primary/50"}`, children: [
            /* @__PURE__ */ jsx("div", { className: "text-base font-semibold text-primary mb-1", children: t.label }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-on-surface-variant", children: t.desc })
          ] }, t.id)) })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "mb-10", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mb-4", children: "Reason" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: REASONS.map((r) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setReason(r.id), className: `p-4 rounded-lg border text-sm font-semibold transition-all bg-surface-container-lowest ${reason === r.id ? "border-primary bg-primary-container text-on-primary-container ring-2 ring-primary/30" : "border-outline-variant hover:border-primary/50"}`, children: r.label }, r.id)) })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "mb-10", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mb-4", children: "Review Return" }),
          /* @__PURE__ */ jsx("div", { className: "border rounded-xl p-4", children: /* @__PURE__ */ jsxs("div", { className: "border border-outline-variant rounded-xl p-5 bg-surface-container-low", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg mb-4", children: "📋 Return Summary" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsx("span", { className: "text-on-surface-variant", children: "Reason" }),
              /* @__PURE__ */ jsx("span", { className: "px-3 py-1 rounded-full border font-medium", children: reasonLabelMap[reason ?? ""] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-on-surface-variant", children: "Resolution" }),
              /* @__PURE__ */ jsx("span", { className: "px-3 py-1 rounded-full border font-medium", children: resolutionLabelMap[returnType ?? ""] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-on-surface-variant mt-4", children: "Please review the details before submitting your return request." })
          ] }) })
        ] }),
        error && /* @__PURE__ */ jsx("div", { className: "mb-4 text-sm text-error bg-error/10 border border-error/30 rounded-lg p-3", children: error }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => navigate({
            to: "/"
          }), className: "px-6 py-3 rounded-lg border border-outline-variant font-semibold hover:bg-surface-container transition-all", children: "Back" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: submit, disabled: !returnType || !reason || submitting, className: "px-6 py-3 rounded-lg bg-primary text-on-primary font-semibold hover:opacity-90 transition-all disabled:opacity-50", children: submitting ? "Submitting..." : "Submit Return →" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(AppFooter, {})
  ] });
}
export {
  ReturnOptionsPage as component
};
