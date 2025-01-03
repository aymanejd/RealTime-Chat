const jwt = require('jsonwebtoken');

exports.generateToken = (userId, res) => {
  const token = jwt.sign({ userId },'my-secret-key', {
    expiresIn: "10d",
  });

  res.cookie("jwt", token, {
    maxAge: 10 * 24 * 60 * 60 * 1000, 
    httpOnly: true, 
    sameSite: "strict", 
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
