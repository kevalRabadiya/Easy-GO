import { Router } from "express";
const router = Router();
import {
  viewUser,
  updateUser,
  deleteUser
} from "../controllers/userController";

import {
  signUp,
  login,
  verify,
  requestDrive
} from "../controllers/userAuthController";
import { verifyToken } from "../middleware/authMiddleware";
import calcDistance from "../utils/distance";

router.post("/login", login);
router.post("/verify", verify);
router.post("/register", signUp);
router.get("/maps/distance", calcDistance);
router.get("/", viewUser);
router.put("/", verifyToken, updateUser);
router.delete("/", deleteUser);
router.post("/request-drive/", verifyToken, requestDrive);

export default router;
