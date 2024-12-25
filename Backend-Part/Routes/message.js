const express = require('express');
const router = express.Router();
const MessageContoller=require('../Controllers/MessageContoller.js');
const  verifyToken  = require('../Middleware/Authmiddleware.js');
router.get("/users", verifyToken, MessageContoller.getUsersForSidebar);
router.get("/:id", verifyToken, MessageContoller.getMessages);
router.post("/send/:id", verifyToken,  MessageContoller.sendMessage);
router.delete("/delete/:id", verifyToken,  MessageContoller.deleteMessage);
router.put("/update", verifyToken, MessageContoller.updatemessage);

module.exports = router
