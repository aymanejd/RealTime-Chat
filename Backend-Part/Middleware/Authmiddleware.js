const jwt = require('jsonwebtoken');
const User = require('../Models/user');

async function verifyToken(req, res, next) {
    const token = req.cookies.jwt;
 console.log(token);
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, 'my-secret-key'); 
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; 
        next(); 
    } catch (error) {
        console.error("Error during token verification:", error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = verifyToken;
