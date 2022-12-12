import { application, Router } from "express";
import { DeleteInRentals, getAllInRentals, postIdRental, postRentals } from "../controllers/rentals.controllers.js";
import { rentalBodySQLValidation, rentalSchemaValidation, rentalUpdateValidation } from "../middlewares/rentals.middlewares.js";

const router = Router()
 
router.get("/rentals", getAllInRentals);
router.post("/rentals", rentalSchemaValidation, rentalBodySQLValidation, postRentals)
router.post("/rentals/:id/return", rentalUpdateValidation, postIdRental)
router.delete("/rentals/:id", DeleteInRentals)

export default  router