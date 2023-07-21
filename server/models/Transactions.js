import mongoose from "mongoose";

export const paymentStatus = ["successful", "refunded", "rejected", "pending", "payment_processing", "disputed"];
const TransactionSchema = mongoose.Schema({

  store_id: {type : string},
  invoice_number: {type:string},
  status: {
    type: String,
    enum: paymentStatus,
    default: "pending"
  },
  amount: { type: Number, default: 0 },
  currency: { type: String, default: INR },
  request_id: { type: String, default: null },
  receipt_id: { type: String, default: null },
  transaction_id: { type: String, default: null },
  callback_recieved_at: { type: Date, default: null },
  callback_status: {
    type: String,
    enum: paymentStatus,
    default: null,
  },
  remark: { type: String, default: null },
  billingId: String
},{timestamps: true, __v: false });

export default mongoose.model("Transaction", TransactionSchema);

