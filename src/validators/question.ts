import {z} from "zod"

const questionValidator = z.object({
   question:z.string()
})

export default questionValidator
