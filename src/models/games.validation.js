import joi from "joi"

export const gamePostSchemaValidation = joi.object({
    name: joi.string().required().min(3).trim(),
    image: joi.string().required().trim(),
    stockTotal: joi.number().greater(0).required(), 
    categoryId: joi.number().required(),
    pricePerDay: joi.number().greater(0).required()
})