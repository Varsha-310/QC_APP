import { Router } from "express";
import {getStoresData} from "../controllers/storeController";
import { validategetStoresDataApi} from "../helper/validator";

const storeRoute = Router();

// Route to fetch the store data
storeRoute.get("/getStoreData",validategetStoresDataApi, getStoresData);

export default storeRoute;
