import mongoose from "mongoose";

/*Scheme for storing refund logs */
const RefundsLogs =   mongoose.Schema({
    
  store_url: { type: String },
  order_id: Number,
  refundable_amount: Number,
  logs: [{
    id: String,
    amount : Number,
    refund_type: String,
    gc_rf_amount: Number,
    gc_refunded_at: Date,
    qc_gc_created: Date,
    qc_gc_amount: Number,
    other_rf_amount:{type:Number},
    other_rf_at: Date,
    order_updated_at: Date,
    refund_created_at: Date,
    status: {
      type: String,
      enum: ["pending","completed"],
      default: "pending"
    }
  }]
},{ timestmps: true});

export default mongoose.model("RefundLog", RefundsLogs);