import {Router,Request,Response} from "express"
import questionValidator from "../validators/question"
import authMiddleware from "../middlewares/auth"
import prisma from "../db/db"
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, 
});

const questionRouter = Router()


questionRouter.use(authMiddleware)


questionRouter.post("/",async(req:Request,res:Response)=>{
    const questionObj = req.body
    if(!questionValidator.safeParse(questionObj)){
        return res.status(404).json({
            "error":"Incorrect req body sent"
        })
    }
    try{
        //move this a different api(microservice) use a message broker
        const result = await anthropic.completions.create({
    model: 'claude-2',
    max_tokens_to_sample: 300,
    prompt: `${Anthropic.HUMAN_PROMPT} ${questionObj.question} ${Anthropic.AI_PROMPT}`,
  });
    const answer = result.completion
     await prisma.questions.create({
        data:{
            question:questionObj.question,
            answer:answer,
            userid:res.locals.userid
        }
     })
     return res.status(200).send("Answer Generated")
    }
    catch{
        return res.send("Error occured")
    }
})


questionRouter.get("/:questionid",async(req:Request,res:Response)=>{
    try{
    const questionid = req.params.questionid
    const question = await prisma.questions.findUnique({
        where:{
            id:+questionid,
            userid:res.locals.userid
        }
    })
    return res.status(200).json(question)
    }
    catch{
        return res.status(500).send("Internal Server Error")
    }
})


questionRouter.get("/",async(req:Request,res:Response)=>{
    try{
        const questions = await prisma.questions.findMany({
            where:{
                userid:res.locals.userid
            }
        })
        return res.status(200).json(questions)
    }
    catch{
        return res.status(500).send("Internal Server Error")
    }
})


questionRouter.get("/user/:userid",async(req:Request,res:Response)=>{
    try{
        const userid = req.params.userid
        const questions = await prisma.questions.findMany({
            where:{
                userid:+userid
            }
        })
        return res.status(200).json(questions)
    }
    catch{
        return res.status(500).send("Internal Server Error")
    }
})

export default questionRouter