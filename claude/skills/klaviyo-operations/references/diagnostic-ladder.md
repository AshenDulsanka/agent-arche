# Klaviyo diagnostic ladder

Use the first failing boundary as the working cause. Do not start by editing the flow or template.

## 1. Identity

- Confirm the profile identifier used by the source event: email, phone, external ID, or Klaviyo profile ID.
- Check for duplicate or merged profiles and whether the investigated customer is the profile used in the preview or send.
- Record consent, suppression, list membership, and relevant custom properties separately; they answer different questions.

## 2. Source event and integration

- Confirm the Shopify action actually occurred and capture its source ID and timestamp.
- Verify that the intended Klaviyo metric received an event for the intended profile.
- Compare product, variant, order, cart, currency, and URL properties with the current Shopify source value.
- For onsite behavior, distinguish Shopify-native events from events emitted by Klaviyo onsite tracking.

Official starting points:

- Shopify data synced to Klaviyo: https://help.klaviyo.com/hc/en-us/articles/115005080447
- Klaviyo Events API: https://developers.klaviyo.com/en/reference/events_api_overview
- Klaviyo API authentication: https://developers.klaviyo.com/en/docs/authenticate_

## 3. Trigger and qualification

- Verify the flow trigger points to the correct metric, list, segment, or date property.
- Evaluate trigger filters, profile filters, conditional splits, re-entry rules, and frequency controls against the profile and event as they existed at qualification time.
- Keep current state separate from historical state. A profile that qualifies now may not have qualified when the event occurred.

## 4. Timing and state

- Record the event time, qualification time, delay windows, scheduled send time, and timezone.
- Check flow, action, and message status independently.
- Look for skipped, canceled, waiting, manual, draft, and smart-sending outcomes before investigating deliverability.

## 5. Message rendering

- Preview with the same profile and representative event that produced the failure.
- Verify every template variable against the real event/profile shape. Treat missing properties and fallback behavior explicitly.
- For product content, switch to the product-recommendations skill and identify the exact recommendation surface.

## 6. Delivery

- Check consent, suppression, bounce, unsubscribe, frequency controls, sender configuration, and provider delivery evidence.
- Do not label a qualification or rendering failure as deliverability.

## 7. Evidence capture

Capture the account, profile ID, metric ID/name, event ID/time, flow ID, action/message ID, campaign/template ID when relevant, observed status, and source link. Redact customer data from tickets and logs unless the approved support process requires it.
