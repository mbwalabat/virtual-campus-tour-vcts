import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js"; // adjust path

dotenv.config({ path: "../.env" });

const MONGO_URI = process.env.MONGODB_URI;

async function seedSuperAdmin() {
  try {
    await mongoose.connect(MONGO_URI);

    // Check if Super Admin exists
    let superAdmin = await User.findOne({ role: "superAdmin" });

    if (!superAdmin) {
      superAdmin = new User({
        name: "Super Admin",
        email: "abcd@gmail.com",
        password: "supersecret123", // will be hashed by pre-save hook
        role: "superAdmin",
      });

      await superAdmin.save(); // ✅ triggers password hashing
      console.log("🎉 Super Admin created with hashed password:", superAdmin.email);
    } else {
      console.log("✅ Super Admin already exists:", superAdmin.email);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding Super Admin:", err);
    process.exit(1);
  }
}

seedSuperAdmin();
