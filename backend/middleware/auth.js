import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import { extractTokenFromHeader, verifyJWTToken } from '../utils/features.js';

// Authenticate JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Access token required. Please provide a valid Bearer token."
      });
    }

    // Verify the token
    const decoded = verifyJWTToken(token);

    // Fetch fresh user data to ensure user still exists and is active
    const user = await User.findById(decoded._id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User associated with this token no longer exists"
      });
    }

    // Add user to request object
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    let errorMessage = "Invalid or expired token";

    if (error.name === 'TokenExpiredError') {
      errorMessage = "Token has expired. Please login again.";
    } else if (error.name === 'JsonWebTokenError') {
      errorMessage = "Invalid token format";
    } else if (error.name === 'NotBeforeError') {
      errorMessage = "Token not active yet";
    }

    return res.status(403).json({
      success: false,
      error: errorMessage
    });
  }
};

// Check if user is admin
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Authentication required"
    });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      error: "Admin privileges required to access this resource"
    });
  }

  next();
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = verifyJWTToken(token);
      const user = await User.findById(decoded._id).select('-password');
      if (user) {
        req.user = user;
        req.token = token;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication - this is optional auth
    next();
  }
};

// Check if user owns the resource or is admin
export const requireOwnershipOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Authentication required"
    });
  }

  const resourceUserId = req.params.userId || req.body.userId || req.params.id;
  const currentUserId = req.user._id.toString();

  if (currentUserId === resourceUserId || req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: "You can only access your own resources"
    });
  }
};

// Rate limiting middleware (basic implementation)
const loginAttempts = new Map();

export const rateLimitLogin = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  if (!loginAttempts.has(clientIP)) {
    loginAttempts.set(clientIP, { count: 1, resetTime: now + windowMs });
    return next();
  }

  const attempts = loginAttempts.get(clientIP);

  if (now > attempts.resetTime) {
    // Reset the window
    loginAttempts.set(clientIP, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (attempts.count >= maxAttempts) {
    return res.status(429).json({
      success: false,
      error: "Too many login attempts. Please try again later."
    });
  }

  attempts.count++;
  next();
};

// Validate token refresh
export const validateRefreshToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Refresh token required"
      });
    }

    // For refresh, we still accept slightly expired tokens
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });

    // Check if token is not too old (e.g., not older than 1 hour after expiry)
    const tokenExp = decoded.exp * 1000; // Convert to milliseconds
    const oneHourAfterExp = tokenExp + (60 * 60 * 1000);

    if (Date.now() > oneHourAfterExp) {
      return res.status(401).json({
        success: false,
        error: "Token is too old for refresh. Please login again."
      });
    }

    const user = await User.findById(decoded._id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User associated with this token no longer exists"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: "Invalid refresh token"
    });
  }
};

// Check organization membership (if you need this feature)
export const checkOrganization = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Authentication required"
    });
  }

  if (!req.user.organization) {
    return res.status(403).json({
      success: false,
      error: "Organization membership required"
    });
  }

  next();
};