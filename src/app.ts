import express from "express"
import dotenv from "dotenv"

if (process.env.NODE_ENV == 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config({ path: '.env' });
}

import userRouter from "./routes/user"
import questionRouter from "./routes/question"


const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth",userRouter)
app.use("/api/questions",questionRouter)


app.get("",(req:express.Request,res:express.Response)=>{
    res.status(200).send("Test")
})

export default app




