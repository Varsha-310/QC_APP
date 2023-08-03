import mongoose from "mongoose";

const billingHistorySchema = {
  
  id: String,
  store_id: { type: String },    
  store_url: { type: String },
  given_credit: { type: String }, // 20k
  used_credit: { type: String },  // 22k
  extra_usage: { type: String },  // 2k
  montly_charge: { type: String }, 
  monthly_gst: String,
  extra_usage_gst: String,
  usage_charge: { type: String }, 
  additional_amount: { type: String },
  total_amount: { type: String }, // 
  remiderDate: Date,
  isReminded: Boolean,
  InvoiceUserId: String, 
  planName: { type: String },
  status: { type: String, enum: ["ACTIVE", "CANCELLED","DECLINED","EXPIRED","FROZEN","PENDING", "BILLED"], default: "ACTIVE" }, 
  lastBilledDate: Date,
  planEndDate: Date,
  cappedAmount: String, // 120k
  invoiceNumber: String,
  invoiceAmount: String,
  invalideDate: String,
  invoiceUrl: String,
  transactions: {}
};

export default mongoose.model("BillingHistory", billingHistorySchema);