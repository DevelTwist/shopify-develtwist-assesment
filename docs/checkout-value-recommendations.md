# Adding Value at Checkout (Shopify Plus) — No Extra Recurring Cost

**Goal:** increase conversion and average order value (AOV) at checkout **without
paying for third‑party apps**. Every recommendation below uses capabilities that
are **already included** in the Shopify Plus plan, so there is no new monthly
subscription — only build/configuration time.

> Why this matters: the legacy `checkout.liquid` is deprecated and is being
> sunset by Shopify. The supported path is **Checkout Extensibility**, which is
> native to Plus and free to build on. Migrating now avoids a forced migration
> later and unlocks everything below.

---

## Recommended (in priority order)

### 1. Checkout UI Extensions — free, native to Plus
Build small, sandboxed React/JS components that render in defined slots of the
checkout, Thank‑you, and Order‑status pages. High‑ROI, zero‑app use cases:

| Use case | Slot | Value added |
|---|---|---|
| In‑checkout upsell / cross‑sell | `purchase.checkout.block.render` | +AOV, no app fee |
| Free‑gift threshold messaging ("Spend $20 more for a free X") | dynamic banner | +AOV |
| Trust badges / guarantees / return policy | below summary | +conversion |
| Custom fields (gift message, delivery notes, PO number, tax ID) | order fields | fewer support tickets |
| Loyalty points preview ("Earn 240 points") | order summary | +retention |

Extensions are **checkout‑sandboxed** (no arbitrary DOM/JS on the checkout), so
they are PCI‑safe by design.

### 2. Shopify Functions — free, replaces discount/upsell apps
Run merchant logic on Shopify's infrastructure. No hosting, no app fee:

- **Discount Functions** — tiered/volume discounts, BOGO, automatic free
  shipping above a threshold, customer‑segment pricing.
- **Cart & Checkout Validation Functions** — block invalid combinations, enforce
  min/max quantities, restrict shipping regions.
- **Delivery / Payment customization Functions** — reorder, rename, or hide
  delivery and payment methods (e.g. hide "Cash on delivery" over $X).

These replace the most common paid apps (volume discounts, free‑shipping bars,
"hide payment method" apps) at **zero recurring cost**.

### 3. Post‑Purchase Upsell page — free, native
A one‑click upsell shown **after** payment but before the Thank‑you page. The
customer accepts with no re‑entry of payment details. This is pure incremental
AOV with no risk to the primary conversion.

### 4. Branded Thank‑you & Order‑status pages — free
The order‑status page is the **most‑revisited page** of any store (customers
check it repeatedly for tracking). Add: review request, referral/loyalty prompt,
cross‑sell of consumables/accessories, and social links — all via UI extensions.

### 5. One Page Checkout + Shop Pay — free, already on Plus
Ensure the store is on **one‑page checkout** and that **Shop Pay** is enabled.
Shop Pay's accelerated, vaulted checkout measurably lifts conversion at no cost.

---

## What to avoid
- **Paid checkout apps** for things Functions/UI Extensions already do (volume
  discounts, free‑shipping bars, payment hiding, simple upsells).
- **Editing `checkout.liquid`** — deprecated; effort there is throwaway work.

## Suggested rollout
1. Migrate to Checkout Extensibility (if not already) and confirm Shop Pay + one‑page checkout.
2. Ship a free‑shipping‑threshold **Function** + matching progress banner **UI extension**.
3. Add a **post‑purchase upsell** for the top accessory/consumable.
4. Enrich the **Order‑status page** (reviews, referral, cross‑sell).
5. Layer in trust badges and custom order fields as needed.

**Net:** measurable AOV/conversion gains using only Plus‑included tooling — the
only investment is development time, not recurring app spend.
