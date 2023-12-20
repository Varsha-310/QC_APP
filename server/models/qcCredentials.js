import mongoose from "mongoose";
import CryptoJS from "crypto-js";

/*Scheme for storing qc_credentials */
const qc_credentials = mongoose.Schema({
  store_url: String,
  shopify_id: String,
  username: String,
  password: String,
  terminal_id: String,
  date_at_client: String,
  giftcard_cpgn: String,
  refund_cpgn: String,
  wpgn: String,
  unique_transaction_id: { type: Number, default: 0 },
  token: String,
  oracle_id: String,
});



export default mongoose.model("qc_credentials", qc_credentials);
