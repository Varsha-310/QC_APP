import mongoose from "mongoose";

/*Scheme for storing billing history*/
const billingHistorySchema = mongoose.Schema({
  
  id: String,
  store_id: { type: String },    
  store_url: { type: String },
  given_credit: { type: Number, default: 0}, 
  used_credit: { type: Number, default: 0 },
  upfront_amount: { type: Number, default:0}, 
  extra_usage: { type: Number,  default: 0 },  
  montly_charge: { type: Number, default: 0},
  monthly_gst: {type: Number, default: 0}, 
  extra_usage_gst:{ type:Number, default: 0},
  usage_charge: { type: Number, default: 0 }, 
  extra_usage_amount: { type: Number,  default: 0},
  total_amount: { type: Number,  default: 0 },
  issue_date: { type: Date },
  marchant_name: { type: String},
  plan_type: String,
  notifiedMerchant: {
    type: String,
    enum : [0,1,2,3],
    default:0
  },
  recordType: {
    type: String, 
    enum: ["New","Reccuring","Upgraded"], 
    default: "New"
  },
  remiderDate: Date,
  prevData: {
    type:Array,
    default: null
  },
  isReminded: { type: Boolean, default: false},
  oracleUserId: String, 
  planName: { type: String },
  status: { type: String, enum: ["ACTIVE","CANCELLED","UPGRADED","EXPIRED","FROZEN","PENDING","BILLED"], default: "PENDING" }, 
  billingDate: Date,
  planEndDate: Date,
  usage_limit: Number, // 120k
  invoiceNumber: String,
  invoiceAmount: { type:Number, default:0},
  invoiceDate: String,
  invoiceUrl: String,
  transaction_id: String,
  remark: String
});

export default mongoose.model("BillingHistory", billingHistorySchema);