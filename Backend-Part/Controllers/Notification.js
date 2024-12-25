const Notification = require("../models/notification");
const User = require('../Models/user');
const { io, getReceiverSocketId } = require('../configue/socketio');

exports.getuser=async (req,res)=>{
  try{ 
    const { userId } = req.params;

  const user= await User.findOne({ _id: userId }).select("-password -email -updatedAt -createdAt")
 
  res.status(200).json(user);}
  catch(error){
    console.error("Error fetching notifications:", error); // Log the error details
    res.status(500).json({ message: "Server error" })
  }

}
exports.getnotifications = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
  
      res.status(200).json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error); // Log the error details
      res.status(500).json({ message: "Server error" });
    }
  };
  exports.notificationhasbeenread = async (req, res) => {
    try {
      const { notificationId } = req.body;
    if (!notificationId) {
      return res.status(400).json({ message: "Notification ID is required" });
    }
      const notification=await Notification.findByIdAndUpdate(
        notificationId,
        { isRead: 1 },
        { new: true },
      );
  
      res.status(200).json(notification);
    } catch (error) {
      console.error("Error fetching notifications:", error); // Log the error details
      res.status(500).json({ message: "Server error" });
    }
  };

// Create a new notification

