const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const prisma = require('../Utils/prisma');
const { JWT_SECRET } = require('../Utils/authUtils');
const { admin } = require('./adminRoleCheck');

/**
 * Verifies the JWT (from Authorization header or `jwt` cookie) and attaches the
 * authenticated user to req.user. `_id` is aliased to `id` so existing
 * controllers that read `req.user._id` keep working after the Postgres migration.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, phone: true, isAdmin: true },
    });

    if (!user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    req.user = { ...user, _id: user.id };
    next();
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    res.status(401);
    throw new Error('Not authorized, token invalid or expired');
  }
});

// Re-export `admin` so routes can `require('../Middleware/authMiddleware')`
// and destructure both `protect` and `admin` (matches existing route imports).
module.exports = { protect, admin };
