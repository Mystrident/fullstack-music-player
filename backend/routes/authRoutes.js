import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import {
  getme,
  login,
  signup,
  forgotPassword,
  resetPassword,
  editProfile,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/getme", protect, getme); // we are adding protection layer above this getme route, ie only if we are logged in, we will be able to visit this route
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/signup", signup);
router.patch("/profile", protect, editProfile);
//since signup involves creation of user, we make use of post http method
router.post("/login", login);
export default router;
