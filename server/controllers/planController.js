import plan from "../models/plan";
import {
  respondInternalServerError,
  respondWithData,
} from "../helper/response";

/**
 * to fetch list of plans
 */
export const planListing = async (req, res) => {
  try {
    let planData = await plan.find();
    res.json({
      ...respondWithData("plan list is fetched successfully"),
      data: planData,
    });
  } catch (error) {
    console.log(error);
    res.json(respondInternalServerError());
  }
};
