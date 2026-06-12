import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppFooter, AppHeader } from "@/components/AppHeader";
import { Stepper } from "@/components/Stepper";
import { getState, setState, type Product } from "@/lib/return-store";

export const Route = createFileRoute("/products")({
  head: () => ({ meta: [{ title: "SwiftReturn AI | Select Items" }] }),
  component: ProductsPage,
});

function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [orderNumber, setOrderNumber] = useState("");
  const [selected, setSelected] = useState<string | number | null>(null);

  useEffect(() => {
    const s = getState();
    if (!s.order_number) {
      navigate({ to: "/" });
      return;
    }
    setProducts(s.products);
    setOrderNumber(s.order_number);
  }, [navigate]);

function selectAndContinue(product: any) {

  setSelected(product.product_id);

  setState({
    selected_product_id: product.product_id,
    selected_variant_id: product.variant_id,
  });

  setTimeout(
    () => navigate({ to: "/return-options" }),
    150
  );
}

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-12 py-12">
        <Stepper current={2} />
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2 tracking-tight">
            What would you like to return?
          </h1>
          <p className="text-on-surface-variant">
            Found {products.length} item{products.length === 1 ? "" : "s"} in your order{" "}
            <span className="font-bold text-primary">#{orderNumber}</span>. Select the one you wish
            to return.
          </p>
        </div>
        {products.length === 0 ? (
          <p className="text-center text-on-surface-variant py-12">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {products.map((p, idx) => {
              const id = p.product_id ?? p.id ?? idx;
              const name = p.title ?? p.name ?? "Product";
              const price = p.price ?? "";
              const image = p.image ?? p.image_url ?? "";
              const isSelected = selected === id;
              return (
                <div
                  key={String(id)}
                  className={`group relative flex flex-col bg-surface-container-lowest rounded-xl border overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all ${
                    isSelected ? "border-primary ring-2 ring-primary/30" : "border-outline-variant"
                  }`}
                >
                  <div className="aspect-square w-full overflow-hidden bg-surface-container">
                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-on-surface line-clamp-1">{name}</h3>
                      {p.variant && (
                        <p className="text-xs text-on-surface-variant">{p.variant}</p>
                      )}
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-4">
                      <span className="text-xl font-semibold text-primary">
                        {price ? `$${price}` : ""}
                      </span>
                      <button
                        onClick={() => selectAndContinue(p)}
                        className="flex items-center gap-2 px-4 py-2 border border-outline rounded-lg text-sm font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all"
                      >
                        {isSelected ? "Selected ✓" : "+ Select"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="flex justify-start mt-6">
  <button
    onClick={() => navigate({ to: "/" })}
    className="px-6 py-3 rounded-lg border border-outline-variant font-semibold hover:bg-surface-container transition-all"
  >
    ← Back
  </button>
</div>

      </main>
      <AppFooter />
    </div>
  );
}
