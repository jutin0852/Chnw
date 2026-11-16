# Paystack payment setup

CHNW now uses Paystack's hosted checkout for Nigerian naira payments. The store creates an unpaid order first, verifies the completed Paystack transaction on the server, and only then marks the order paid and reduces stock.

## Add the environment variables

Create a Paystack account and use **test** keys while testing. Add these variables in the local `.env` file and Vercel's Production and Preview environments:

```bash
PAYSTACK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

`PAYSTACK_SECRET_KEY` stays server-only. Do not add it to client code or make it a `NEXT_PUBLIC_` variable. `NEXT_PUBLIC_APP_URL` must be the exact public site address, without a trailing slash. It is used for the secure return from Paystack after a payment.

When you are ready to accept money, replace the test key with Paystack's live secret key only after your Paystack business account is activated.

## Set the webhook

In Paystack Dashboard, set this webhook URL:

```text
https://your-vercel-domain.vercel.app/api/paystack/webhook
```

The webhook is signature-checked with the same secret key and verifies the transaction again before it changes an order. It also covers cases where a customer closes the browser before returning to the store.

## Test before launch

1. Deploy after adding the two environment variables.
2. Add an in-stock product and complete checkout with a Paystack test payment method.
3. Confirm the return page says “Payment received.”
4. In the admin, confirm the order shows `paid` and the stock count reduced once.
5. Repeat with an abandoned/failed test payment and confirm no stock is reduced.
6. Confirm the webhook URL receives a successful test event in Paystack Dashboard.

Nigeria is the active market, so checkout is fixed to NGN. International cards and currencies can be enabled later after they are approved and configured in the Paystack account.

---

# Bachs payment setup (alternative to Paystack)

The store can take payments through [Bachs](https://bachs.io) instead of Paystack. Both are built in; one setting chooses which one new checkouts use. The order flow is the same: an unpaid order is created and stock is held, the customer pays on the provider's hosted page, and the server checks the payment with the provider before marking the order paid.

## 1. Environment variables

```bash
PAYMENT_PROVIDER=bachs            # or "paystack"
BACHS_SECRET_KEY=sk_sandbox_...   # sk_live_... when you go live
BACHS_WEBHOOK_SECRET=...          # the signing secret of the webhook endpoint below
```

- A key that starts with `sk_sandbox_` talks to Bachs's test system, `sk_live_` to the real one. Nothing else changes when you go live.
- If `PAYMENT_PROVIDER` is not set, the store uses Bachs only when a Bachs key is set and no Paystack key is.
- All three stay server-only. Never prefix them with `NEXT_PUBLIC_`.

## 2. Webhook

In the Bachs Developer Portal, under Webhooks, add this endpoint and subscribe it to `collection.succeeded`, `collection.underpaid` and `checkout.completed`:

```text
https://your-domain/api/bachs/webhook
```

Copy that endpoint's signing secret into `BACHS_WEBHOOK_SECRET`. Deliveries are verified (HMAC-SHA256, five-minute window) and anything unsigned is rejected.

## 3. Things that differ from Paystack

- Bachs refuses `localhost` return addresses, even in the sandbox. Test on the deployed site (or a tunnel), not on `localhost:3000`.
- The hosted page shows the order total and reference, not the individual items.
- Payments made by bank transfer cannot be refunded through Bachs; card payments can, once per payment.
- A customer who transfers less than the total is flagged for review (`refund_required`) and the stock is released; a customer who transfers more is treated as paid.

## 4. Test checklist

1. Set the three variables with sandbox values on the deployed site and redeploy.
2. Place an order and pay with a sandbox card and with a sandbox bank transfer.
3. Confirm the return page shows the order as paid, the order is `paid` in `/admin`, stock went down once, and the confirmation email arrived.
4. In the Developer Portal, confirm the webhook delivery shows a `2xx` response.
5. Abandon a checkout and confirm the held stock is released after the reservation window.
