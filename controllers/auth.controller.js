const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ApiResponse = require("../utils/response");
const tokenBlacklist = require("../utils/tokenBlacklist");

exports.register = async (req, res) => {
  try {
    const { name, email, phone, address, avatar, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, address, avatar, password: hash });

    return ApiResponse.success(
      res,
      { user: user.toObject({ hide: "password" }) },
      "User registered successfully",
      201
    );
  } catch (err) {
    return ApiResponse.error(res, "Registration failed", 400, err.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return ApiResponse.error(res, "Invalid credentials", 401);
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return ApiResponse.success(res, {
      user: user.toObject({ hide: "password" }),
      token
    }, "Login successful");
  } catch (err) {
    return ApiResponse.error(res, "Login failed", 400, err.message);
  }
};

exports.logout = (req, res) => {
  try {
    const token = req.token;
    tokenBlacklist.add(token);
    return ApiResponse.success(res, null, "Logout successful");
  } catch (err) {
    return ApiResponse.error(res, "Logout failed", 400, err.message);
  }
};
