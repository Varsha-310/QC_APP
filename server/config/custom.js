export const webhooks = [
    { "topic": "customers/data_request", endpoint: "/gdpr/customer/data" },
    { "topic": "customers/redact", endpoint: "/gdpr/customer/delete" },
    { "topic": "shop/redact", endpoint: "/gdpr/store/delete" },
    { "topic": "orders/created", endpoint: "/gdpr/store/delete" },
    { "topic": "orders/updated", endpoint: "/gdpr/store/delete" },
    { "topic": "orders/cancelled", endpoint: "/gdpr/store/delete" }
];


