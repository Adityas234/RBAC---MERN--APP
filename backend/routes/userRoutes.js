const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  getAllUsers,
  getUserById,
  deleteUser,
  changePassword,
  forgotPassword,
  resetPassword,
  updateUserRole,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/", protect, getAllUsers);
router.get("/me", protect, getCurrentUser);
router.put("/me", protect, updateProfile); // ✅ profile update route
router.put("/change-password", protect, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.patch("/:id/role", protect, updateUserRole); // leave as is if updateUserRole already checks admin
router.get("/:id", protect, getUserById);
router.delete("/:id", protect, deleteUser); // leave if deleteUser checks admin

module.exports = router;
