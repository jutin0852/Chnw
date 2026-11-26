"use client";

import { useState } from "react";
import { PRODUCT_COLOURS, swatchFor } from "@/config/colours";

/**
 * "Comes in more than one colour?" for the add and edit product forms. Tick the colours the
 * customer can choose from on the product page; other colours can be typed in.
 */
export function ColourPicker({ value, onChange }: { value: string[]; onChange: (colours: string[]) => void }) {
  const [enabled, setEnabled] = useState(value.length > 0);
  const [custom, setCustom] = useState("");
  const extra = value.filter((name) => !PRODUCT_COLOURS.some((c) => c.name.toLowerCase() === name.toLowerCase()));

  const has = (name: string) => value.some((v) => v.toLowerCase() === name.toLowerCase());
  const toggle = (name: string) => onChange(has(name) ? value.filter((v) => v.toLowerCase() !== name.toLowerCase()) : [...value, name]);
  function addCustom() {
    const name = custom.trim().replace(/\s+/g, " ").slice(0, 40);
    if (name && !has(name)) onChange([...value, name]);
    setCustom("");
  }

  return (
    <div className="space-y-3 rounded-lg border border-black/15 p-4">
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => {
            setEnabled(e.target.checked);
            if (!e.target.checked) onChange([]);
          }}
          className="mt-0.5 size-4 accent-[var(--brand)]"
        />
        <span>
          <span className="font-medium">This product comes in more than one colour</span>
          <span className="block text-xs text-muted-foreground">Customers must pick a colour on the product page, and it is saved with their order.</span>
        </span>
      </label>

      {enabled && (
        <div className="space-y-3 pl-7">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Colours offered">
            {[...PRODUCT_COLOURS.map((c) => c.name), ...extra].map((name) => {
              const on = has(name);
              const swatch = swatchFor(name);
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(name)}
                  className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${on ? "border-black bg-black text-white" : "border-black/20 hover:border-black"}`}
                >
                  <span className="size-3.5 rounded-full border border-white/40" style={{ background: swatch || "repeating-linear-gradient(45deg,#ccc,#ccc 3px,#eee 3px,#eee 6px)" }} aria-hidden="true" />
                  {name}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustom();
                }
              }}
              maxLength={40}
              placeholder="Another colour, e.g. Cream"
              className="h-9 min-w-0 flex-1 rounded-md border border-black/20 bg-white px-3 text-sm outline-none focus:border-[var(--brand)]"
            />
            <button type="button" onClick={addCustom} className="rounded-md border border-black/20 px-3 text-sm hover:bg-muted">Add</button>
          </div>
          <p className="text-xs text-muted-foreground">
            {value.length === 0 ? "Pick at least one colour, or untick the box above." : `Offered in: ${value.join(", ")}. Click a colour again to remove it.`}
          </p>
        </div>
      )}
    </div>
  );
}
