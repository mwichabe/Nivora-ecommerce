const jwt = require("jsonwebtoken");

// Secret comes from the environment. The fallback exists only so local dev
// doesn't hard-crash if .env is missing — set JWT_SECRET in production.
const JWT_SECRET = process.env.JWT_SECRET || "thisisoneman";

/**
 * Generates a JWT for a given user ID.
 * @param {string} id - The user's UUID.
 * @returns {string} The signed JWT token.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  generateToken,
  JWT_SECRET,
};
