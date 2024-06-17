import {Router,Request,Response} from "express"
import prisma from "../db/db"
import bcrypt from "bcrypt"

import jwt, { JwtPayload } from "jsonwebtoken"

import {validators} from "../validators/user"



const userRouter = Router()
const saltRounds = 10;

userRouter.post("/signup",async (req:Request,res:Response)=>{

    const userObj =  req.body
    if (!validators.userSignup.safeParse(userObj)){
        return res.status(404).json({"error":"Improper request body sent"})
    }
    try{
    const hashedPassword = await bcrypt.hash(userObj.password,saltRounds)
    const user = await prisma.user.create({
        data:{
            username:userObj.username,
            password:hashedPassword,
            email:userObj.email,
            age:userObj.age
        }
    })
    return res.status(201).send("User created successfully")
}
catch(err){
    return res.status(500).send(`Server Error ${err}`)
}
})


userRouter.post("/login",async(req:Request,res:Response)=>{
    const userObj = req.body
    try{
    if (!validators.userLogin.safeParse(userObj)){
        return res.status(404).json({"error":"Improper request body sent"})
    }
    const user = await prisma.user.findUnique({where:{
        username:userObj.username
    }})
    if (!user){
        res.status(401).send("Incorrect Credentials")
    }
    else{
        if(user.username == userObj.username && await bcrypt.compare(userObj.password,user.password)){
            console.log(user.id.toString())
            const refreshtoken = jwt.sign({user:user.id},process.env.SECRET_KEY_REFRESH||"",{expiresIn:"24h"})
            const accesstoken = jwt.sign({user:user.id},process.env.SECRET_KEY_ACCESS||"",{expiresIn:"1hr"})
            return res.status(200).json({
                "access":accesstoken,
                "refresh":refreshtoken
            })
        }
        else{
            return res.status(404).send("Incorrect Credentials")
        }
    }
    }
    catch{
        return res.status(500).send("Internal Server Error")
    }
})

userRouter.post("/refresh",(req:Request,res:Response)=>{
    const token = req.body
    if(! validators.tokenValidator.safeParse(token)){
        return res.status(404).json({"error":"Improper request body sent"})
    }
    try{
        const isValid = jwt.verify(token.refreshtoken,process.env.SECRET_KEY_REFRESH||"") as JwtPayload
        if(!isValid){
            return res.status(401).json({"error":"Token Expired"})
        }
        const accesstoken = jwt.sign({user:isValid.user},process.env.SECRET_KEY_ACCESS||"")
        return res.status(200).json({"accesstoken":accesstoken})
    }
    catch{
        return res.status(500).json({
            "error":"Internal Server Error"
        })
    }
})

export default userRouter