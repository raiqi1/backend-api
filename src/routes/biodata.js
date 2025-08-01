import express from "express";
import {
  createOrUpdateBiodata,
  getUserBiodata,
  getAllBiodata,
  getBiodataById,
  updateBiodataById,
  deleteBiodata,
} from "../controllers/biodataController.js";
import {
  authenticate,
  requireAdmin,
  requireUserOrAdmin,
} from "../middleware/auth.js";
import { validateBiodata } from "../middleware/validators.js";

const router = express.Router();

// User routes
router.post(
  "/",
  authenticate,
  requireUserOrAdmin,
  validateBiodata,
  createOrUpdateBiodata
);
router.get("/me", authenticate, requireUserOrAdmin, getUserBiodata);

// Admin routes
router.get("/all", authenticate, requireAdmin, getAllBiodata); // ← Pindah ke atas
router.get("/:id", authenticate, requireAdmin, getBiodataById);
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  validateBiodata,
  updateBiodataById
);
router.delete("/:id", authenticate, requireAdmin, deleteBiodata);

export default router;
