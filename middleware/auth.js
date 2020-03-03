const jwt = require("jsonwebtoken");
const secret = require("config").get("jwtSecret");

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.get("x-auth-token");

  // Check if no token
  if (!token) {
    return res
      .status(401)
      .json({ errors: [{ msg: "No token, authorization denied" }] });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, secret);
    console.log({ decoded });
    req.user = decoded.user;
    next();
  } catch (e) {
    console.log("Error: " + e);
    res.status(401).json({ errors: [{ msg: "Invalid token" }] });
  }
};
