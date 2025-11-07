const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

// If running in Docker, mongodb container hostname is "mongodb"
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongodb:27017/rbac-mern";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await User.deleteMany({});
    console.log("🗑️ Existing users removed");

    const users = [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
      },
      {
        name: "Standard User",
        email: "user@example.com",
        password: await bcrypt.hash("user123", 10),
        role: "user",
      },
      {
        name: "Viewer User",
        email: "viewer@example.com",
        password: await bcrypt.hash("viewer123", 10),
        role: "viewer",
      }
    ];

    await User.insertMany(users);
    console.log("✅ Seed users created successfully");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
