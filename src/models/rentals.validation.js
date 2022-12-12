import joi from "joi"

export const rentalsPostSchemaValidation = joi.object({
  customerId: joi.number().greater(0).required(),
  gameId: joi.number().greater(0).required(),
  daysRented: joi.number().greater(0).required()
})