import mongoose from "mongoose";

const planHistorySchema = {
//   store_id: { type: String },
  store_url: { type: String },
  given_credit: { type: String },
  used_credit: { type: String },
  extra_uasge: { type: String },
  montly_charge: { type: String },
  usage_charge: { type: String },
  additional_amount: { type: String },
  total_amount: { type: String },
  payment: {},
};
