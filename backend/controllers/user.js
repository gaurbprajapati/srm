// Import modules using ES6 module syntax
import { User } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { createAuthResponse, generateJWTToken } from '../utils/features.js';
import jwt from 'jsonwebtoken';

// Register a new user
export const register = async (req, res) => {
    try {
        const {
            username,
            password,
            firstName,
            lastName,
            mobileNumber,
            email,
        } = req.body;

        // Validate required fields
        if (!username || !password || !email) {
            return res.status(400).json({
                success: false,
                error: "Username, password, and email are required"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: existingUser.email === email ? "Email already exists" : "Username already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const user = await User.create({
            username,
            password: hashedPassword,
            firstName,
            lastName,
            mobileNumber,
            email,
        });

        // Create JWT response
        const authResponse = createAuthResponse(user, "User registered successfully");

        res.status(201).json(authResponse);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // Validate input
        if ((!email && !username) || !password) {
            return res.status(400).json({
                success: false,
                error: "Email/username and password are required"
            });
        }

        // Find user by email or username
        const user = await User.findOne({
            $or: [
                { email: email || '' },
                { username: username || '' }
            ]
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: "Invalid credentials"
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: "Invalid credentials"
            });
        }

        // Create JWT response
        const authResponse = createAuthResponse(user, `Welcome back, ${user.firstName || user.username}!`);

        res.json(authResponse);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Logout user (mainly for client-side token removal)
export const logout = (req, res) => {
    res.json({
        success: true,
        message: "Logged out successfully. Please remove the token from client storage."
    });
};

// Get current user profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        res.json({
            success: true,
            data: user,
            message: "Profile retrieved successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update user profile
export const updateUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const updateData = { ...req.body };

        // Remove sensitive fields that shouldn't be updated here
        delete updateData.password;
        delete updateData.isAdmin;
        delete updateData._id;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        res.json({
            success: true,
            data: updatedUser,
            message: "Profile updated successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Change password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: "Current password and new password are required"
            });
        }

        // Get user with password
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                success: false,
                error: "Current password is incorrect"
            });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        // Update password
        await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

        res.json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Refresh token
export const refreshToken = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        const newToken = generateJWTToken(user);

        res.json({
            success: true,
            token: newToken,
            message: "Token refreshed successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');

        res.json({
            success: true,
            data: users,
            count: users.length,
            message: "Users retrieved successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent admin from deleting themselves
        if (id === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                error: "You cannot delete your own account"
            });
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        res.json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Test endpoint (admin only)
export const test = async (req, res) => {
    res.json({
        success: true,
        message: 'API is working!',
        user: {
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            isAdmin: req.user.isAdmin
        },
        timestamp: new Date().toISOString()
    });
};






// module.exports = { userRegister, userLogin, userUpdate };

