const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
    message: {
      type: String,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String, 
      default: "message",
    },
  },
  { timestamps: true }
);

const NotificationModel =     mongoose.models.Notification || mongoose.model("Notification", notificationSchema);


module.exports = NotificationModel;
