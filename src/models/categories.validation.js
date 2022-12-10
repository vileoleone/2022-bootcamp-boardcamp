import joi from "joi";

export const categoriePostSchemaValidation = joi.object({
    name: joi.string().required().min(3).max(15).trim()
})