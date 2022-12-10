import { Router } from "express";
import { getAllInCategory, postNameInCategory } from "../controllers/categories.controllers.js";
import { postBodySchemaValidation, postBodySQLValidation } from "../middlewares/categories.middlewares.js";
const router = Router();

router.get("/categories", getAllInCategory)
router.post("/categories", postBodySchemaValidation, postBodySQLValidation, postNameInCategory)

export default router;