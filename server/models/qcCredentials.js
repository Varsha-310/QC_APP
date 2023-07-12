import mongoose from "mongoose";

const qc_credentials = mongoose.Schema({
  store_url: String,
  username: String,
  password: String,
  terminal_id: String,
  date_at_client: String,
  cpgn: String,
  unique_transaction_id: Number
});

export default mongoose.model("qc_credentials", qc_credentials);
