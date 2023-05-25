import Router from ('express');
import {install , installCallback} from '../controllers/shopifyController'

const Route = Router();

// Route of app installation
Route.get('/install', install);

// Route of app installation callback
Route.get('/callback', installCallback);

module.exports = router;
