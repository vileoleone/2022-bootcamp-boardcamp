import express, { json } from "express"
import pkg from "pg"
import dotenv from "dotenv"
import joi from "joi"
import categoryRoutes from "./routes/Categories.routes.js"
import gameRoutes from "./routes/Games.routes.js"
import customerRoutes from "./routes/clients.routes.js"
import rentalsRoutes from "./routes/rentals.routes.js"

dotenv.config();

const app = express()
app.use(express.json());
app.use(categoryRoutes);
app.use(gameRoutes);
app.use(customerRoutes);
app.use(rentalsRoutes)
/* 
const { Pool } = pkg;

const connection = new Pool({
    connectionString: process.env.DATABASE_URL, 
    ssl: true
}); */

app.get("/categories", async (req, res) => {

    

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

    res.send(201);
}); 

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running in port ${port}`));