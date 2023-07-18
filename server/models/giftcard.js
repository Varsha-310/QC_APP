import mongoose from "mongoose";

/*Scheme for shopify giftcards */

const giftcardSchema = mongoose.Schema({
  id: { type: String },
  balance: { type: String },
  created_at: { type: Date },
  updated_at: { type: Date },
  customer_id: { type: String },
  qc_request: ({}),
  qc_response: ({}),
  code: { type: String },
  order: Object
});

export default mongoose.model("Giftcard", giftcardSchema);
