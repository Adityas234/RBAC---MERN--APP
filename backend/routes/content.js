const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createContent,
  getAllContent,
  getContentById,
  updateContent,
  deleteContent,
  getMyContent,
} = require("../controllers/contentController");

const router = express.Router();

// Public
router.get("/", getAllContent);
router.get("/my", protect, getMyContent); // ✅ Move this BEFORE /:id
router.get("/:id", protect, getContentById);
router.post("/", protect, createContent);
router.put("/:id", protect, updateContent);
router.delete("/:id", protect, deleteContent);


module.exports = router;
