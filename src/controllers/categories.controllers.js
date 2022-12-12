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
    
    
    if (req.query.limit && req.query.offset) {

        try {
            const categories = await connectionSQL.query(`SELECT * FROM categories OFFSET $1 LIMIT $2`, [req.query.offset, req.query.limit]);
            res.status(200).send(categories.rows)

        } catch (err) {
            res.status(500).send(err.message)
        }

        return
    }

    if (req.query.limit) {

        try {
            const categories = await connectionSQL.query(`SELECT * FROM categories LIMIT $1`, [req.query.limit]);
            res.status(200).send(categories.rows)

        } catch (err) {
            res.status(500).send(err.message)
        }

        return
    }

    if (req.query.offset) {

        try {
            const categories = await connectionSQL.query(`SELECT * FROM categories OFFSET $1`, [req.query.offset]);
            res.status(200).send(categories.rows)

        } catch (err) {
            res.status(500).send(err.message)
        }

        return
    }
        
    
    try {

        const categories = await connectionSQL.query("SELECT * FROM categories");
        res.status(200).send(categories.rows);

    } catch (error) {

        res.status(500).send(error.message)

    }
}
