import { respondError, respondSuccess, respondInternalServerError } from "../helper/response";
import { logger } from "../helper/utility";
import refundSetting from "../models/refundSetting"
import orders from "../models/orders"

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
    const { store_url, id, prepaid, COD, GiftCard, giftcard_cash, restock_type } = req.body;
    let location_id;
    if (restock_type === 'return') {
      const order = await orders.findOne({ id: id }); 
      location_id = order.location_id
      if (!location_id) {
        return res.json(respondError("Location id is required to create a refund"));
      }
    }
    const updateFields = {
      prepaid:prepaid,
      COD:COD,
      GiftCard:GiftCard,
      giftcard_cash:giftcard_cash,
      restock_type: restock_type
    };
    if (location_id) {
      updateFields.location_id = location_id;
    }
    const updatedSettings = await refundSetting.findOneAndUpdate(
      { store_url: store_url },
      { $set: updateFields },
      { upsert: true }
    );
    res.json(respondSuccess(updatedSettings));

  } catch (err) {
    logger.info(err);
    console.log(err);
    res.json(respondInternalServerError());
  }
};


