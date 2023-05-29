import { respondSuccess } from "../helper/response";
import store from '../models/store';



export const ordercraeted = (req,res) => {
    const {domain} = req.body;
    let appData = store.findOneAndUpdate({store_url :domain }, {isInstalled : false});
    res.json(respondSuccess("webhook received"));
}



export const orderupdated = (req,res) => {
    const {domain} = req.body;
    let appData = store.findOneAndUpdate({store_url :domain }, {isInstalled : false});
    res.json(respondSuccess("webhook received"));
}


export const orderdeleted = (req,res) => {
    const {domain} = req.body;
    let appData = store.findOneAndUpdate({store_url :domain }, {isInstalled : false});
    res.json(respondSuccess("webhook received"));
}