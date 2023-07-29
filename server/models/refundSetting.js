import mongoose from "mongoose";
const Schema = mongoose.Schema;

/*Scheme for storing refundSetting */
const refundSettingSchema = new Schema({
    store_url: {
      type: String,
      required: true,
    },
    prepaid: {
      type: String,
      enum: ['Back-to-Source', 'Store-credit'],
      default: 'Store-credit',
    },
    cod: {
      type: String,
      enum: ['Back-to-Source', 'Store-credit'],
      default: 'Store-credit',
    },
    giftCard: {
      type: String,
      enum: ['Back-to-Source', 'Store-credit'],
      default: 'Store-credit',
    },
    giftcard_cash: {
      type: String,
      enum: ['Back-to-Source', 'Store-credit'],
      default: 'Store-credit',
    },
    restock_type:{
      type: String,
      enum:['return','no_restock'],
      default: 'no_restock'
    },
    location_id:{ type: Number }
});
export default mongoose.model("refundSetting", refundSettingSchema);
