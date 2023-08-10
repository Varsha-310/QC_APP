import mongoose from "mongoose";

const billingHistorySchema = {
  
  id: String,
  store_id: { type: String },    
  store_url: { type: String },
  given_credit: { type: Number }, 
  used_credit: { type: Number }, 
  extra_usage: { type: Number },  
  montly_charge: { type: Number, default: 0},
  monthly_gst: {type: Number, default: 0}, 
  extra_usage_gst:{ type:Number, default: 0},
  usage_charge: { type: Number, default: 0 }, 
  extra_usage_amount: { type: Number,  default: 0},
  total_amount: { type: Number },
  issue_date: { type: Date },
  plan_type: String,
  notifiedMerchant: {
    type: String,
    enum : [0,1,2,3],
    default:0
  },
  recordType: {
    type: String, 
    enum: ["New","Reccuring"], 
    default: "New"
  },
  remiderDate: Date,
  isReminded: Boolean,
  oracleUserId: String, 
  planName: { type: String },
  status: { type: String, enum: ["ACTIVE","CANCELLED","UPGRADED","EXPIRED","FROZEN","PENDING","BILLED"], default: "PENDING" }, 
  billingDate: Date,
  planEndDate: Date,
  usage_limit: Number, // 120k
  invoiceNumber: String,
  invoiceAmount: Number,
  invoiceDate: String,
  invoiceUrl: String,
  transaction_id: String,
  remark: String
};

export default mongoose.model("BillingHistory", billingHistorySchema);