import { assignToken } from "../lib/utils.js";
import User from "../models/userModel.js";
import cloudinary from "../lib/cloudinary.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password length should not be less than 6 characters",
      });
    }
    if (!email || !fullName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      assignToken(newUser._id, res);
      await newUser.save();
      return res.status(201).json({ newUser });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Failed to create user", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect)
      return res.status(400).json({ message: "Inavlid credentials" });

    assignToken(user._id, res);
    return res.status(200).json({ user });
  } catch (error) {
    console.log("Failed to login user", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "Log out successful" });
  } catch (error) {
    console.log("Failed to logout user", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  console.log(req.body);
  try {
    const { profilePic } = req.body;
    if (!profilePic)
      return res.status(404).json({ message: "Profile is required" });
    const userId = req.user._id;

    const cloudResponse = await cloudinary.uploader.upload(profilePic);
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: cloudResponse.secure_url },
      { new: true }
    );
    return res
      .status(201)
      .json({ message: "Profile updated succesfully", user });
  } catch (error) {
    console.log("Error in update profile", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({ user });
  } catch (error) {
    console.log("Error in check Auth", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
