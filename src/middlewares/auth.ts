import { NextFunction,Request,Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"


async function authMiddleware(req:Request,res:Response,next:NextFunction){
     const authHeader = req.headers.authorization;
    if (!authHeader)
    return res.status(403).send("Authorization Token missing");
    else{
    const token = authHeader.split(" ")[1];
    const isVaild = jwt.verify(token,process.env.SECRET_KEY_ACCESS||"") as JwtPayload;
    if(isVaild){
        res.locals.userid = isVaild.user
        next();
    }
    
    else
    return res.send("Incorrect/Expired auth token");
    }
}

export default authMiddleware;