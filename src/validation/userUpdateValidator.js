import {z} from "zod"

const updateBody = z.object({
    password: z.string().min(8).optional(),
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional()
})

export default updateBody