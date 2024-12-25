const express = require('express');
const router = express.Router();
const AuthContoller=require('../Controllers/AuthController.js');
const  verifyToken  = require('../Middleware/Authmiddleware.js');

// Sample Routes
router.post('/signup',AuthContoller.signup);
router.post('/login',AuthContoller.login);
router.post('/logout', AuthContoller.logout);
router.put('/UpdateProfilePic', verifyToken,  AuthContoller.updateprofilePic);
router.put('/UpdateProfile', verifyToken,  AuthContoller.updateprofile);

router.get("/check", verifyToken, AuthContoller.Authcheck);

module.exports = router

