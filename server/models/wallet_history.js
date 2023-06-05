const mongoose = require("mongoose");

/*Scheme for storing wallet details */

const walletHistorySchema = mongoose.Schema({
  transaction_type: { type: String },
  amount: { type: Number },
  qc_giftcard: { type: String },
  walletid: { type: String },
  logs: {},
});

export default mongoose.model("Wallethistory", walletHistorySchema);
