import { connectionSQL } from "../database/database.js";
import { gamePostSchemaValidation } from "../models/games.validation.js";

export function gameBodySchemaValidation (req, res, next) {

    const customer = req.body

    const { error } = gamePostSchemaValidation.validate(customer, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).send(`schema error : ${errors}`);
    }

    res.locals.customer= customer

    next();
}

export async function gameBodySQLValidation(req, res, next) {
    const { name,categoryId } = res.locals.game
    try {

        const gameNameValidation = await connectionSQL.query(`SELECT * FROM games WHERE name = $1`,[name]);
        const gameCategoryValidation = await connectionSQL.query(`SELECT * FROM categories WHERE id = $1`, [categoryId])

         if (gameNameValidation.rows.length > 0) {
            res.status(409).send("there is already a game registered in the database")
            return
        }

        if (gameCategoryValidation.rows.length == 0) {
            res.status(400).send("category id not found!")
            return
        }

    } catch (error) {
        console.log(error)
    }

     next()  

}