import express from "express";
import {
    register,
    login,
    logout,
    getProfile,
    updateUser,
    changePassword,
    refreshToken,
    getAllUsers,
    deleteUser,
    test
} from '../controllers/user.js';
import {
    authenticateToken,
    requireAdmin,
    rateLimitLogin,
    validateRefreshToken,
    requireOwnershipOrAdmin
} from '../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication required)
router.post("/register", register);
router.post("/login", rateLimitLogin, login);

// Token refresh route (special middleware)
router.post("/refresh-token", validateRefreshToken, refreshToken);

// Protected routes (authentication required)
router.use(authenticateToken); // Apply authentication to all routes below

router.post("/logout", logout);
router.get("/profile", getProfile);
router.put("/profile", updateUser);
router.put("/change-password", changePassword);

// Admin only routes
router.get("/users", requireAdmin, getAllUsers);
router.delete("/users/:id", requireAdmin, deleteUser);
router.get("/test", requireAdmin, test);

export default router;