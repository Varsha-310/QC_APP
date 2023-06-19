const { respondInternalServerError} = require('../helper/response')

export const createVoucher= () => {
    try{

    }
    catch(err){
        res.json(
            respondInternalServerError("Something went wrong try after sometime")
          );
    }
}