import express from "express";
const router = express.Router();

import {
  signUp,
  login,
  verify
} from "../controllers/driverAuthController";
import { validateRequest, updateValidateRequest } from "../validation/joiValidation";
import {
  getDriver,
  addVehicleAndSaveImage,
  updateVehicle,
  updateDriver,
  deleteDriver,
  availableDrivers,
  imageUpload,
  bookingOTP,
  // watermark,
  verifyBookingOTP
} from "../controllers/driverController";

router.post("/login", login);
router.post("/verify", verify);
router.post("/register", validateRequest, signUp);
router.post("/addvehicle", addVehicleAndSaveImage);
// router.post("/addvehicle", validateRequest, addVehicleAndSaveImage);

// router.get('/watermark', watermark);
router.get("/available", availableDrivers);
router.get("/upload", imageUpload);
router.get("/:id?", getDriver);

router.put("/:id", updateValidateRequest, updateDriver);
router.put("/vehicle/:id", updateVehicle);
// router.put("/vehicle/:id", updateValidateRequest, updateVehicle);

router.put('/bookingotp/:id', bookingOTP);
router.post('/verifybookingotp', verifyBookingOTP);
router.delete("/:id", deleteDriver);

export default router;
