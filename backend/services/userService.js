import { User } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserService {

    // Create a new user
    static async createUser(userData) {
        const { username, password, firstName, lastName, mobileNumber, email } = userData;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            username,
            password: hashedPassword,
            firstName,
            lastName,
            mobileNumber,
            email,
        });

        return user;
    }

    // Authenticate user
    static async authenticateUser(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        return user;
    }

    // Generate JWT token
    static generateToken(user) {
        return jwt.sign(
            {
                _id: user._id,
                username: user.username,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
    }

    // Get user by ID
    static async getUserById(userId) {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    // Update user
    static async updateUser(userId, updateData) {
        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    // Get all users (admin only)
    static async getAllUsers() {
        return await User.find({}).select('-password');
    }

    // Delete user (admin only)
    static async deleteUser(userId) {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
} 