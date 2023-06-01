import { Router } from 'express';
import {initiatieKyc} from '../controllers/kycController';

const kycRoute = Router();

kycRoute.post('/initiate',verifyJwt , initiatieKyc);

export default kycRoute;