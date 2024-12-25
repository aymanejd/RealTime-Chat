const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
      },
      hasbeenupdated:{
        type: Boolean,
        default: false,      }
      ,
      image: {
        type: String,
      },
    },
    { timestamps: true }
  );

const MessageModel = mongoose.model("Message", messageSchema);

module.exports = MessageModel;