import mongoose from "mongoose";

/*Scheme for storing wallet details */

var walletSchema = mongoose.Schema({
  store_url: { type: String },
  shopify_customer_id: { type: String },
  wallet_id: {type:String},
  balance: { type: Number },
  store_name: {type:String},
  shopify_gc_number: {type:Number},
  qc_gc_list: [
    {
      gc_number: Number,
      code: Number,    
      date: Date,
      amount: Number
    }
  ]
});

export default mongoose.model("Wallet", walletSchema);
