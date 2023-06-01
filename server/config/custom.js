export const webhooks = [
    { "topic": "customers/data_request", endpoint: "/gdpr/customer/data" },
    { "topic": "customers/redact", endpoint: "/gdpr/customer/delete" },
    { "topic": "shop/redact", endpoint: "/gdpr/store/delete" },
    { "topic": "orders/created", endpoint: "/webhooks/ordercreated" },
    { "topic": "orders/updated", endpoint: "/webhooks/orderupdated" },
    { "topic": "orders/cancelled", endpoint: "/webhooks/orderdeleted" },  
    {"topic": "app/uninstalled", endpoint: "shopify/uninstall"}
];


