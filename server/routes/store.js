import { Router } from "express";
import {getStoresData} from "../controllers/storeController";
import { validategetStoresDataApi} from "../helper/validator";
import {verifyJwt , createJwt} from "../helper/jwtHelper"

const storeRoute = Router();

// Route to fetch the store data
storeRoute.get("/getStoreData",verifyJwt,validategetStoresDataApi, getStoresData);

export default storeRoute;
