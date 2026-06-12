import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
function AppHeader() {
  return /* @__PURE__ */ jsx("header", { className: "bg-surface border-b border-outline-variant w-full sticky top-0 z-50", children: /* @__PURE__ */ jsxs("nav", { className: "flex justify-between items-center w-full px-6 md:px-12 py-4 max-w-[1200px] mx-auto", children: [
    /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "🚀" }),
      /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-primary", children: "SwiftReturn AI" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
      /* @__PURE__ */ jsx("a", { className: "text-sm font-semibold text-on-surface-variant hover:text-primary", href: "#", children: "Help Center" }),
      /* @__PURE__ */ jsx("button", { className: "p-2 rounded-full hover:bg-surface-container", children: /* @__PURE__ */ jsx("span", { className: "text-on-surface-variant", children: "👤" }) })
    ] })
  ] }) });
}
function AppFooter() {
  return /* @__PURE__ */ jsx("footer", { className: "bg-secondary-fixed w-full border-t border-outline-variant mt-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center w-full px-6 md:px-12 py-6 max-w-[1200px] mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 mb-4 md:mb-0", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-on-secondary-fixed", children: "SwiftReturn AI" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-on-secondary-fixed-variant", children: "© 2026 SwiftReturn AI. Secure & Encrypted." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-6", children: [
      /* @__PURE__ */ jsx("a", { className: "text-sm text-on-secondary-fixed-variant hover:underline", href: "#", children: "Contact Support" }),
      /* @__PURE__ */ jsx("a", { className: "text-sm text-on-secondary-fixed-variant hover:underline", href: "#", children: "Privacy Policy" }),
      /* @__PURE__ */ jsx("a", { className: "text-sm text-on-secondary-fixed-variant hover:underline", href: "#", children: "Terms of Service" })
    ] })
  ] }) });
}
const KEY = "swiftreturn-state";
const empty = {
  order_number: "",
  email: "",
  order: null,
  products: [],
  selected_product_id: null,
  selected_Variant_id:null,
  return_type: null,
  reason: null,
  return_id: null
};
function getState() {
  if (typeof window === "undefined") return empty;
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
}
function setState(patch) {
  if (typeof window === "undefined") return;
  const next = { ...getState(), ...patch };
  sessionStorage.setItem(KEY, JSON.stringify(next));
}
const API_BASE = "http://127.0.0.1:8000";
export {
  AppHeader as A,
  AppFooter as a,
  API_BASE as b,
  getState as g,
  setState as s
};
