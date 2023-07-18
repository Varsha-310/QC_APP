import mongoose from "mongoose";

/*Scheme for storing plan details */

const planSchema = mongoose.Schema({
  plan_name: { type: String },
  usage_limit: {type : Number},
  usage_charge: {type: String},
  plan_limit: {type: Number},
  price: {type:Number},
  symbol: {type:String},
  currency: {type:String}
});

export default mongoose.model("Plan", planSchema);
