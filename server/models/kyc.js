const mongoose = require("mongoose");

/*Scheme for storing user details */

var UserSchema = mongoose.Schema({
  store_url: { type: String },
  kyc_user_data: [
    {
      name: { type: String },
      email: { type: String },
      phone: { type: Number },
      organization: { type: String },
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

export default mongoose.model("User", userSchema);
