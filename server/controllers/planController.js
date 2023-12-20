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
    let planData = await plan.find();  
 let planSelected = await store.findOne({ store_url: req.token.store_url });
console.log(planData,planSelected)
if(planSelected.plan != null){
    res.json({
      ...respondWithData("plan list is fetched successfully"),
      data: { plans: planData, selectedPlan: planSelected.plan.plan_name },
    });
}
else{
 res.json({
      ...respondWithData("plan list is fetched successfully"),
      data: { plans: planData },
    });
}
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
    let { plan_name }= req.body;
    let updatePlan = await store.updateOne(
      { store_url: req.token.store_url },
      { $set: { "plan.plan_name": plan_name  } }
    );
    console.log("-------------updatedplan-----------", updatePlan);
    res.json(respondSuccess("plan updated"));
  } catch (error) {
    console.log(error);
    res.json(respondInternalServerError());
  }
};
