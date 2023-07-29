import mongoose from "mongoose";

const RefundsLogs = {
    
  store_url: { type: String },
  order_number: String,
  amount : Number,
  gc_rf_amount: Number,
  gc_refunded_at: Date,
  other_rf_amount:{type:Number},
  other_rf_at: Date
};

export default mongoose.model("RefundLogs", RefundsLogs);