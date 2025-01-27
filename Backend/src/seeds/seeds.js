import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/userModel.js";
import Message from "../models/messageModel.js";

config();

const seedUsers = [
  // Female Users
  {
    email: "emma.thompson@example.com",
    fullName: "Emma Thompson",
    password: "123456",
  },
  {
    email: "olivia.miller@example.com",
    fullName: "Olivia Miller",
    password: "123456",
  },
  {
    email: "james.anderson@example.com",
    fullName: "James Anderson",
    password: "123456",
  },
  {
    email: "zoro@gmail.com",
    fullName: "Zoro",
    password: "123456",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.insertMany(seedUsers);
    await Message.deleteMany({});
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Call the function
seedDatabase();
