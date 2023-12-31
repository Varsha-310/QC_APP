import mongoose from "mongoose";
const Schema = mongoose.Schema;

/*Scheme for storing orders */
const orderSchema = new Schema({
    store_url: { type: String },
    id: { type: Number, required: true },
    is_email_sent : {type : Boolean , default : false},
    is_giftcard_order: {type : Boolean , default : false},
    remarks:{type:String},
    app_id: { type: Number },
    browser_ip: { type: String },
    cancel_reason: { type: String },
    cancelled_at: { type: Date },
    cart_token: { type: String },
    checkout_id: { type: Number },
    checkout_token: { type: String },
    closed_at: { type: Date },
    company: { type: String },
    confirmed: { type: Boolean },
    contact_email: { type: String },
    created_at: { type: Date },
    currency: { type: String },
    current_subtotal_price: { type: String },
    current_subtotal_price_set: {
        shop_money: {
            amount: { type: String },
            currency_code: { type: String },
        },
        presentment_money: {
            amount: { type: String },
            currency_code: { type: String },
        },
    },
    current_total_discounts: { type: String },
    current_total_discounts_set: {
        shop_money: {
            amount: { type: String },
            currency_code: { type: String },
        },
        presentment_money: {
            amount: { type: String },
            currency_code: { type: String },
        },
    },
    current_total_duties_set: { type: Schema.Types.Mixed },
    current_total_price: { type: String },
    current_total_price_set: {
        shop_money: {
            amount: { type: String },
            currency_code: { type: String },
        },
        presentment_money: {
            amount: { type: String },
            currency_code: { type: String },
        },
    },
    current_total_tax: { type: String },
    current_total_tax_set: {
        shop_money: {
            amount: { type: String },
            currency_code: { type: String },
        },
        presentment_money: {
            amount: { type: String },
            currency_code: { type: String },
        },
    },
    customer_locale: { type: String },
    device_id: { type: String },
    discount_codes: { type: Array },
    email: { type: String },
    estimated_taxes: { type: Boolean },
    financial_status: { type: String },
    fulfillment_status: { type: String },
    status: { type: String, default: "In Progress" },
    gateway: { type: String },
    location_id: { type: Number },
    name: { type: String },
    note: { type: String },
    note_attributes: { type: Array },
    number: { type: Number },
    order_number: { type: Number },
    order_status_url: { type: String },
    original_total_duties_set: { type: Schema.Types.Mixed },
    payment_gateway_names: { type: Array },
    phone: { type: String },
    presentment_currency: { type: String },
    processed_at: { type: Date },
    processing_method: { type: String },
    reference: { type: String },
    referring_site: { type: String },
    source_identifier: { type: String },
    source_name: { type: String },
    source_url: { type: String },
    subtotal_price: { type: String },
    subtotal_price_set: {
        shop_money: {
            amount: { type: String },
            currency_code: { type: String },
        },
        presentment_money: {
            amount: { type: String },
            currency_code: { type: String },
        },
    },
    tags: { type: String },
    tax_lines: { type: Array },
    taxes_included: { type: Boolean },
    test: { type: Boolean },
    token: { type: String },
    total_discounts: { type: String },
    total_discounts_set: {
        shop_money: {
            amount: { type: String },
            currency_code: { type: String },
        },
        presentment_money: {
            amount: { type: String },
            currency_code: { type: String },
        },
    },
    total_line_items_price: { type: String },
    total_line_items_price_set: {
        shop_money: {
            amount: { type: String },
            currency_code: { type: String },
        },
        presentment_money: {
            amount: { type: String },
            currency_code: { type: String },
        },
    },
    total_outstanding: { type: String },
    total_price: { type: String },
    total_price_set: {
        shop_money: {
            amount: { type: String },
            currency_code: { type: String },
        },
        presentment_money: {
            amount: { type: String },
            currency_code: { type: String },
        },
    },
    total_shipping_price_set: {
        shop_money: {
            amount: { type: String },
            currency_code: { type: String },
        },
        presentment_money: {
            amount: { type: String },
            currency_code: { type: String },
        },
    },
    total_tax: { type: String },
    total_tax_set: {
        shop_money: {
            amount: { type: String },
            currency_code: { type: String },
        },
        presentment_money: {
            amount: { type: String },
            currency_code: { type: String },
        },
    },
    total_tip_received: { type: String },
    total_weight: { type: Number },
    updated_at: { type: Date },
    user_id: { type: Number },
    customer: {
        id: { type: Number },
        email: { type: String },
        accepts_marketing: { type: Boolean },
        created_at: { type: Date },
        updated_at: { type: Date },
        first_name: { type: String },
        last_name: { type: String },
        state: { type: String },
        note: { type: String },
        verified_email: { type: Boolean },
        phone: { type: String },
        currency: { type: String },
    },
    line_items: [
        {
            id: { type: Number },
            admin_graphql_api_id: { type: String },
            fulfillable_quantity: { type: Number },
            fulfillment_service: { type: String },
            fulfillment_status: { type: String },
            gift_card: { type: Boolean },
            grams: { type: Number },
            name: { type: String },
            price: { type: String },
            price_set: { type: Object },
            product_exists: { type: Boolean },
            product_id: { type: Number },
            properties: { type: Array },
            quantity: { type: Number },
            requires_shipping: { type: Boolean },
            sku: { type: String },
            taxable: { type: Boolean },
            title: { type: String },
            total_discount: { type: String },
            total_discount_set: { type: Object },
            variant_id: { type: Number },
            variant_inventory_management: { type: String },
            variant_title: { type: String },
            vendor: { type: String },
            tax_lines: { type: Array },
            duties: { type: Array },
            discount_allocations: { type: Array }
        }
    ],
    payment_terms: { type: String },
    refunds: { type: Array },
    refund_status: { type: String, default: 'N/A' },
    Refund_Mode: { type: String, default: 'N/A' },
    refund_status: { type: String, default: "N/A" },
    shipping_lines: { type: Array },
    qc_gc_created: {
        type: String,
        enum: ["N/A", "NO", "YES"],
        default: "N/A"
    },
    redeem_txn_id: {type: String},

});

export default mongoose.model('orders', orderSchema);
