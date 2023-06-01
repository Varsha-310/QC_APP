const mongoose = require('mongoose');

/*Scheme for storing giftcard products */

var giftcardSchema = mongoose.Schema(
     { // Generated Shopify Giftcard. Refer to Shopify Giftcard fields
    "id": {type: String},
    "balance": {type: String},
    "created_at": {type: Date},
    "updated_at": {type: Date},
    "currency": {type: String},
    "initial_value": {type: String},
    "disabled_at": {type: Date},
    "line_item_id": {type: Date},
    "api_client_id": {type: String},
    "user_id": {type: String},
    "customer_id": {type: String},
    "note": {type: String},
    "expires_on": {type: Date},
    "template_suffix": {type: String},
    "last_characters": {type: String},
    "order_id": {type: String},
    "code": {type: String}
})

export default  mongoose.model('product', giftcardSchema);