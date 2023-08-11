import mongoose from "mongoose";

/*Scheme for storing user details */

var kycSchema = mongoose.Schema({
  store_url: { type: String },
  merchant_data: [
    {
      transaction_id : {type: String, default : null},
      merchant_created_at : {type : Date,default : null,default : null},
      merchant_name : {type: String,default : null},
      outlet : {type: String,default : null},
      gstin : {type: String,default : null},
      address_line1 : {type: String,default : null},
      address_line2 : {type: String,default : null},
      area : {type: String,default : null},
      city : {type: String,default : null},
      state : {type: String,default : null},
      pincode : {type : Number,default : null},
      contact_first_name: { type: String ,default : null},
      contact_last_name: { type: String ,default : null},
      email: { type: String ,default : null},
      phone: { type: Number ,default : null},
      PAN:{type: String,default : null},
      package_details: {type:String,default : null},
      card_quantity: {type:String,default : null},
      reload_enabled : {type:Boolean,default : false},
      subscription_payment : {type:Boolean,default : false}
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