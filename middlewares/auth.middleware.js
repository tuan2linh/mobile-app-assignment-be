const jwt = require("jsonwebtoken");
const tokenBlacklist = require("../utils/tokenBlacklist");
const ApiResponse = require("../utils/response");

exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return ApiResponse.error(res, "No token provided", 403);
    }

    const token = authHeader.split(" ")[1];
    
    // Kiểm tra token có trong blacklist không
    if (tokenBlacklist.has(token)) {
      return ApiResponse.error(res, "Token has been invalidated", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return ApiResponse.error(res, "Invalid token", 401);
    }
    if (err.name === 'TokenExpiredError') {
      return ApiResponse.error(res, "Token expired", 401);
    }
    return ApiResponse.error(res, "Unauthorized", 401);
  }
};
