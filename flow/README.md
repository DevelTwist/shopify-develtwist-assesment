# Auto-tag California customers as "High Value" — Shopify Flow

Recommended, zero-cost path (Shopify Flow is included on Plus). It tags any
customer whose order ships or bills to California so the tag can drive segments,
emails, or VIP discounts later.

> **Note on the `.flow` file:** Shopify Flow only re-imports files that Flow
> itself exported (the import format is an internal, version-specific
> serialization). The [`california-high-value-customers.flow`](california-high-value-customers.flow)
> in this folder is **pseudocode for reference only — it will not import**.
> Build the workflow with the 3 steps below (≈30 seconds). If you want a
> reusable backup, build it, then **Flow → … → Export** and commit that file.

## Build it (3 steps)

In the Shopify admin: **Apps → Flow → Create workflow**.

| Step | What to pick |
|------|--------------|
| **Trigger** | `Order created`  *(use `Order paid` if "purchase" must mean paid)* |
| **Condition** | `Order → Billing address → Province code` **is equal to** `CA` |
| **Action** | `Add customer tags` → `High Value`, `California` |

Then **Turn on workflow** (top right).

### Cover shipping address too (optional)
On the condition step, switch the match logic to **Any** and add a second line:

```
Order → Shipping address → Province code   is equal to   CA
```

## Why `CA` and not "California"
`Province code` is the stable ISO-3166-2 code, so the rule keeps working
regardless of the storefront language. "California" (the display name) can change
with locale.

## Notes
- **Idempotent:** "Add customer tags" is a no-op if the tag already exists, so
  repeat buyers won't accumulate duplicates.
- **Needs a customer:** guest checkouts with no customer record can't be tagged.
- The `High Value` tag can then power a **customer segment**, an email flow, or a
  VIP discount **Function** — all free on Plus.

## Test it
1. Make sure the workflow is **on**.
2. Admin → **Orders → Create order**: add a product, attach a **customer**, set a
   **California** address, then **Mark as paid**.
3. Open that customer under **Customers** → they should now have the
   `High Value` and `California` tags.

## Code alternative
If the logic must live outside Shopify, see the secure webhook reference in
[`../examples/california-tagging-webhook/`](../examples/california-tagging-webhook/)
(HMAC verification, least-privilege token). It needs hosting, so prefer Flow.
