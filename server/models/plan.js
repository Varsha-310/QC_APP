const mongoose = require("mongoose");

/*Scheme for storing wallet details */

var planSchema = mongoose.Schema({
  plan_name: { type: String },
  plan_details: [{}],
});

export default mongoose.model("plan", planSchema);
