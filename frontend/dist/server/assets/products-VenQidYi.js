import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { g as getState, A as AppHeader, a as AppFooter, s as setState } from "./return-store-DPh-VvjW.js";
import { S as Stepper } from "./Stepper-yYKVAx_7.js";
function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orderNumber, setOrderNumber] = useState("");
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    const s = getState();
    if (!s.order_number) {
      navigate({
        to: "/"
      });
      return;
    }
    setProducts(s.products);
    setOrderNumber(s.order_number);
  }, [navigate]);
  function selectAndContinue(id) {
    setSelected(id);
    setState({
      selected_product_id: id
    });
    setTimeout(() => navigate({
      to: "/return-options"
    }), 150);
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsx(AppHeader, {}),
    /* @__PURE__ */ jsxs("main", { className: "flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-12 py-12", children: [
      /* @__PURE__ */ jsx(Stepper, { current: 2 }),
      /* @__PURE__ */ jsxs("div", { className: "mb-8 text-center max-w-2xl mx-auto", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-semibold mb-2 tracking-tight", children: "What would you like to return?" }),
        /* @__PURE__ */ jsxs("p", { className: "text-on-surface-variant", children: [
          "Found ",
          products.length,
          " item",
          products.length === 1 ? "" : "s",
          " in your order",
          " ",
          /* @__PURE__ */ jsxs("span", { className: "font-bold text-primary", children: [
            "#",
            orderNumber
          ] }),
          ". Select the one you wish to return."
        ] })
      ] }),
      products.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-center text-on-surface-variant py-12", children: "No products found." }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12", children: products.map((p, idx) => {
        const id = p.product_id ?? p.id ?? idx;
        const name = p.title ?? p.name ?? "Product";
        const price = p.price ?? "";
        const image = p.image ?? p.image_url ?? "";
        const isSelected = selected === id;
        return /* @__PURE__ */ jsxs("div", { className: `group relative flex flex-col bg-surface-container-lowest rounded-xl border overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all ${isSelected ? "border-primary ring-2 ring-primary/30" : "border-outline-variant"}`, children: [
          /* @__PURE__ */ jsx("div", { className: "aspect-square w-full overflow-hidden bg-surface-container", children: image ? /* @__PURE__ */ jsx("img", { src: image, alt: name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-on-surface-variant", children: "No image" }) }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 flex flex-col flex-grow", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-on-surface line-clamp-1", children: name }),
              p.variant && /* @__PURE__ */ jsx("p", { className: "text-xs text-on-surface-variant", children: p.variant })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-auto flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xl font-semibold text-primary", children: price ? `$${price}` : "" }),
              /* @__PURE__ */ jsx("button", { onClick: () => selectAndContinue(id), className: "flex items-center gap-2 px-4 py-2 border border-outline rounded-lg text-sm font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all", children: isSelected ? "Selected ✓" : "+ Select" })
            ] })
          ] })
        ] }, String(id));
      }) }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-start mt-6", children: /* @__PURE__ */ jsx("button", { onClick: () => navigate({
        to: "/"
      }), className: "px-6 py-3 rounded-lg border border-outline-variant font-semibold hover:bg-surface-container transition-all", children: "← Back" }) })
    ] }),
    /* @__PURE__ */ jsx(AppFooter, {})
  ] });
}
export {
  ProductsPage as component
};
