import { connectionSQL } from "../database/database.js";

export async function postNameInCategory(req, res) {
    const { name } = res.locals.name
    try {
        await connectionSQL.query(
            "INSERT INTO categories (name) VALUES ($1)",
            [name]
        );
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getAllInCategory(req, res) {
    try {

        const categories = await connectionSQL.query("SELECT * FROM categories");
        res.status(201).send(categories.rows);

    } catch (error) {

        console.log(error)

    }
}
