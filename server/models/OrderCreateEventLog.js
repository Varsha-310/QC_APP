import mongoose from "mongoose";

/*Scheme for storing refund logs */
const OCELog = mongoose.Schema({
    
  store: { type: String },
  orderId: Number,
  action: {
    type: String, 
    enum: ["redeem","self","gift"], 
    default: "redeem"
  },
  redeem: Object,
  self: Object,
  gift: Object,
  reverse: Object,
  retriedAt: Date,
  inproces: {
    type: Boolean,
    default: false
  },
  numberOfRetried: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["retry", "done", "error"],
    default: "retry"
  }
},{ timestamps: true});

export default mongoose.model("OrderCreateEventLog", OCELog);