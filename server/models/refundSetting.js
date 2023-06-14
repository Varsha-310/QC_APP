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
      // default: 'Store-credit',
    },
    COD: {
      type: String,
      enum: ['Back-to-Source', 'Store-credit'],
      // default: 'Store-credit',
    },
    GiftCard: {
      type: String,
      enum: ['Back-to-Source', 'Store-credit'],
      // default: 'Store-credit',
    },
    giftcard_cash: {
      type: String,
      enum: ['Back-to-Source', 'Store-credit'],
      // default: 'Store-credit',
    },
});

export default mongoose.model("refundSetting", refundSettingSchema);
