# Auto‑tag California Customers as "High Value"

**Requirement:** when a customer **purchases** from California, automatically tag
them as a high‑value customer.

Two approaches are provided. **Shopify Flow is the recommended production path**
on Plus — it is included with the plan, requires no hosting, and adds no
recurring cost (consistent with the checkout recommendations). A code‑based
webhook is included as a portable, framework‑agnostic alternative.

---

## Option A — Shopify Flow (recommended, no extra cost) ✅

Flow ships free with Shopify Plus. The workflow:

```
Trigger:   Order created
   │
Condition: Order  →  Billing address  →  Province code  is equal to  CA
   │           (also checks shipping address as a fallback)
   ▼
Action:    Add customer tags  →  ["High Value", "California"]
```

Why **province code `CA`** instead of the province name "California":
`provinceCode` is the stable ISO‑3166‑2 subdivision code and is locale‑independent,
so it will not break if the storefront language changes.

### Install
1. Admin → **Settings → Apps → Shopify Flow** (or the Flow app).
2. **Import** → select [`flow/california-high-value-customers.flow`](../flow/california-high-value-customers.flow).
3. Review the trigger/condition/action, then **Turn on workflow**.

A ready‑to‑import export lives at
[`flow/california-high-value-customers.flow`](../flow/california-high-value-customers.flow).

### Notes & best practices
- **Idempotent:** "Add customer tags" is a no‑op if the tag already exists, so a
  repeat buyer won't accumulate duplicate tags.
- **Order created vs. paid:** the export triggers on **Order created**. If
  "purchase" should mean *paid*, switch the trigger to **Order paid** (or add a
  `financialStatus = PAID` condition) — both are noted inline in the export.
- The `High Value` tag can then drive a **customer segment**, an email flow, or a
  VIP discount **Function** — all free on Plus.

---

## Option B — Admin API webhook (portable alternative)

A reference Node/Express handler lives in
[`examples/california-tagging-webhook/`](../examples/california-tagging-webhook/).
Use this only if the logic must live outside Shopify (e.g. alongside an existing
service). It demonstrates the security‑critical pieces:

- **HMAC verification** of every webhook with a timing‑safe comparison — requests
  that fail verification are rejected with `401` (never trust an unverified
  webhook).
- **Secrets from environment variables** only — no credentials in source.
- Tagging via the **Admin GraphQL `tagsAdd`** mutation, which is additive and
  idempotent.

This path **does** require hosting, so it is not free — prefer **Option A** for
this client.
