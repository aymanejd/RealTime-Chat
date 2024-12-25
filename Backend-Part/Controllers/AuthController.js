const bcrypt = require('bcrypt');
const User = require('../Models/user');
const { generateToken } = require('../configue/tokencookie');
const cloudinary  = require('../configue/cloudinary');
const multer = require('multer');
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });
exports.signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }
    generateToken(user._id, res)
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    })
  }
  catch (error) {
    res.status(500).json({ message: "Internal Server Error" });

  }

};

exports.logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Clears the cookie
    });
   return res.status(200).json({ message: "Logged out successfully" });
  }
  catch (error) { 
    return res.status(500).json({ message: "Internal Server Error" });
  }

};



exports.updateprofilePic = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      resource_type: "auto", // Automatically determines the resource type
    });    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true },
      


    );

    res.status(200).json(updatedUser);

  }
  catch (error) { 
    res.status(500).json({ message: "Internal Server Error" });
  }

};
exports.updateprofile = async (req, res) => {
  try {
    const { email,fullName } = req.body;
    const userId = req.user._id;
    if (!fullName) {
      return res.status(400).json({ message: "name fields  is required" });
    }
    if (!email) {
      return res.status(400).json({ message: "email fields  is required" });
    }
    const user = await User.findOne({ email });

    
      if (user && user._id.toString() !== userId.toString()) {
        return res.status(400).json({ message: "Email already exists" });
      }
      const userr = await User.findById(userId);

      userr.email = email; 
      userr.fullName = fullName;
      const updatedUser = await userr.save();

    res.status(200).json(updatedUser);

  }
  catch (error) { 
    res.status(500).json({ message: "Internal Server Error" });
  }

};
exports.Authcheck = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};