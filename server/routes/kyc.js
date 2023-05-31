import { Router } from 'express';
import {initiatieKyc} from '../controllers/kycController';

const kycRoute = Router();

kycRoute.post('/initiate',verifyJwt , initiatieKyc);

kycRoute.post("/dispatch", verifyJwt ,dispatchTransaction);

// kycRoute.post("/dispatch", verifyJwt ,dispatchTransaction);

export default kycRoute;