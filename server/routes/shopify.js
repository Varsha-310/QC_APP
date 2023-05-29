import { Router } from 'express';
import { install, installCallback, testapi } from '../controllers/shopifyController';

const shopifyRoute = Router();

// Route of app installation
shopifyRoute.get('/install', install);

// Route of app installation callback
shopifyRoute.get('/callback', installCallback);

shopifyRoute.get('/test', testapi);

export default shopifyRoute;
