import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { g as getState, A as AppHeader, a as AppFooter } from "./return-store-DPh-VvjW.js";
import { S as Stepper } from "./Stepper-yYKVAx_7.js";
function ConfirmationPage() {
  const navigate = useNavigate();
  const [returnId, setReturnId] = useState(null);
  const [email, setEmail] = useState("");
  useEffect(() => {
    const s = getState();
    console.log("CONFIRMATION STATE:", s);
    if (!s.return_id) {
      navigate({
        to: "/"
      });
      return;
    }
    setReturnId(String(s.return_id));
    setEmail(s.email);
  }, [navigate]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsx(AppHeader, {}),
    /* @__PURE__ */ jsxs("main", { className: "flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-12 py-12", children: [
      /* @__PURE__ */ jsx(Stepper, { current: 4 }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-xl mx-auto text-center mt-8", children: [
        /* @__PURE__ */ jsx("div", { className: "w-20 h-20 mx-auto rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-4xl mb-6", children: "✓" }),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-semibold mb-3 tracking-tight", children: "Your return is on its way!" }),
        /* @__PURE__ */ jsxs("p", { className: "text-on-surface-variant mb-8", children: [
          "We've sent a confirmation email to ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: email }),
          " with next steps and a prepaid shipping label."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "tonal-layer-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 mb-8", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wide text-on-surface-variant mb-2", children: "Return ID" }),
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-primary font-mono", children: returnId })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => {
          sessionStorage.removeItem("swiftreturn-state");
          navigate({
            to: "/"
          });
        }, className: "px-6 py-3 rounded-lg bg-primary text-on-primary font-semibold hover:opacity-90 transition-all", children: "Start another return" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(AppFooter, {})
  ] });
}
export {
  ConfirmationPage as component
};
