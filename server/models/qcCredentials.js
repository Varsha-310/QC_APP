import mongoose from "mongoose";

/*Scheme for storing qc_credentials */
const qc_credentials = mongoose.Schema({
  store_url: String,
  username: String,
  password: String,
  terminal_id: String,
  date_at_client: String,
  giftcard_cpgn: String,
  refund_cpgn: String,
  wpgn: String,
  unique_transaction_id: Number
});

export default mongoose.model("qc_credentials", qc_credentials);
