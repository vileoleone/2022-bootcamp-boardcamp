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
        
        res.status(200).send(customers.rows);
        

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