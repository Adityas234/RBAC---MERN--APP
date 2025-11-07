const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    // ✅ Renamed from "author" to "createdBy"
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Public or Private content
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  { timestamps: true }
);

// Optional index for better performance on filters
contentSchema.index({ createdBy: 1 });
contentSchema.index({ visibility: 1 });

module.exports = mongoose.model("Content", contentSchema);
