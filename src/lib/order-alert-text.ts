// Wording for the team's new-order notification. Kept free of server imports so it can be tested.

export type OrderAlert = {
  orderId: string;
  orderNumber: string;
  customerName: string;
  totalLabel: string;
  items: { name: string; size: string | null; quantity: number }[];
};

/** "Ada ordered The Gigi Pants (UK 4) × 2, The Triangle Tote and 1 more." */
export function describeOrderedItems(customerName: string, items: OrderAlert["items"]) {
  const label = (item: OrderAlert["items"][number]) => `${item.name}${item.size && item.size !== "ONE_SIZE" ? ` (${item.size})` : ""}${item.quantity > 1 ? ` × ${item.quantity}` : ""}`;
  const shown = items.slice(0, 2).map(label);
  const more = items.length - shown.length;
  const list = more > 0 ? `${shown.join(", ")} and ${more} more` : shown.join(" and ");
  return `${customerName} ordered ${list || "an order"}.`;
}
