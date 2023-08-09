import mongoose from "mongoose";

const billingHistorySchema = {
  
  id: String,
  store_id: { type: String },    
  store_url: { type: String },
  given_credit: { type: String }, 
  used_credit: { type: String }, 
  extra_usage: { type: String },  
  montly_charge: { type: String, default: 0},
  monthly_gst: {type: String, default: 0}, 
  extra_usage_gst:{ type:String, default: 0},
  usage_charge: { type: String, default: 0 }, 
  extra_usage_amount: { type: String,  default: 0},
  total_amount: { type: String },
  issue_date: { type: Date },
  notifiedMerchant: {
    type: String,
    enum : [0,1,2,3],
    default:0
  },
  remiderDate: Date,
  isReminded: Boolean,
  oracleUserId: String, 
  planName: { type: String },
  status: { type: String, enum: ["ACTIVE","CANCELLED","UPGRADED","EXPIRED","FROZEN","PENDING","BILLED"], default: "PENDING" }, 
  billingDate: Date,
  planEndDate: Date,
  usage_limit: String, // 120k
  invoiceNumber: String,
  invoiceAmount: String,
  invoiceDate: String,
  invoiceUrl: String,
  transaction_id: String,
  remark: String
};

export default mongoose.model("BillingHistory", billingHistorySchema);