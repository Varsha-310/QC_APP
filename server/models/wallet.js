const mongoose = require("mongoose");

/*Scheme for storing wallet details */

var walletSchema = mongoose.Schema({
  store_id: { type: String },
  shopify_customer_id: { type: String },
  balance: { type: Number },
  store_name: {type:String},
  giftcard_number: {type:Number}
});

export default mongoose.model("Wallet", walletSchema);
