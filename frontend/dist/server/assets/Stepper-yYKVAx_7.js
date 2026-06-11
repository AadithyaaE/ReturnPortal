import { jsx, jsxs } from "react/jsx-runtime";
const steps = [
  { n: 1, label: "Identify Order" },
  { n: 2, label: "Select Items" },
  { n: 3, label: "Reason" },
  { n: 4, label: "Finalize" }
];
function Stepper({ current }) {
  const pct = (current - 1) / (steps.length - 1) * 100;
  return /* @__PURE__ */ jsx("div", { className: "mb-12 max-w-3xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between relative", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-5 left-0 w-full h-[2px] bg-secondary-container z-0" }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute top-5 left-0 h-[2px] bg-surface-tint z-0 transition-all",
        style: { width: `${pct}%` }
      }
    ),
    steps.map((s) => {
      const done = s.n < current;
      const active = s.n === current;
      return /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${done || active ? "bg-surface-tint text-on-primary" : "bg-secondary-container text-on-secondary-container"}`,
            children: done ? "✓" : s.n
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: `text-xs ${active ? "text-primary font-bold" : "text-on-surface-variant"}`,
            children: s.label
          }
        )
      ] }, s.n);
    })
  ] }) });
}
export {
  Stepper as S
};
