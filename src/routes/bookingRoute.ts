import { Router } from "express";
const router = Router();
import {
  viewBooking,
  updateBooking,
  deleteBooking,
  createBooking
} from "../controllers/bookingController";
import { validateRequest } from "../validation/joiValidation";

router.get("/list", viewBooking);
router.post("/", validateRequest, createBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

export default router;
