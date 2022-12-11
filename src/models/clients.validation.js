import joi from "joi"

export const customerSchemaValidation = joi.object({
    name: joi.string().required().min(3).trim(),
    phone: joi.string().required().min(10).max(11).trim(),
    cpf: joi.string().required().length(11).trim(),
    birthday: joi.date().required().raw()
})