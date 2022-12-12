import { connectionSQL } from "../database/database.js";

export async function getAllGames(req, res) {

    if (req.query.limit && req.query.offset) {

        try {
            const games = await connectionSQL.query(`SELECT * FROM games OFFSET $1 LIMIT $2`, [req.query.offset, req.query.limit]);
            res.status(200).send(games.rows)

        } catch (err) {
            res.status(500).send(err.message)
        }

        return
    }

    if (req.query.limit) {

        try {
            const games = await connectionSQL.query(`SELECT * FROM games LIMIT $1`, [req.query.limit]);
            res.status(200).send(games.rows)

        } catch (err) {
            res.status(500).send(err.message)
        }

        return
    }

    if (req.query.offset) {

        try {
            const games = await connectionSQL.query(`SELECT * FROM games OFFSET $1`, [req.query.offset]);
            res.status(200).send(games.rows)

        } catch (err) {
            res.status(500).send(err.message)
        }

        return
    }

    try {
        const games = await connectionSQL.query(`SELECT * FROM games`);
        res.status(201).send(games.rows)

    } catch (err) {
        res.status(500).send(err.message)
    }

}

export async function postGame(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = res.locals.game
    try {
        await connectionSQL.query(
            `INSERT 
             INTO games
             (name, image, "stockTotal", "categoryId", "pricePerDay")
             VALUES($1,$2,$3,$4,$5)`,
            [name, image, stockTotal, categoryId, pricePerDay]
        );
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
    res.send()
}
