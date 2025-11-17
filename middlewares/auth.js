// Authentication middleware for JWT token verification
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { STATUS_UNAUTHORIZED } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  // Check if authorization header exists
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(STATUS_UNAUTHORIZED)
      .send({ message: "Authorization required" });
  }

  // Extract token by removing "Bearer " prefix
  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    // Verify token with JWT_SECRET
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    return res
      .status(STATUS_UNAUTHORIZED)
      .send({ message: "Authorization required" });
  }

  // Add payload to request object for use in controllers
  req.user = payload;
  return next(); // Continue to next middleware/controller
};

module.exports = auth;
