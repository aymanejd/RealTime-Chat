const User = require('../Models/user');
const Message = require('../Models/message');
const Notification = require('../Models/notification');

const cloudinary = require('../configue/cloudinary');
const { io, getReceiverSocketId } = require('../configue/socketio');
exports.getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password -email");

    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.updatemessage = async (req, res) => {
  try {
    const { messageId, updatedMessageValue } = req.body;

    // Validate input
    if (!messageId || !updatedMessageValue) {
      return res.status(400).json({ message: "Message ID and updated value are required" });
    }
    // Find the message by ID
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    // Update the message content
    message.text = updatedMessageValue;
    message.hasbeenupdated=true;
    // Save the updated message
    const newmessage = await message.save();
    const userToChatId =newmessage.receiverId
    const receiverSocketId = getReceiverSocketId(userToChatId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageUpdate", newmessage);
    }
    console.log("receiverSocketId",receiverSocketId)

    res.status(200).json({newmessage });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.deleteMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const { messageId } = req.body;

    const myId = req.user._id;

    await Message.findByIdAndDelete(messageId);
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    const receiverSocketId = getReceiverSocketId(userToChatId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", messageId);
    }
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();
    const sendername = await User.findOne(senderId)

    const notification = new Notification({
      userId: receiverId,
      message: `You have a new message from `,
      senderName: sendername.fullName,
      senderId: senderId,
      type: "message",
    });
    const newNotification = await notification.save();
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newNotification", newNotification);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};