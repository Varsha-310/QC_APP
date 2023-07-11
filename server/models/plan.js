import mongoose from "mongoose";

/*Scheme for storing plan details */

const planSchema = mongoose.Schema({
  plan_name: { type: String },
  uses_limit: {type : Number},
  uses_charge: {type: String},
  plan_limit: {type: Number},
  price: {type:Number},
  symbol: {type:String},
  currency: {typ:String}
});

export default mongoose.model("Plan", planSchema);
