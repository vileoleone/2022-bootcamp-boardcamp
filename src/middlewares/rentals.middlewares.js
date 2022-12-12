import { connectionSQL } from "../database/database.js";
import dayjs from "dayjs";
import { rentalsPostSchemaValidation } from "../models/rentals.validation.js";

const now = dayjs()

export function rentalSchemaValidation(req, res, next) {

    const rental = req.body

    const { error } = rentalsPostSchemaValidation.validate(rental, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).send(`schema error : ${errors}`);
    }

    res.locals.rental = rental

    next();
}

export async function rentalBodySQLValidation(req, res, next) {
    const { customerId, gameId, daysRented } = res.locals.rental

    try {

        const customerIdValidation = await connectionSQL.query(`SELECT  FROM customers WHERE id= $1`, [customerId]);

        if (customerIdValidation.rows.length === 0) {
            res.status(400).send("there is no such customer Id registered in the database")
            return
        }

    } catch (error) {
        res.status(500).send(error.message)
    }


    try {

        const gameIdValidation = await connectionSQL.query(`SELECT * FROM games WHERE id = $1`, [gameId])

        if (gameIdValidation.rows.length === 0) {
            res.status(400).send("there is no such game Id registered in the database")
            return
        }

        const { stockTotal, pricePerDay } = gameIdValidation.rows[0];

        if (stockTotal === 0) {
            res.status(400).send("The stock of this game is currently 0")
            return
        }

        const originalPrice = Number(pricePerDay) * daysRented;

        const rentDate = now.format('DD/MM/YYYY')

        const rentalNewObj = {
            customerId,
            gameId,
            rentDate,
            daysRented,
            returnDate: null,
            originalPrice,
            delayFee: null
        }

        console.log(rentalNewObj)
        res.locals.rentalNewObj = rentalNewObj;
        next()
    }
    catch (error) {
        res.status(500).send(error.message)
    }

}

export async function rentalUpdateValidation(req, res, next) {
    console.log(req.params.id)
    try {

        const rentalIdValidation = await connectionSQL.query(`SELECT *, TO_CHAR("rentDate", 'DD-MM-YYYY') AS "rentDate" FROM rentals WHERE id= $1`, [req.params.id]);

        if (rentalIdValidation.rows.length === 0) {
            res.status(400).send("there is no such customer Id registered in the database")
            return
        }

        if (rentalIdValidation.rows[0].returnDate !== null) {

            res.status(404).send("The rental was finalized")
            return
        }

        res.locals.rental = rentalIdValidation.rows[0]
        next()

    } catch (error) {
        res.status(500).send(error.message)
    }  
}