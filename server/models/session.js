import mongoose from "mongoose";

const SessionSchema = mongoose.Schema({
  gid: { type: String, default: null },
  request_id: { type: String },
  status: {
    type: String,
    enum: [
      "initiated",
      "completed",
      "rejected",
      "processed",
      "retry",
      "failed",
    ],
    default: "processed",
  },
  request_type: {
    type: String,
    enum: ["payment", "refund"],
    default: "payment",
  },
  remark: { type: String, default: null },
  amount: { type: Number, default: 0 },
  currency: { type: String, default: null },
  address: { type: Schema.Types.Mixed, default: null },
  contact: { type: String, default: null },
  email: { type: String, default: null },
  country_code: { type: String, default: null },
  store_url: { type: String, default: null },
  group: { type: String, default: null },
  kind: { type: String, default: null },
  test: { type: Boolean, default: false },
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
  callback_recieved: { type: Boolean, default: false },
  cancel_url: { type: String, default: false },
  updatedToShopify: { type: Date, default: null },
  retry_at: { type: Date, default: null },
  expired_at: { type: Date, default: null },
  no_of_retried: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  store: { type: Schema.Types.ObjectId, ref: "Store" },
  transaction: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
  refund: { type: Schema.Types.ObjectId, ref: "Refund" },
});

const SessionModel = mongoose.model("Session", SessionSchema);

module.exports = SessionModel;
