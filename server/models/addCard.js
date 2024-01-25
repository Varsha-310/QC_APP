import mongoose from "mongoose";

/*Scheme for shopify giftcards */
const addCardSchema = mongoose.Schema({
    store: { type: String },
    customerId: Number,
    logs: Object
    
  },{ timestamps:true});

export default mongoose.model("addCard", addCardSchema);
