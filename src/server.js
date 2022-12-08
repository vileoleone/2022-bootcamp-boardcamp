import express from "express"
import pkg from "pg"

const { Pool } = pkg;

const connection = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const app = express()

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running in port ${port}`));