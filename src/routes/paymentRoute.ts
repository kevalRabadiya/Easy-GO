import { Router } from "express";
const router = Router();
import {
  paymentCheckout,
  getallPayment,
  updatePayment
} from "../controllers/paymentController";
import { totalBooking, getRevenue } from "../controllers/bookingController";

router.get("/", getallPayment);
router.post("/checkout", paymentCheckout);
router.get("/revenue", getRevenue);
router.get("/total", totalBooking);
router.put('/:id',updatePayment)

export default router;
