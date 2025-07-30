import express from "express";
import {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getMyJobs
} from '../controllers/job.js';
import {
    authenticateToken,
    requireAdmin,
    optionalAuth
} from '../middleware/auth.js';

const router = express.Router();

// Public routes (optional auth for enhanced features)
router.get("/", optionalAuth, getAllJobs);
router.get("/:id", optionalAuth, getJobById);

// Protected routes (require authentication)
router.use(authenticateToken); // Apply authentication to all routes below

router.post("/", createJob);
router.get("/my/jobs", getMyJobs); // Get current user's jobs
router.patch("/:id", updateJob);

// Admin only routes
router.delete("/:id", requireAdmin, deleteJob);

export default router; 