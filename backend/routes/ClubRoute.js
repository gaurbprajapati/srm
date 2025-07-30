
import express from "express";
import {
    createClub,
    updateClub,
    getClubById,
    getAllClubs,
    deleteClub,
    upload
} from '../controllers/club.js';
import {
    authenticateToken,
    requireAdmin,
    optionalAuth
} from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get("/", getAllClubs);
router.get("/:id", getClubById);

// Protected routes (require authentication)
router.post("/", authenticateToken, upload.single("image"), createClub);
router.put("/:id", authenticateToken, upload.single("image"), updateClub);

// Admin only routes
router.delete("/:id", authenticateToken, requireAdmin, deleteClub);

export default router;