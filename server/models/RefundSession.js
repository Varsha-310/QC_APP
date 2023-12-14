import mongoose from "mongoose";

/*Scheme for storing refund logs */
const RefundsLogs =   mongoose.Schema({
    
  store_url: { type: String },
  order_id: Number,
  refundable_amount: Number,
  logs: [{
    
    retries: Number,
    id: String,
    total : Number,
    refund_type: String,
    gc_amount: Number,
    storeCredit: Object,
    amount: Number,
    order_updated_at: Date,
    refund_created_at: Date,
    status: {
      type: String,
      enum: ["in-process","completed", "Failed"],
      default: "in-process"
    }
  }]
},{ timestmps: true});

export default mongoose.model("RefundLog", RefundsLogs);