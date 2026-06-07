import {z} from "zod"

const signupBody = z.object({
    username: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(2),
    lastName: z.string().min(2)
})

export default signupBody;