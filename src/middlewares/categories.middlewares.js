import { categoriePostSchemaValidation } from "../models/categories.validation.js";
import { connectionSQL } from "../database/database.js";
export function postBodySchemaValidation(req, res, next) {

    const  name  = req.body
    
    const { error } = categoriePostSchemaValidation.validate(name, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).send(`schema error : ${errors}`);
    }

    res.locals.name = name

    next();
}

export  async function postBodySQLValidation(req, res, next) {
    const { name } = res.locals.name

    try {

        const categories = await connectionSQL.query("SELECT * FROM categories");
        const validation = categories.rows.find((object) => object.name === name)
        console.log(categories.rows)
        if (validation) {
            res.status(409).send("there is already this category in the database")
            return
        }

    } catch (error) {
        console.log(error)
    }

    res.locals.name = req.body
    next()

}