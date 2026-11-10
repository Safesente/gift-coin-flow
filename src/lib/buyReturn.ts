export interface BuySelection {
  card: string;
  quantity: number;
  amount: number | "";
  country: string;
  format: string;
}

export function buyReturnPath(selection: BuySelection) {
  const params = new URLSearchParams({
    card: selection.card, quantity: String(selection.quantity),
    amount: String(selection.amount), country: selection.country,
    format: selection.format, review: "true",
  });
  return `/buy?${params}`;
}

// Only checkout return links are supported; never navigate to a supplied external URL.
export function safeBuyReturnPath(path: string | null) {
  if (!path?.startsWith("/buy?") || /[\\\r\n]/.test(path)) return "/dashboard";
  return path;
}