import { respondInternalServerError } from "../helper/response";
import { logger } from "../helper/utility";
import refundSetting from "../models/refundSetting"

/**
 * To handle refund settings
 * @param {*} req
 * @param {*} res
 */

// Function to handle the refund
export const getConfigapi = async (req, res) => {
  try {
    let {store_url} = req.body; 
    const settings = await refundSetting.findOne({ store_url:store_url});
    if (!settings) {
      return res.json({
        success: false,
        message: "Invalid or wrong URL entered",
      });
    }
    res.json(settings);
  } catch (err) {
    console.log(err);
    logger.info(err);
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};

export const updateConfigapi = async (req, res) => {
  try {
    const { store_url, prepaid, COD, GiftCard, giftcard_cash } = req.body;
    const updatedSettings = await refundSetting.findOneAndUpdate(
      { store_url: store_url },
      { $set: { prepaid: prepaid, COD:COD, GiftCard: GiftCard, giftcard_cash:giftcard_cash }},
      { upsert: true }
    );
    res.json(updatedSettings);
    
  } catch (err) {
    logger.info(err);
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};









