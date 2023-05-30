import { Router } from 'express';

const kycRoute = Router();

kycRoute.post('/initiate',verifyJwt , initiatieKyc);

kycRoute.post("/dispatch", verifyJwt ,dispatchTransaction);

// kycRoute.post("/dispatch", verifyJwt ,dispatchTransaction);


export default kycRoute;