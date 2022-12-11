import { Router } from "express";
import { getAllGames, postGame } from "../controllers/games.controller.js";
import { gameBodySchemaValidation, gameBodySQLValidation } from "../middlewares/games.middleware.js";
import { gamePostSchemaValidation } from "../models/games.validation.js";

const router = Router();

router.get("/games", getAllGames)
router.post("/games", gameBodySchemaValidation, gameBodySQLValidation, postGame)

export default router;


