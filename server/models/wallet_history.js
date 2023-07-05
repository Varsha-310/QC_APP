import mongoose from "mongoose";
/*Scheme for storing wallet details */

const walletHistorySchema = mongoose.Schema({
  walletid: { type: String },

  transactions :[{transaction_type: { type: String },
  amount: { type: Number },
  qc_giftcard: { type: Object}}],
  logs: []
});

export default mongoose.model("Wallethistory", walletHistorySchema);
