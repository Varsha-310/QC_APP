import { respondError, respondWithData, respondInternalServerError } from "../helper/response";
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
    let { store_url } = req.token;
    const settings = await refundSetting.findOne({ store_url });

    if (!settings) {
      return res.json(respondError("Invalid store_url", 404));
    }
    res.json(respondWithData("Success", 200, settings));
  } catch (err) {
    console.log(err);
    logger.info(err);
    res.json(
      respondInternalServerError()
    );
  }
};

/**
 * To handle refund update settings 
 * @param {*} req
 * @param {*} res
 */

export const updateConfigapi = async (req, res) => {
  try {
    const { store_url } = req.token;
    const { prepaid, cod, giftCard, giftcard_cash, restock_type, location_id } = req.body;
    if (restock_type === 'return') {
      if (!location_id) {
        return res.json(respondError("Location id is required to create a refund", 404));
      }
    }
    const updatedSettings = await refundSetting.findOneAndUpdate(
      { store_url },
      {
        $set: {
          prepaid,
          cod,
          giftCard,
          giftcard_cash,
          restock_type,
          location_id,
        },
      },
      { upsert: true }
    );
    res.json(respondWithData("updated successfully", 200, updatedSettings));
  } catch (err) {
    console.error(err)
    res.json(respondInternalServerError());

  }
};


