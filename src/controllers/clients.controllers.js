import { connectionSQL } from "../database/database.js";

export async function getAllCustomers(req, res) {
    const cpf = req.query.cpf
    if (cpf) {

        try {

            const customers = await connectionSQL.query(`SELECT *, TO_CHAR(birthday, 'DD-MM-YYYY') AS birthday FROM customers WHERE cpf LIKE '${cpf}%'`);
            res.status(201).send(customers.rows);;

        } catch (error) {

            res.status(500).send(error.message)

        }
        return
    }
    
    if (req.query.limit && req.query.offset) {

        try {

            const customers = await connectionSQL.query(`SELECT *, TO_CHAR(birthday, 'DD-MM-YYYY') AS birthday FROM customers OFFSET $1 LIMIT $2`, [req.query.offset,req.query.limit])
            res.status(200).send(customers.rows);

        } catch (error) {

            res.status(500).send(error.message)
        }
        return
    }
    
    if (req.query.limit) {

        try {

            const customers = await connectionSQL.query(`SELECT *, TO_CHAR(birthday, 'DD-MM-YYYY') AS birthday FROM customers  LIMIT $1`, [req.query.limit])
            res.status(200).send(customers.rows);

        } catch (error) {

            res.status(500).send(error.message)
        }
        return
    }

    if (req.query.offset) {

        try {

            const customers = await connectionSQL.query(`SELECT *, TO_CHAR(birthday, 'DD-MM-YYYY') AS birthday FROM customers  OFFSET $1`, [req.query.offset])
            res.status(200).send(customers.rows);

        } catch (error) {

            res.status(500).send(error.message)
        }
        return
    }


    try {
        
        const customers = await connectionSQL.query(`SELECT *, TO_CHAR(birthday, 'DD-MM-YYYY') AS birthday FROM customers `)
        res.status(201).send(customers.rows);

    } catch (error) {

        res.status(500).send(error.message)
    }
}

export async function getCustomersById(req, res) {

    try {

        const customers = await connectionSQL.query("SELECT * FROM customers WHERE id = $1", [req.params.id]);
        
        if (customers.rows.length == 0) {
            res.status(404).send("there is no corresponding client's id in the database")
            return
        }
        
        res.status(200).send(customers.rows[0]);
        

    } catch (error) {

        res.status(500).send(error.message)
    }
}

export async function postCustomer(req, res) {
    const { name, phone, cpf, birthday } = res.locals.customer
    try {
        await connectionSQL.query(
            `INSERT 
             INTO customers
             (name, phone, cpf ,birthday)
             VALUES($1,$2,$3,$4)`,
            [name, phone, cpf, birthday]
        );
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
    res.send()
}

export async function postIdCustomer(req, res) {
    const { name, phone, cpf, birthday } = res.locals.customer
    try {
        await connectionSQL.query(
            `UPDATE 
             customers
             SET
             name = $1,
             phone = $2,
             cpf = $3, 
             birthday = $4
             WHERE 
             id = $5`,
            [name, phone, cpf, birthday, req.params.id]
        );
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
    res.send()
}