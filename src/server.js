import express, { json } from "express"
import pkg from "pg"
import dotenv from "dotenv"
import joi from "joi"
dotenv.config();

const app = express()
app.use(express.json());

const { Pool } = pkg;

const connection = new Pool({
    connectionString: process.env.DATABASE_URL
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running in port ${port}`));


app.get("/categories", async (req, res) => {

    try {

        const categories = await connection.query("SELECT * FROM categories");
        res.status(201).send(categories.rows);

    } catch (error) {

        console.log(error)

    }



});

app.post("/categories", async (req, res) => {
    const { name } = req.body;

    // joi middleware

    const categoriePostSchemaValidation = joi.object({
        name: joi.string().required().min(3).max(15).trim()
    })

    //middleware: Searching for the same names in the category table
    try {

        const categories = await connection.query("SELECT * FROM categories");
        categories.rows.find((object) => object.name === name)
         
        if (!categories) {
            res.status(409).send("there is already this category in the database")
            return
        }
    
    } catch (error) {
        console.log(error)
    }

    // post controller

    // if categories then ...

    try {
        await connection.query(
            "INSERT INTO categories (name) VALUES ($1)",
            [name]
        );
    } catch (error) {
        console.log(error)
    }

    res.send(201);
});