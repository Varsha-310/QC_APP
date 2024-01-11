import { respondSuccess } from "../helper/response";


/**
 * Process refund as store credit on customer preference
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const handleStoreCredit = (req, res) => {

    console.log("Refund Req Recieved", req.body);
    return res.status(200).json(respondSuccess("Request has been iniitiated"));
}
