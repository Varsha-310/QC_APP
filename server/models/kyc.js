import mongoose from "mongoose";

/*Scheme for storing user details */

var kycSchema = mongoose.Schema({
  store_url: { type: String },
  merchant_data: [
    {
      transaction_id : {type: String},
      merchant_created_at : {type : Date},
      merchant_name : {type: String},
      outlet : {type: String},
      gstin : {type: String},
      address_line1 : {type: String},
      address_line2 : {type: String},
      area : {type: String},
      city : {type: String},
      state : {type: String},
      pincode : {type : Number},
      first_name: { type: String },
      last_name: { type: String },
      email: { type: String },
      phone: { type: Number },
      
    },
  ],
  kyc_response: [
    {
      transaction_id: { type: String },
      template_id: { type: String },
      doctype_id: { type: String },
      status: { type: String },
    },
  ],
});

export default mongoose.model("kyc", kycSchema);
