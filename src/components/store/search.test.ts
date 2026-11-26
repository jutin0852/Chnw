import assert from "node:assert/strict";
import { test } from "node:test";
import { searchItems, type SearchItem } from "./search";

const items: SearchItem[] = [
  { slug: "the-triangle-tote", name: "The Triangle Tote, Black", price: "45000", category: "Bags" },
  { slug: "the-triangle-tote-brown", name: "The Triangle Tote, Brown", price: "45000", category: "Bags" },
  { slug: "the-crochet-denim-skirt", name: "The Crochet Denim Skirt", price: "60000", category: "Skirts", colours: ["Black", "Olive green"] },
];

test("search matches every word across name, category and colours", () => {
  assert.deepEqual(searchItems(items, "tote").map((i) => i.slug), ["the-triangle-tote", "the-triangle-tote-brown"]);
  assert.deepEqual(searchItems(items, "brown tote").map((i) => i.slug), ["the-triangle-tote-brown"]);
  assert.deepEqual(searchItems(items, "OLIVE skirt").map((i) => i.slug), ["the-crochet-denim-skirt"]);
  assert.deepEqual(searchItems(items, "bags").length, 2);
});

test("an empty or unmatched search returns nothing", () => {
  assert.deepEqual(searchItems(items, "   "), []);
  assert.deepEqual(searchItems(items, "hat"), []);
});
