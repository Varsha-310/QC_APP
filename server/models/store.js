import mongoose from "mongoose";

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
  },
  shopify_id: { type: Number },
  name: { type: String },
  email: { type: String },
  phone: { type: Number },
  plan: {
    plan_name: String,
    expires_at: Date,
    created_at: Date,
    updated_at: Date,
  },

  is_kyc_done: { type: Boolean, default: false },
  is_plan_done: { type: Boolean, default: false },
  is_payment_done: { type: Boolean, default: false },
});

export default mongoose.model("Store", storeSchema);
