import jwt from 'jsonwebtoken';

// Generate JWT token without cookies
export const generateJWTToken = (user) => {
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Generate refresh token (optional for future use)
export const generateRefreshToken = (user) => {
  const payload = {
    _id: user._id,
    type: 'refresh'
  };

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  });
};

// Verify JWT token
export const verifyJWTToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Extract token from Authorization header
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }

  return null;
};

// Create standardized auth response
export const createAuthResponse = (user, message = "Success") => {
  const token = generateJWTToken(user);

  return {
    success: true,
    message,
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      mobileNumber: user.mobileNumber,
      isAdmin: user.isAdmin
    }
  };
};

// Legacy function - deprecated, keeping for backward compatibility
export const sendCookie = (user, res, message, statusCode = 200) => {
  console.warn('sendCookie is deprecated. Use createAuthResponse instead.');
  const token = generateJWTToken(user);
  return token;
};
