export type SearchItem = { slug: string; name: string; price: string; image?: string; category?: string; colours?: string[] };

/** Every word typed must appear in the name, category or a colour ("black skirt" finds black skirts). */
export function searchItems(items: SearchItem[], query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return items.filter((item) => {
    const haystack = [item.name, item.category, ...(item.colours || [])].join(" ").toLowerCase();
    return words.every((w) => haystack.includes(w));
  });
}
