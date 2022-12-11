import { Router } from "express";
import { getAllCustomers, getCustomersById, postCustomer, postIdCustomer } from "../controllers/clients.controllers.js";
import { customersBodySchemaValidation, customersBodySQLValidation} from "../middlewares/clients.middlewares.js";

const router = Router()

router.get("/customers", getAllCustomers);
router.get("/customers/:id", getCustomersById)
router.post("/customers", customersBodySchemaValidation, customersBodySQLValidation, postCustomer);
router.post("/customers/:id", customersBodySchemaValidation, postIdCustomer )
export default router;