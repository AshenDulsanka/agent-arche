# Product recommendation surface diagnostics

## Marketing email Product block and product feed

Confirm all of the following before editing the block:

- The message uses a supported Klaviyo editor and the block is dynamic rather than a manually selected static product.
- The intended product feed is selected in the actual flow message or campaign version being sent.
- The Shopify catalog integration is connected and the relevant item and variant have synced to Klaviyo.
- The candidate has an image, is available/in stock according to the synced catalog, and is not excluded by the feed or by the recommendation rule.
- The candidate was not removed because it was already purchased by the recipient or appears in the triggering event. Confirm current exclusions in official docs because they can change.
- Behavioral strategies have the required Viewed Product, Added to Cart, Checkout Started, or purchase data for the same identified profile.
- The preview uses a representative profile and event. A generic preview, fallback, or insufficient history can make every recipient appear to receive the same product.
- The model or feed has had enough time to retrain or ingest recent catalog/event changes. Do not call a delay the root cause until all earlier boundaries pass.

If catalog values are stale, use Klaviyo's Shopify catalog-resync troubleshooting before hand-editing the Klaviyo catalog:

https://help.klaviyo.com/hc/en-us/sections/49375372745115

## Next Best Product

Treat Next Best Product as separate from ordinary product feeds.

- Verify current subscription/feature access and that the revenue metric is mapped to the correct Placed Order metric.
- Confirm the ecommerce integration and catalog are healthy in Catalog Insights.
- Inspect NBP-specific product/category exclusions and the previous-purchase window.
- Confirm whether the profile has enough purchase history and document the current fallback for profiles without a recommendation.
- Allow the documented propagation window after changing NBP settings, then retest with the same profile.

Current official starting points:

- https://help.klaviyo.com/hc/en-us/articles/26685770823451
- https://help.klaviyo.com/hc/en-us/articles/53450584076827

## Customer Hub and onsite recommendations

- Confirm Customer Hub is enabled and the recommendation extension/block is enabled on the intended storefront.
- Distinguish signed-in, identified, and anonymous shoppers; their personalization and fallback paths can differ.
- Verify Shopify tracking, recent browsing/purchase data, and any Shopify exclusion tags documented for that surface.
- Check whether a recently changed product or exclusion is still inside its documented sync or model-update window.

Official starting points:

- https://help.klaviyo.com/hc/en-us/articles/33660504643867
- https://help.klaviyo.com/hc/en-us/articles/53665916979099

## Customer Agent Product Recommendations

This is a shopper-support skill, not the email Product block.

- Verify Shopify is connected and that the built-in skill is active.
- Confirm the request was routed to Product Recommendations rather than General Q&A or a custom skill.
- Inspect the shopper context and product data available to the chosen skill.
- Account for channel rendering: email may return plain text and links rather than rich product cards.
- Use the Customer Agent playground and a controlled shopper scenario before enabling a custom replacement.

Official starting point:

https://help.klaviyo.com/hc/en-us/articles/45769973148571

## Evidence table

For each test, record:

| Boundary | Expected | Observed | Evidence |
|---|---|---|---|
| Shopify product/variant | Eligible source item | | Product and variant IDs |
| Klaviyo catalog | Current synchronized item | | Catalog item/variant IDs |
| Profile behavior | Required events/history | | Profile, metric, event IDs and times |
| Recommendation config | Correct feed/rule/exclusions | | Feed, NBP, Hub, or skill settings |
| Message/surface | Correct live version | | Flow/message/template or surface ID |
| Rendered result | Expected items/fallback | | Controlled preview or test send |
