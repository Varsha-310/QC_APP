const Router = require();

const gdprRoute = Router();

gdprRoute.post('/customer/data', getUserDetails);

gdprRoute.post('/customer/delete', deleteUserData);

gdprRoute.post('/store/delete', deleteStoreData);

export default gdprRoute;