import mongoose from "mongoose";

/*Scheme for storing giftcard products */

const giftcardSchema = mongoose.Schema({
  id: { type: String },
  balance: { type: String },
  created_at: { type: Date },
  updated_at: { type: Date },
  customer_id: { type: String },
  expires_on: { type: Date },
  qc_request: ({}),
  qc_response: ({}),
  logs:[{
    order
  }],
  code: { type: String }
});

export default mongoose.model("Giftcard", giftcardSchema);
