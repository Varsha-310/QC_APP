import mongoose from "mongoose";

/*Scheme for QC giftcards */

const qcGiftcardSchema = mongoose.Schema({
  gc_pin: { type: String },
  gc_number: { type: String },
  balance: { type: Number },
  expiry_date: { type: Date },
  created_at: { type: Date },
  updated_at: { type: Date },
  order_id: {type: String},
  type: {type: String , enum: ["refund", "giftcard"]}, 
});

export default mongoose.model("qc_gc", qcGiftcardSchema);
