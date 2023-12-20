import mongoose from "mongoose";

/*Scheme for storing wallet details */

var walletSchema = mongoose.Schema({
  store_url: { type: String },
  shopify_customer_id: { type: String },
  shopify_giftcard_id: { type: String },
  shopify_giftcard_pin: { type: String },
  wallet_id: {type:String},
  balance: { type: Number },
  WalletPin: String
});

export default mongoose.model("Wallet", walletSchema);
