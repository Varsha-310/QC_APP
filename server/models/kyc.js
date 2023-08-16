import mongoose from "mongoose";

/*Scheme for storing user details */

var kycSchema = mongoose.Schema({
  store_url: { type: String },
  shopify_id: { type: String },
  status:{type:String, default : "INITIATED"},
  transaction_id: { type: String },
  merchant_created_at: { type: Date, default: null },
  merchant_name: { type: String, default: null },
  outlet: { type: String, default: null },
  gstin_number: { type: String, default: null },


  PAN: { type: String, default: null },
  Pan_name: { type: String, default: null },
  name_of_firm: {type: String},
  type_of_organization: {type: String},
  category: {type:String},
  cin_number: {type:String},
  cin_name: {type:String},
  gstin: { type: String, default: null },
  gstin_name: { type: String, default: null },
  gstin_state: { type: String, default: null },
  merchant_created_at: { type: Date, default: null },
  merchant_name: { type: String, default: null },
  outlet: { type: String, default: null },
  address_line1: { type: String, default: null },
  address_line2: { type: String, default: null },
  area: { type: String, default: null },
  city: { type: String, default: null },
  state: { type: String, default: null },
  pincode: { type: Number, default: null },
  contact_first_name: { type: String, default: null },
  contact_last_name: { type: String, default: null },
  email: { type: String, default: null },
  phone: { type: Number, default: null },
  package_details: { type: String, default: null },
  subscription_payment: { type: Boolean, default: false },
  cin_number: { type: String, default: null },
  payu_txn_id:  { type: String, default: null },
  payu_mihpayid: { type: String, default: null }
});

export default mongoose.model("kyc", kycSchema);
