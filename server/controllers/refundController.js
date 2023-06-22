import { respondError, respondSuccess, respondInternalServerError } from "../helper/response";
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
    let { store_url } = req.body;
    const settings = await refundSetting.findOne({ store_url: store_url });
    if (!settings) {
      return res.json(respondError());
    }
    res.json(respondSuccess(settings));
  } catch (err) {
    console.log(err);
    logger.info(err);
    res.json(
      respondInternalServerError()
    );
  }
};



export const updateConfigapi = async (req, res) => {
  try {
    const { store_url, prepaid, COD, GiftCard, giftcard_cash, restock_type, location_id } = req.body;

    if (restock_type === 'no_restock') {
        res.json(respondError("You have selected restock_type to no_restock. Need for location id"));
    }
    else if (restock_type === 'return') {
      if (!location_id) {
         res.json(respondError("Location id is required to create a refund"));
  
      }
    }
    const updatedSettings = await refundSetting.findOneAndUpdate(
      { store_url: store_url },
      { $set: { prepaid: prepaid, COD: COD, GiftCard: GiftCard, giftcard_cash: giftcard_cash, restock_type: restock_type } },
      { upsert: true }
    );
    res.json(respondSuccess(updatedSettings));

  } catch (err) {
    logger.info(err);
    res.json(respondInternalServerError());
  }
};