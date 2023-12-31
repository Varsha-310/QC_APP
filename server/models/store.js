import mongoose from "mongoose";

/*Scheme for storing store details */
let storeSchema = mongoose.Schema({
  store_url: { type: String },
  installed_at: { type: Date },
  access_token: { type: String },
  status: {
    type: String,
    enum: [
      "INSTALLED",
      "KYC_INITIATED",
      "KYC_COMPLETED",
      "PLAN_SELECTED",
      "PAYMENT_DONE",
    ],
    default: "INSTALLED",
  },
  shopify_id: { type: Number },
  name: { type: String },
  email: { type: String },
  phone: { type: Number },
  plan: {
    plan_name: { type: String },
    usage_limit: { type: Number },
    usage_charge: { type: String },
    plan_limit: { type: Number },
    price: { type: Number }
  },
  InvoiceUserId: String, // Marchent user id that us used for generate invoice by qc.
  is_installed: { type: Boolean, default: false },
  is_kyc_done: { type: Boolean, default: false },
  is_plan_done: { type: Boolean, default: false },
  is_payment_done: { type: Boolean, default: false },
  dashboard_activated: { type: Boolean , default : false},
  //To store the mandate Details
  mandate: Object,
  auth_token: {type:String},
  currency: String,
  myshopify_domain: String,
  domain: String
});

export default mongoose.model("Store", storeSchema);
