import cloudinary from "../lib/cloudinary.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import { getSocketId, io } from "../lib/socket.js";
export const getUsersForSideBar = async (req, res) => {
  try {
    const userId = req.user._id;
    const users = await User.find({
      _id: { $ne: userId },
    }).select("-password");

    const usersWithUnreadFlag = await Promise.all(
      users.map(async (user) => {
        const unreadMsgCount = await Message.countDocuments({
          senderId: user._id,
          recieverId: userId,
          isRead: false,
        });
        return {
          ...user.toObject(),
          hasUnreadMessages: unreadMsgCount > 0,
        };
      })
    );

    res.status(200).json(usersWithUnreadFlag);
  } catch (error) {
    console.log("Error getUsersforSideBAr profile", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: passedId } = req.params;
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: userId, recieverId: passedId },
        { senderId: passedId, recieverId: userId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error getMessages", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: recieverId } = req.params;
    const senderId = req.user._id;

    let imgUrl;
    if (image) {
      const cloudResponse = await cloudinary.uploader.upload(image);
      imgUrl = cloudResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      recieverId,
      text,
      image: imgUrl,
    });

    await newMessage.save();

    const recieverSocketId = getSocketId(recieverId);
    io.to(recieverSocketId).emit("newMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error sendMessages", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const markMsgAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    await Message.updateMany(
      { senderId: userId, recieverId: currentUserId, isRead: false },
      { isRead: true }
    );

    const senderSocketId = getSocketId(userId);
    io.to(senderSocketId).emit("messagesRead", { userId: currentUserId });

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.log("Error in markes as read");
    res.status(500).json({ message: "Internal server errror" });
  }
};
