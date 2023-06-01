const mongoose = require('mongoose');

/*Scheme for storing wallet details */

var walletSchema = mongoose.Schema(
    {
        store_url: {type:String},
        shopify_customer_id: {type:String},
        balance: {type:Number},
        transactions:[{
            type: {type:credit},
            amount:{type:String},
            description: {type:String},
            giftcard_details: [{

            }]

        }]
    })

    export default  mongoose.model('wallet', walletSchema);