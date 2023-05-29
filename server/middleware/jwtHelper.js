import { Jwt } from "jsonwebtoken"
import { respondUnauthorized } from "../helper/response"

//Generate a JWT Token, provided a payload
export const  generateToken = payload => {
    return new Promise((resolve, reject) => {
        resolve(Jwt.sign(payload, process.env.TOKEN_SECRET,{ expiresIn: '24h' }))
    })
}

//For Authenticated endpoints, valiadate the token present in headers. if invalid or expired, redirect the user to login page 
export const validateToken = (req, res, next) => {
    if(req.headers.authorization){
        Jwt.verify(req.headers.authorization, process.env.TOKEN_SECRET, function (err, payload) {
            if(!err){
                req.token = payload;
                next();
            }else{
                res.json(respondUnauthorized("Invalid or Expired JWT detected. Please register a new token"));

            }
        });
    }else{
        res.json(respondUnauthorized("Invalid or Expired JWT detected. Please register a new token"));
    }
}
