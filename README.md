# Shopify Theme Assessment — DevelTwist

Custom work on top of the latest Shopify theme covering four requirements. All
code, comments, and commits are in English.

## Deliverables

### 1. Icon swatches on the variant picker
- [`snippets/swatch.liquid`](snippets/swatch.liquid) — renders an icon swatch per
  option value. Resolution order: native Shopify swatch image → native swatch
  color → curated color map → deterministic HSL fallback.
- [`snippets/product-variant-options.liquid`](snippets/product-variant-options.liquid)
  — adds the `swatch` picker type alongside button/dropdown.
- Styling in [`assets/section-main-product.css`](assets/section-main-product.css)
  (`.product-form__swatch*`), incl. selected/disabled states.
- **Security:** raw option values never reach inline `style`; only vetted swatch
  data, curated hex, or a computed HSL string — preventing CSS injection.

### 2. Per‑variant specification table
- [`sections/product-specifications.liquid`](sections/product-specifications.liquid)
  — configurable spec grid; values assigned **at random but stable per variant**.
- [`snippets/pick-spec-value.liquid`](snippets/pick-spec-value.liquid) — single
  source of truth for the deterministic pick (seeded by variant id).
- [`assets/product-specifications.js`](assets/product-specifications.js) — swaps
  values on Dawn's `variant-change` event; no network calls.
- **Security:** values emitted via the `json` filter and updated with
  `textContent` (never `innerHTML`).
- Design reference (`figma-design.jpg`) is intentionally **git‑ignored**.

### 3. Checkout value — recommendations
- [`docs/checkout-value-recommendations.md`](docs/checkout-value-recommendations.md)
  — how to add value at checkout on **Plus with no new recurring app cost**
  (Checkout UI Extensions, Shopify Functions, post‑purchase upsell, branded
  order‑status page, Shop Pay / one‑page checkout).

### 4. Auto‑tag California buyers as "High Value"
- [`docs/california-high-value-tagging.md`](docs/california-high-value-tagging.md)
- **Recommended:** Shopify Flow (free on Plus) —
  [`flow/california-high-value-customers.flow`](flow/california-high-value-customers.flow).
- **Alternative:** secure webhook reference in
  [`examples/california-tagging-webhook/`](examples/california-tagging-webhook/)
  (HMAC verification, least‑privilege token, secrets via env).

## Local development
```bash
shopify theme dev
```
