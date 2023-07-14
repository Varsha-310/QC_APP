import plan from "../models/plan.js";
import {
  respondInternalServerError,
  respondSuccess,
  respondWithData,
} from "../helper/response.js";
import store from "../models/store.js";

/**
 * to fetch list of plans
 */
export const planListing = async (req, res) => {
  try {
    let planData = await plan.find({});
    let planSelected = await store.findOne({ store_url: req.token.store_url });
    res.json({
      ...respondWithData("plan list is fetched successfully"),
      data: { plans: planData, selectedPlan: planSelected.plan.plan_name },
    });
  } catch (error) {
    console.log(error);
    res.json(respondInternalServerError());
  }
};

/**
 * methos to select/update plan
 * @param {*} req
 * @param {*} res
 */
export const planSelect = async (req, res) => {
  try {
    let planName = req.body.plan_name;
    let updatePlan = await store.updateOne(
      { store_url: req.token.store_url },
      { $set: { "plan.plan_name": planName } }
    );
    console.log("-------------updatedplan-----------", updatePlan);
    res.json(respondSuccess("plan updated"));
  } catch (error) {
    console.log(error);
    res.json(respondInternalServerError());
  }
};
