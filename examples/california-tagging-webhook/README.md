# California → High Value — webhook reference (Option B)

Portable alternative to Shopify Flow for tagging California buyers. **Prefer Flow
for the Plus client** (free, no hosting). This exists to show the secure pattern.

## Run
```bash
cp .env.example .env   # fill in real values
npm install
npm start
```

## Subscribe the webhook
Register `orders/create` to point at `https://<your-host>/webhooks/orders-create`
(Admin → Settings → Notifications → Webhooks, or via the Admin API). Use the
**webhook signing secret** shown there as `SHOPIFY_WEBHOOK_SECRET`.

## Security notes
- HMAC is verified with a **timing-safe** comparison before any processing;
  failures return `401`.
- The Admin token needs **`write_customers`** scope only (least privilege).
- All secrets are read from environment variables; `.env` is git-ignored.
- Responds `200` quickly, then processes asynchronously to avoid Shopify retries.
