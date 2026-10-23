# ECOMMERCE storefront (React + Vite)

    cp .env.example .env   # VITE_API_BASE_URL, optional VITE_CURRENCY_LABEL
    npm install
    npm run dev            # or: npm run build && npm run preview

Endpoints used (from the supplied OpenAPI): GET /api/v1/products, /products/search, /products/{id},
/categories/all, /categories/{id}, /states/available; POST /api/v1/orders.

Limitations: no wishlist, tracking, newsletter or customer-auth endpoints exist (wishlist is local-only; tracking/FAQ/About/Contact are honest placeholder pages).
Off-Color and Special Event filters are omitted: the product schema has no such attributes.
Delivery: the order request has no delivery-type field; checkout shows an ESTIMATE from the selected state
(see DELIVERY_ESTIMATE_FIELD in src/utils/format.js) and the confirmation shows the server's authoritative figures.
