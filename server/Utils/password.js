// Password hashing helpers. Previously this logic lived in a Mongoose
// `pre('save')` hook on the User model; Prisma has no such hook, so hashing
// is done explicitly in the controllers via these helpers.
const bcrypt = require("bcrypt");

const hashPassword = async (plain) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

const comparePassword = async (plain, hash) => {
  return bcrypt.compare(plain, hash);
};

module.exports = { hashPassword, comparePassword };
