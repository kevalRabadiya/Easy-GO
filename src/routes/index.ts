import express from "express";
const router = express();
import customerRoute from "./userRoute";
import paymentRoute from "./paymentRoute";
import driverRoute from "./driverRoute";
import booking from "./bookingRoute";

router.use("/user", customerRoute);
router.use("/driver", driverRoute);
router.use("/payment", paymentRoute);
router.use("/booking", booking);

export default router;
