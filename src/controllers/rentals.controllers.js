import { connectionSQL } from "../database/database.js";
import dayjs from "dayjs";

const now = dayjs();

export async function postRentals(req, res) {
    const { customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee } = res.locals.rentalNewObj
    try {
        await connectionSQL.query(
            `INSERT 
             INTO
             rentals("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
             VALUES($1, $2, $3, $4, $5, $6, $7 )`,
            [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]
        );
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function postIdRental(req, res) {
    const { customerId, gameId, rentDate, daysRented, originalPrice } = res.locals.rental

    const returnDate = now.format('DD/MM/YYYY')
    const rentDateFormat = dayjs(rentDate).format('DD/MM/YYYY')

    const dayDifference = ((Number(new Date(returnDate) - new Date(rentDateFormat)) / (1000 * 60 * 60 * 24)) - daysRented) /*  */
    let delayFee = dayDifference * (originalPrice / daysRented);
    if (delayFee <= 0) {
        delayFee = 0;
    }

    try {
        await connectionSQL.query(
            `UPDATE 
             rentals
             SET
             "customerId" = $1, "gameId" = $2, "rentDate" = $3, "daysRented" = $4, "returnDate" = $5, "originalPrice" = $6, "delayFee" = $7 WHERE id = $8`,
            [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee, req.params.id]
        );
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


export async function getAllInRentals(req, res) {

    const { customerId, gameId } = req.query

    if (customerId) {

        try {

            const getRentalList = [];
            const rentalList = await connectionSQL.query(`SELECT *, TO_CHAR("rentDate", 'DD-MM-YYYY') AS "rentDate" FROM rentals WHERE "customerId" = $1`, [customerId]);
            
            if (rentalList.rows.length === 0) {
                res.status(404).send("No customeId found")
                return
            }
            for (const rental of rentalList.rows) {
                const { customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee } = rental

                const customerObj = await connectionSQL.query(`SELECT customers.id, customers.name from customers WHERE id = $1;`, [customerId])
                const gameObj = await connectionSQL.query(`SELECT games.id, games.name, games."categoryId", categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE games.id = $1;`, [gameId])

                getRentalList.push({
                    customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee,
                    customer: customerObj.rows[0],
                    games: gameObj.rows[0]
                })
            }
            res.status(200).send(getRentalList)
            
        } catch (error) {
            res.status(500).send(error.message)
        }
        return
    }

    if (gameId) {

        try {

            const getRentalList = [];
            const rentalList = await connectionSQL.query(`SELECT *, TO_CHAR("rentDate", 'DD-MM-YYYY') AS "rentDate", TO_CHAR("returnDate", 'DD-MM-YYYY') AS "returnDate" FROM rentals WHERE "gameId" = $1`, [gameId]);

            if (rentalList.rows.length === 0) {
                res.status(404).send("No gameId found")
                return
            }
 
            for (const rental of rentalList.rows) {
                const { customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee } = rental

                const customerObj = await connectionSQL.query(`SELECT customers.id, customers.name from customers WHERE id = $1;`, [customerId])
                const gameObj = await connectionSQL.query(`SELECT games.id, games.name, games."categoryId", categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE games.id = $1;`, [gameId])

                getRentalList.push({
                    customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee,
                    customer: customerObj.rows[0],
                    games: gameObj.rows[0]
                })
            }
            res.status(200).send(getRentalList)
        } catch (error) {
            res.status(500).send(error.message)
        }
        return
    }

    try {

        const getRentalList = [];
        const rentalList = await connectionSQL.query(`SELECT *, TO_CHAR("rentDate", 'DD-MM-YYYY') AS "rentDate" FROM rentals`);

        for (const rental of rentalList.rows) {
            const { customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee } = rental

            const customerObj = await connectionSQL.query(`SELECT customers.id, customers.name from customers WHERE id = $1;`, [customerId])
            const gameObj = await connectionSQL.query(`SELECT games.id, games.name, games."categoryId", categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE games.id = $1;`, [gameId])

            getRentalList.push({
                customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee,
                customer: customerObj.rows[0],
                games: gameObj.rows[0]
            })
        }
        res.status(200).send(getRentalList)

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function DeleteInRentals(req, res) {


    try {
        const rentalList = await connectionSQL.query("SELECT * FROM rentals WHERE id = $1", [req.params.id]);
        console.log(rentalList.rows[0])

        if (rentalList.rows.length === 0) {
            res.status(404).send("The id does not exist in the database")
            return
        }

        if (rentalList.rows[0].returnDate === null) {
            res.status(400).send("The game has not been returned")
            return
        }
        
        const rentalListToDelete = await connectionSQL.query("DELETE FROM rentals WHERE id = $1", [req.params.id]);
        res.status(200)

    } catch (error) {

        res.status(500).send(error.message)

    }
}