import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User";

dotenv.config({ path: [".env.local", ".env"] });

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/sparenza-jewels");
    console.log("MongoDB Connected");

    // Clear existing users just to be clean, or just check if they exist
    await User.deleteMany({ email: { $in: ["admin@lux.com", "user@lux.com"] } });

    const admin = new User({
      firstName: "Admin",
      lastName: "User",
      email: "admin@lux.com",
      password: "password123",
      role: "admin",
      isVerified: true,
    });

    const user = new User({
      firstName: "Test",
      lastName: "User",
      email: "user@lux.com",
      password: "password123",
      role: "user",
      isVerified: true,
    });

    await admin.save();
    await user.save();

    console.log("Users created successfully!");
    console.log("Admin: admin@lux.com / password123");
    console.log("User: user@lux.com / password123");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();
