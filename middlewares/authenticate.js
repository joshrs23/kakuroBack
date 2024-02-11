const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET; 

function authenticate(req, res, next) {

  const token = req.header('Authorization');

  if (!token) {
    return res.json({success: false,error: "Missing token",});
  }

  try {

    const decodedToken = jwt.verify(token.split(' ')[1], secretKey);
    req.user = decodedToken;
    next();

  } catch (error) {
    
    return res.json({success: false,error: "Invalid token",});
  }
}

module.exports = authenticate;