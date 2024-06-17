import {z} from "zod"

const userSignup = z.object({
    username : z.string().min(8),
    email : z.string().email().min(8),
    password : z.string().min(8),
    age :z.number()
})

const userLogin = z.object({
    username:z.string().min(8),
    password:z.string().min(8)
})

const tokenValidator = z.object({
    refreshtoken : z.string()
})

export const validators ={
    userSignup,
    userLogin,
    tokenValidator
}