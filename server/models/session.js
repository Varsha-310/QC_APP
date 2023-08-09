import mongoose from "mongoose";
import { paymentStatus } from "./Transactions";

const sessionStatus = [ "initiated", "completed", "rejected", "processing", "retry", "failed"];
const SessionSchema = mongoose.Schema({

  seesion_id: { type: String },
  status: {
    type: String,
    enum: sessionStatus,
    default: "initiated",
  },
  remark: { type: String, default: null },
  amount: { type: Number, default: 0 },
  currency: { type: String, default: null },
  plan: { type: Object, default: null },
  store_url: { type: String, default: null },
  test: { type: Boolean, default: false },
  first_name: String,
  last_name: String,
  phone: String,
  callback_status: {
    type: String,
    enum: paymentStatus,
    default: "pending",
  },
  type: {
    type: String,
    enum: ["MANDATE", "PAYMENT", "PRE-DEBIT-NOTIFICATION", "RECURRING"],
    default: "MANDATE"
  },
  callback_at: { type: Boolean, default: false },
  retry_at: { type: Date, default: null },
  expired_at: { type: Date, default: null },
  no_of_retried: { type: Number, default: 0 },
  transaction_id: { type: String },
},{ timestamps: true, __v: false  });

export default mongoose.model("Session", SessionSchema);

