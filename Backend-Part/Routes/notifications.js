const express = require('express');
const router = express.Router();
const Notifications=require('../Controllers/Notification.js');
const  verifyToken  = require('../Middleware/Authmiddleware.js');



router.get("/get/:userId", verifyToken, Notifications.getnotifications);
router.post("/getuser/:userId", verifyToken, Notifications.getuser);
router.post("/read", verifyToken, Notifications.notificationhasbeenread);

module.exports = router

