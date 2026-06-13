/**
 * Reference webhook handler: tag California buyers as "High Value".
 *
 * This is the *portable alternative* to Shopify Flow (see
 * docs/california-high-value-tagging.md). Prefer Flow for this client — it is
 * free on Plus and needs no hosting. This handler exists to demonstrate the
 * security-critical pieces when the logic must live outside Shopify.
 *
 * Subscribe this endpoint to the `orders/create` webhook topic.
 *
 * Security model:
 *   - Every request is verified with the shop's webhook HMAC using a
 *     timing-safe comparison. Unverified requests are rejected with 401 and
 *     never reach business logic.
 *   - All secrets come from environment variables — nothing is hard-coded.
 *   - The raw request body is used for HMAC (a re-serialized JSON body would
 *     not match Shopify's signature).
 */

'use strict';

const express = require('express');
const crypto = require('crypto');

const {
  SHOPIFY_WEBHOOK_SECRET, // Admin → Notifications/webhook signing secret
  SHOPIFY_SHOP, // e.g. my-shop.myshopify.com
  SHOPIFY_ADMIN_TOKEN, // Admin API access token with write_customers
  PORT = 3000,
  ADMIN_API_VERSION = '2025-01',
} = process.env;

for (const [key, value] of Object.entries({
  SHOPIFY_WEBHOOK_SECRET,
  SHOPIFY_SHOP,
  SHOPIFY_ADMIN_TOKEN,
})) {
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
}

const app = express();

// Capture the raw body so we can verify the HMAC against the exact bytes
// Shopify signed. JSON parsing happens only after verification succeeds.
app.use(
  '/webhooks/orders-create',
  express.raw({ type: 'application/json', limit: '2mb' })
);

/**
 * Constant-time verification of Shopify's webhook HMAC.
 * @param {Buffer} rawBody raw request body bytes
 * @param {string} hmacHeader value of the X-Shopify-Hmac-Sha256 header
 * @returns {boolean}
 */
function isValidShopifyHmac(rawBody, hmacHeader) {
  if (!hmacHeader) return false;
  const digest = crypto
    .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('base64');

  const a = Buffer.from(digest, 'utf8');
  const b = Buffer.from(hmacHeader, 'utf8');
  // Length check first: timingSafeEqual throws on length mismatch.
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Add tags to a customer via the Admin GraphQL API (additive + idempotent). */
async function addCustomerTags(customerGid, tags) {
  const query = `
    mutation AddTags($id: ID!, $tags: [String!]!) {
      tagsAdd(id: $id, tags: $tags) {
        node { id }
        userErrors { field message }
      }
    }`;

  const response = await fetch(
    `https://${SHOPIFY_SHOP}/admin/api/${ADMIN_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
      },
      body: JSON.stringify({ query, variables: { id: customerGid, tags } }),
    }
  );

  const body = await response.json();
  const userErrors = body?.data?.tagsAdd?.userErrors ?? [];
  if (!response.ok || userErrors.length) {
    throw new Error(`tagsAdd failed: ${JSON.stringify(userErrors || body)}`);
  }
}

app.post('/webhooks/orders-create', async (req, res) => {
  // 1. Authenticate the webhook before doing anything else.
  if (!isValidShopifyHmac(req.body, req.get('X-Shopify-Hmac-Sha256'))) {
    return res.status(401).send('Invalid HMAC');
  }

  // 2. Acknowledge fast (Shopify expects 200 within 5s); process after.
  res.status(200).send('OK');

  try {
    const order = JSON.parse(req.body.toString('utf8'));

    const provinceCode =
      order?.billing_address?.province_code ||
      order?.shipping_address?.province_code;

    if (provinceCode !== 'CA') return; // Not California — nothing to do.

    const customerId = order?.customer?.id;
    if (!customerId) return; // Guest checkout without a customer record.

    const customerGid = `gid://shopify/Customer/${customerId}`;
    await addCustomerTags(customerGid, ['High Value', 'California']);
    console.log(`Tagged customer ${customerId} as High Value (CA order ${order.id})`);
  } catch (error) {
    // Logged for observability; the 200 above prevents Shopify retries storms.
    console.error('Failed to process orders/create webhook:', error);
  }
});

app.listen(PORT, () => console.log(`Webhook listening on :${PORT}`));
