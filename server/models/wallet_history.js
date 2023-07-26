import mongoose from "mongoose";
/*Scheme for storing wallet details */

const walletHistorySchema = mongoose.Schema({
  
  wallet_id: { type: String },
  total_balance: { type: Number , default : 0 },
  customer_id: { type: String },
  transactions: [
    {
      transaction_type: { type: String, enum: ["credit", "debit"] },
      amount: { type: Number },
      gc_pin: String,
      expires_at: Date,
      transaction_date: Date,
    },
  ],
  logs: [],
});
export default mongoose.model("Wallethistory", walletHistorySchema);
