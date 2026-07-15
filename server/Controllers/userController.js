const prisma = require("../Utils/prisma");
const { generateToken, JWT_SECRET } = require("../Utils/authUtils");
const { hashPassword, comparePassword } = require("../Utils/password");
const jwt = require("jsonwebtoken");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  sameSite: "Lax",
};

/**
 * Handles user registration.
 * @route POST /api/users/register
 */
const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone)
    return res.status(400).json({ message: "Please enter all fields." });

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists)
      return res.status(400).json({ message: "User already exists." });

    const user = await prisma.user.create({
      data: { name, email, phone, password: await hashPassword(password) },
    });

    const token = generateToken(user.id);
    res.cookie("jwt", token, cookieOptions);

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
};

/**
 * Handles user login.
 * @route POST /api/users/login
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Please enter all fields." });

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && (await comparePassword(password, user.password))) {
      const token = generateToken(user.id);
      res.cookie("jwt", token, cookieOptions);

      res.status(200).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password." });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};

/**
 * Handles user logout by clearing the cookie.
 * @route POST /api/users/logout
 */
const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "Lax",
  });
  res.status(200).json({ message: "User logged out successfully" });
};

/**
 * Checks the current authentication status based on the JWT.
 * @route GET /api/users/me
 */
const getMe = async (req, res) => {
  try {
    const token =
      req.cookies?.jwt ||
      (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(200).json({ isLoggedIn: false, user: null });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (user) {
      return res.status(200).json({
        isLoggedIn: true,
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isAdmin: user.isAdmin,
        },
      });
    } else {
      return res.status(200).json({ isLoggedIn: false, user: null });
    }
  } catch (error) {
    console.error("Error in getMe:", error);
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "Lax",
    });
    res.status(200).json({ isLoggedIn: false, user: null });
  }
};

/**
 * Updates user profile data (name, email, phone, password).
 * @route PUT /api/users/profile
 * @access Private
 */
const updateUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user._id } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const data = {
      name: req.body.name || user.name,
      email: req.body.email || user.email,
      phone: req.body.phone || user.phone,
    };

    if (req.body.password) {
      data.password = await hashPassword(req.body.password);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data,
    });

    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
      message: "Profile updated successfully!",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    if (error.code === "P2002") {
      return res.status(400).json({ message: "That email is already in use." });
    }
    res.status(400).json({ message: "Error updating profile. Check email format or if email is already in use." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateUserProfile,
};
