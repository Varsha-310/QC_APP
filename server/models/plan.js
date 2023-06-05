import mongoose from "mongoose";

/*Scheme for storing wallet details */

const planSchema = mongoose.Schema({
  plan_name: { type: String },
  uses_limit: {type : Number},
  uses_charge: {type: String},
  plan_limit: {type: String},
  price: {type:Number},
  symbol: {type:String},
  currency: {typ:String}
});

export default mongoose.model("Plan", planSchema);
