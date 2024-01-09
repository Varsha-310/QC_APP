import orders from "../models/orders.js";
import {describe, expect, test} from '@jest/globals';
import { app } from "../server";
import  request  from "supertest";


describe("order create for giftcard purchase", () => {

    test("checking giftcard flow", async () => {
        const payload = {
            
                "id": 56756510722910,
                "admin_graphql_api_id": "gid://shopify/Order/5675651072291",
                "app_id": 580111,
                "browser_ip": "163.116.213.90",
                "buyer_accepts_marketing": false,
                "cancel_reason": null,
                "cancelled_at": null,
                "cart_token": "Z2NwLXVzLWVhc3QxOjAxSEtDRUZDWDFBVEJLMjlDOENGNjlOMFRa",
                "checkout_id": 37112126767395,
                "checkout_token": "947f7241cd9f135b1316515bf39f3a2a",
                "client_details": {
                "accept_language": "en-IN",
                "browser_height": null,
                "browser_ip": "163.116.213.90",
                "browser_width": null,
                "session_hash": null,
                "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                },
                "closed_at": null,
                "company": null,
                "confirmed": true,
                "contact_email": "nitin.prabhu@pinelabs.com",
                "created_at": "2024-01-05T14:45:39+05:30",
                "currency": "INR",
                "current_subtotal_price": "100.00",
                "current_subtotal_price_set": {
                "shop_money": {
                "amount": "100.00",
                "currency_code": "INR"
                },
                "presentment_money": {
                "amount": "100.00",
                "currency_code": "INR"
                }
                },
                "current_total_discounts": "0.00",
                "current_total_discounts_set": {
                "shop_money": {
                "amount": "0.00",
                "currency_code": "INR"
                },
                "presentment_money": {
                "amount": "0.00",
                "currency_code": "INR"
                }
                },
                "current_total_duties_set": null,
                "current_total_price": "100.00",
                "current_total_price_set": {
                "shop_money": {
                "amount": "100.00",
                "currency_code": "INR"
                },
                "presentment_money": {
                "amount": "100.00",
                "currency_code": "INR"
                }
                },
                "current_total_tax": "0.00",
                "current_total_tax_set": {
                "shop_money": {
                "amount": "0.00",
                "currency_code": "INR"
                },
                "presentment_money": {
                "amount": "0.00",
                "currency_code": "INR"
                }
                },
                "customer_locale": "en-IN",
                "device_id": null,
                "discount_codes": [],
                "email": "nitin.prabhu@pinelabs.com",
                "estimated_taxes": false,
                "financial_status": "paid",
                "fulfillment_status": null,
                "gateway": "bogus",
                "landing_site": "/password",
                "landing_site_ref": null,
                "location_id": null,
                "merchant_of_record_app_id": null,
                "name": "#1008",
                "note": null,
                "note_attributes": [],
                "number": 8,
                "order_number": 1008,
                "order_status_url": "https://qc-test-store-13.myshopify.com/84305576227/orders/12e0c4f6ec2feca8442b0f7e976fbc22/authenticate?key=0deea784cd217bd363ef6164f4daec73",
                "original_total_duties_set": null,
                "payment_gateway_names": [
                "bogus"
                ],
                "phone": null,
                "presentment_currency": "INR",
                "processed_at": "2024-01-05T14:45:38+05:30",
                "processing_method": "direct",
                "reference": "113b98d31e2c537ca62aa233ecd71ba6",
                "referring_site": "",
                "source_identifier": "113b98d31e2c537ca62aa233ecd71ba6",
                "source_name": "web",
                "source_url": null,
                "subtotal_price": "100.00",
                "subtotal_price_set": {
                "shop_money": {
                "amount": "100.00",
                "currency_code": "INR"
                },
                "presentment_money": {
                "amount": "100.00",
                "currency_code": "INR"
                }
                },
                "tags": "",
                "tax_lines": [],
                "taxes_included": false,
                "test": true,
                "token": "12e0c4f6ec2feca8442b0f7e976fbc22",
                "total_discounts": "0.00",
                "total_discounts_set": {
                "shop_money": {
                "amount": "0.00",
                "currency_code": "INR"
                },
                "presentment_money": {
                "amount": "0.00",
                "currency_code": "INR"
                }
                },
                "total_line_items_price": "100.00",
                "total_line_items_price_set": {
                "shop_money": {
                "amount": "100.00",
                "currency_code": "INR"
                },
                "presentment_money": {
                "amount": "100.00",
                "currency_code": "INR"
                }
                },
                "total_outstanding": "0.00",
                "total_price": "100.00",
                "total_price_set": {
                "shop_money": {
                "amount": "100.00",
                "currency_code": "INR"
                },
                "presentment_money": {
                "amount": "100.00",
                "currency_code": "INR"
                }
                },
                "total_shipping_price_set": {
                "shop_money": {
                "amount": "0.00",
                "currency_code": "INR"
                },
                "presentment_money": {
                "amount": "0.00",
                "currency_code": "INR"
                }
                },
                "total_tax": "0.00",
                "total_tax_set": {
                "shop_money": {
                "amount": "0.00",
                "currency_code": "INR"
                },
                "presentment_money": {
                "amount": "0.00",
                "currency_code": "INR"
                }
                },
                "total_tip_received": "0.00",
                "total_weight": 0,
                "updated_at": "2024-01-05T14:45:40+05:30",
                "user_id": null,
                "billing_address": {
                "first_name": "Nitin",
                "address1": "Old Bank Colony, Konanakunte",
                "phone": null,
                "city": "BENGALURU (BANGALORE) URBAN",
                "zip": "560062",
                "province": "Karnataka",
                "country": "India",
                "last_name": "Prabhu",
                "address2": "test",
                "company": null,
                "latitude": 12.8842482,
                "longitude": 77.56944229999999,
                "name": "Nitin Prabhu",
                "country_code": "IN",
                "province_code": "KA"
                },
                "customer": {
                "id": 7776236306723,
                "email": "nitin.prabhu@pinelabs.com",
                "accepts_marketing": false,
                "created_at": "2024-01-05T14:44:48+05:30",
                "updated_at": "2024-01-05T17:20:05+05:30",
                "first_name": "Nitin",
                "last_name": "Prabhu",
                "state": "enabled",
                "note": null,
                "verified_email": false,
                "multipass_identifier": null,
                "tax_exempt": false,
                "phone": null,
                "email_marketing_consent": {
                "state": "not_subscribed",
                "opt_in_level": "single_opt_in",
                "consent_updated_at": null
                },
                "sms_marketing_consent": null,
                "tags": "",
                "currency": "INR",
                "accepts_marketing_updated_at": "2024-01-05T14:44:48+05:30",
                "marketing_opt_in_level": null,
                "tax_exemptions": [],
                "admin_graphql_api_id": "gid://shopify/Customer/7776236306723",
                "default_address": {
                "id": 9836377014563,
                "customer_id": 7776236306723,
                "first_name": "Nitin",
                "last_name": "Prabhu",
                "company": null,
                "address1": "Old Bank Colony, Konanakunte",
                "address2": "test",
                "city": "BENGALURU (BANGALORE) URBAN",
                "province": "Karnataka",
                "country": "India",
                "zip": "560062",
                "phone": null,
                "name": "Nitin Prabhu",
                "province_code": "KA",
                "country_code": "IN",
                "country_name": "India",
                "default": true
                }
                },
                "discount_applications": [],
                "fulfillments": [],
                "line_items": [
                {
                "id": 14501784027427,
                "admin_graphql_api_id": "gid://shopify/LineItem/14501784027427",
                "fulfillable_quantity": 1,
                "fulfillment_service": "manual",
                "fulfillment_status": null,
                "gift_card": false,
                "grams": 0,
                "name": "giftcard - v1",
                "price": "100.00",
                "price_set": {
                "shop_money": {
                "amount": "100.00",
                "currency_code": "INR"
                },
                "presentment_money": {
                "amount": "100.00",
                "currency_code": "INR"
                }
                },
                "product_exists": true,
                "product_id": 8911607988515,
                "properties": [
                {
                "name": "_Qc_img_url",
                "value": "https://qc-test-store-13.myshopify.com/cdn/shop/products/0266cf3595d8df10424bed90511f9871.jpg?v=1703229368"
                },
                {
                "name": "_Qc_recipient_name",
                "value": "Nitin"
                },
                {
                "name": "_Qc_recipient_email",
                "value": "nitin.prabhu@pinelabs.com"
                },
                {
                "name": "_Qc_recipient_message",
                "value": "test"
                }
                ],
                "quantity": 1,
                "requires_shipping": false,
                "sku": "",
                "taxable": false,
                "title": "giftcard",
                "total_discount": "0.00",
                "total_discount_set": {
                "shop_money": {
                "amount": "0.00",
                "currency_code": "INR"
                },
                "presentment_money": {
                "amount": "0.00",
                "currency_code": "INR"
                }
                },
                "variant_id": 47231264719139,
                "variant_inventory_management": null,
                "variant_title": "v1",
                "vendor": "QC Test Store 13",
                "tax_lines": [],
                "duties": [],
                "discount_allocations": []
                }
                ],
                "payment_details": {
                "credit_card_bin": "1",
                "avs_result_code": null,
                "cvv_result_code": null,
                "credit_card_number": "•••• •••• •••• 1",
                "credit_card_company": "Bogus",
                "buyer_action_info": null,
                "credit_card_name": "test",
                "credit_card_wallet": null,
                "credit_card_expiration_month": 11,
                "credit_card_expiration_year": 2030
                },
                "payment_terms": null,
                "refunds": [],
                "shipping_lines": []
                

        }
        const resp  = await request(app)
            .post("webhooks/ordercreated")
            .send(payload)
            .set("x-shopify-shop-domain", "qc-test-store-13.myshopify.com")
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        console.log(JSON.stringify(resp.body));
        expect(resp.statusCode).toEqual(200);
    }, 30000);
});