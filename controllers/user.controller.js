const User = require("../models/user.model");
const ApiResponse = require("../utils/response");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return ApiResponse.success(res, { users }, "Users retrieved successfully");
  } catch (err) {
    return ApiResponse.error(res, "Error retrieving users", 500, err.message);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return ApiResponse.success(res, { user }, "Profile retrieved successfully");
  } catch (err) {
    return ApiResponse.error(res, "Error retrieving profile", 500, err.message);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address, avatar },
      { new: true }
    ).select("-password");

    return ApiResponse.success(res, { user: updatedUser }, "Profile updated successfully");
  } catch (err) {
    return ApiResponse.error(res, "Error updating profile", 400, err.message);
  }
};
