export type Product = {
  product_id: string | number;
  title?: string;
  name?: string;
  price?: number | string;
  image?: string;
  image_url?: string;
  variant?: string;
  description?: string;
  [k: string]: any;
};

export type ReturnState = {
  order_number: string;
  email: string;
  order: any;
  products: Product[];
  selected_product_id: string | number | null;
  selected_variant_id:string | number | null;
  return_type: string | null;
  reason: string | null;
  return_id: string | null;
};

const KEY = "swiftreturn-state";

const empty: ReturnState = {
  order_number: "",
  email: "",
  order: null,
  products: [],
  selected_product_id: null,
  selected_variant_id:null,
  return_type: null,
  reason: null,
  return_id: null,
};

export function getState(): ReturnState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
}

export function setState(patch: Partial<ReturnState>) {
  if (typeof window === "undefined") return;
  const next = { ...getState(), ...patch };
  sessionStorage.setItem(KEY, JSON.stringify(next));
}

export const API_BASE = "http://127.0.0.1:8000";
