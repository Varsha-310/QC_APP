import mongoose from "mongoose";

/*Scheme for storing refund logs */
const OCELog = mongoose.Schema({
    
  store: { type: String },
  orderId: Number,
  action: {
    type: String, 
    enum: ["redeem","self","other"], 
    default: "redeem"
  },
  redeem: Object,
  self: Object,
  other: Object,
  retriedAt: Date,
  numberOfRetried: {
    type:Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["retry", "done", "error"],
    default: "retry"
  }
},{ timestmps: true});

export default mongoose.model("OrderCreateEventLog", OCELog);