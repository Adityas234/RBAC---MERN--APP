const { get } = require("mongoose");
const Content = require("../models/Content");

// ✅ Create Content
const createContent = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    // ❌ Block viewer
    if (req.user.role === "viewer") {
      return res.status(403).json({ message: "Viewers cannot create content" });
    }

    const { title, body, visibility } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: "Title and content body required" });
    }

    const newContent = await Content.create({
      title,
      body,
      visibility: visibility || "public",
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Content created successfully",
      content: newContent,
    });

  } catch (error) {
    console.error("Create Content Error:", error);
    res.status(500).json({ message: "Server error creating content" });
  }
};


// ✅ Get All Public Content
const getAllContent = async (req, res) => {
  try {
    const content = await Content.find({ visibility: "public" })
      .populate("createdBy", "name email"); // ✅ correct field

    res.json({ content });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching content" });
  }
};

// ✅ Get Single Content
const getContentById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate("createdBy", "name email"); // ✅ correct field

    if (!content) return res.status(404).json({ message: "Content not found" });

    // If private, only owner or admin can access
    if (
      content.visibility === "private" &&
      content.createdBy._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ content });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching content" });
  }
};

// ✅ Update Content
const updateContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ message: "Content not found" });

    // ❌ Block viewer entirely
    if (req.user.role === "viewer") {
      return res.status(403).json({ message: "Viewers cannot edit content" });
    }

    // ✅ Only owner or admin can update
    if (
      content.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    content.title = req.body.title || content.title;
    content.body = req.body.body || content.body;
    content.visibility = req.body.visibility || content.visibility;

    await content.save();
    res.json({ message: "Content updated successfully", content });
  } catch (error) {
    res.status(500).json({ message: "Server error updating content" });
  }
};

// ✅ Delete Content
const deleteContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ message: "Content not found" });

    // ❌ Block viewer
    if (req.user.role === "viewer") {
      return res.status(403).json({ message: "Viewers cannot delete content" });
    }

    // ✅ Only owner or admin can delete
    if (
      content.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await content.deleteOne();
    res.json({ message: "Content deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting content" });
  }
};


const getMyContent = async (req, res) => {
  try {
    const content = await Content.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ content });
  } catch (error) {
    console.error("Get My Content Error:", error);
    res.status(500).json({ message: "Server error fetching content" });
  }
};



module.exports = {
  createContent,
  getAllContent,
  getContentById,
  updateContent,
  deleteContent,
  getMyContent,
};
