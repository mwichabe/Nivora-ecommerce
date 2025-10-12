const express = require("express");
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getMe 
} = require("../Controllers/userController");
const { protect } = require("../Middleware/authMiddleware");

// Public routes (no authentication needed)
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protected routes (authentication needed)
// The 'protect' middleware runs first, verifies the token, and attaches the user ID to the request.
// router.get("/profile", protect, getProfile); // Example of a protected route

// Route to check if the user is currently logged in
router.get("/me", getMe);


module.exports = router;
