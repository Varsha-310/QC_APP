import mongoose from "mongoose";

const TransactionSchema = mongoose.Schema({
  omni_ref: { type: String, default: null },
  status: {
    type: String,
    enum: [
      "successful",
      "refunded",
      "rejected",
      "pending",
      "payment_processing",
      "disputed",
    ],
    default: "pending",
  },
  amount: { type: Number, default: 0 },
  refund_amount: { type: Number, default: 0 },
  currency: { type: String, default: INR },
  request_id: { type: String, default: null },
  receipt_id: { type: String, default: null },
  mid: { type: String, default: null },
  transaction_id: { type: String, default: null },
  callback_recieved_at: { type: Date, default: null },
  callback_status: {
    type: String,
    enum: [
      "successful",
      "refunded",
      "rejected",
      "pending",
      "payment_processing",
      "disputed",
    ],
    default: null,
  },
  shopify_api_response: {
    type: String,
    enum: ["Resolved", "Rejected", "Error", "retry"],
    default: null,
  },
  shopify_return_url: { type: String, default: null },
  user_id: { type: String, default: null },
  remark: { type: String, default: null },
  refunded_at: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  refund: [{ type: Schema.Types.ObjectId, ref: "Refund" }],
  session: { type: Schema.Types.ObjectId, ref: "Session" },
});

const TransactionModel = mongoose.model("Transaction", TransactionSchema);

module.exports = TransactionModel;
