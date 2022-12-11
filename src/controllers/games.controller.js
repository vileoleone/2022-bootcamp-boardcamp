import { connectionSQL } from "../database/database.js";

export async function getAllGames(req, res) {

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
