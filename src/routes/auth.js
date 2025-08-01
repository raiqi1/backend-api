import express from "express";
import {
  signUp,
  login,
  getCurrentUser,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { validateSignUp, validateLogin } from "../middleware/validators.js";

const router = express.Router();

// Public routes
router.post("/signup", validateSignUp, signUp);
router.post("/login", validateLogin, login);

// Protected routes
router.get("/me", authenticate, getCurrentUser);

export default router;
