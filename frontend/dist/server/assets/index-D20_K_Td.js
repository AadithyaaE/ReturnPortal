import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { A as AppHeader, a as AppFooter, b as API_BASE, s as setState } from "./return-store-DPh-VvjW.js";
function Index() {
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const url = `${API_BASE}/shopify-order?order_number=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Order not found (${res.status})`);
      const data = await res.json();
      const products = data.products ?? data.line_items ?? data.order?.products ?? data.order?.line_items ?? [];
      setState({
        order_number: orderNumber,
        email,
        order: data.order ?? data,
        products,
        selected_product_id: null,
        return_type: null,
        reason: null,
        return_id: null
      });
      navigate({
        to: "/products"
      });
    } catch (err) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsx(AppHeader, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-grow flex flex-col items-center justify-center hero-pattern px-4 md:px-12 py-12", children: /* @__PURE__ */ jsxs("div", { className: "relative z-10 w-full max-w-[520px]", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-bold text-primary mb-3 tracking-tight", children: "Find your order" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-on-surface-variant", children: "Enter your details below to start your seamless AI-powered return." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "tonal-layer-1 border border-outline-variant rounded-xl p-6 md:p-10 bg-surface-container-lowest", children: /* @__PURE__ */ jsxs("form", { className: "space-y-6", onSubmit, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-semibold", htmlFor: "order-number", children: "Order Number" }),
          /* @__PURE__ */ jsx("input", { id: "order-number", required: true, value: orderNumber, onChange: (e) => setOrderNumber(e.target.value), placeholder: "e.g. SWIFT-123456", className: "w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-on-surface-variant", children: "Found in your confirmation email." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-semibold", htmlFor: "email-address", children: "Email Address" }),
          /* @__PURE__ */ jsx("input", { id: "email-address", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: "your@email.com", className: "w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" })
        ] }),
        error && /* @__PURE__ */ jsx("div", { className: "text-sm text-error bg-error/10 border border-error/30 rounded-lg p-3", children: error }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: loading, className: "w-full bg-primary text-on-primary py-4 px-6 rounded-lg font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60", children: loading ? "Finding Order..." : "Find Order →" })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-10 grid grid-cols-1 md:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx(Feature, { title: "AI Decisioning", desc: "Instant approval for most items.", icon: "✨" }),
        /* @__PURE__ */ jsx(Feature, { title: "Easy Shipping", desc: "Print labels at home or drop off.", icon: "🚚" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AppFooter, {})
  ] });
}
function Feature({
  title,
  desc,
  icon
}) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-surface-container border border-outline-variant p-3 rounded-lg flex items-start gap-3", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-primary-container p-2 rounded-lg text-on-primary-container", children: icon }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-primary", children: title }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-on-surface-variant", children: desc })
    ] })
  ] });
}
export {
  Index as component
};
