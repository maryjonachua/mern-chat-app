import express from "express";
import {
  checkAuth,
  loginController,
  logoutController,
  signUpController,
  updateProfileController,
} from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signUpController);
router.post("/login", loginController);
router.post("/logout", logoutController);

router.put("/update-profile", protectRoute, updateProfileController);
router.get("/check", protectRoute, checkAuth);

export default router;
