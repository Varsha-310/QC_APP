import mongoose from "mongoose";

const billingHistorySchema = {
  
  id: String,
  store_id: { type: String },    
  store_url: { type: String },
  given_credit: { type: String },
  used_credit: { type: String },
  extra_uasge: { type: String },
  montly_charge: { type: String },
  usage_charge: { type: String },
  additional_amount: { type: String },
  total_amount: { type: String },
  remiderDate: Date,
  isReminded: Boolean,
  planName: { type: String },
  status: { type: String, enum: ["ACTIVE", "CANCELLED","DECLINED","EXPIRED","FROZEN","PENDING", "BILLED"], default: "ACTIVE" }, 
  lastBilledDate: Date,
  planEndDate: Date,
  cappedAmount: String,
  invoiceNumber: String,
  invoiceAmount: String,
  invalideDate: String,
  invoiceUrl: String,
  transactions: {}
};

export default mongoose.model("BillingHistory", billingHistorySchema);