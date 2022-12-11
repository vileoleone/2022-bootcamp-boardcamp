import { connectionSQL } from "../database/database.js";
import { customerSchemaValidation } from "../models/clients.validation.js";



export function customersBodySchemaValidation(req, res, next) {

    const customer = req.body

    const { error } = customerSchemaValidation.validate(customer, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).send(`schema error : ${errors}`);
    }

    res.locals.customer = customer

    next();
}

export async function customersBodySQLValidation(req, res, next) {3.
    const { cpf } = res.locals.customer

    try {

        const customerCpfValidation = await connectionSQL.query(`SELECT * FROM customers WHERE cpf = $1`, [cpf]);
        
        if (customerCpfValidation.rows.length > 0) {
            res.status(409).send("the cpf is already registered in the database")
            return
        }

    } catch (error) {
        res.status(500).send(error.message)
        return
    }
    
    next()
}