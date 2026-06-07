import {z} from "zod"

const signInBody = z.object({
    username: z.string().email(),
    password: z.string().min(8)
})

export default signInBody