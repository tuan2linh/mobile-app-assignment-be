const Food = require("../models/food.model");
const ApiResponse = require("../utils/response");

exports.createFood = async (req, res) => {
  try {
    const food = await Food.create(req.body);
    const populatedFood = await food.populate("categoryId", "name image");
    return ApiResponse.success(res, { food: populatedFood }, "Food created successfully", 201);
  } catch (err) {
    return ApiResponse.error(res, "Error creating food", 400, err.message);
  }
};

exports.getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find().populate("categoryId", "name image");
    return ApiResponse.success(res, { foods }, "Foods retrieved successfully");
  } catch (err) {
    return ApiResponse.error(res, "Error retrieving foods", 500, err.message);
  }
};

exports.getFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate("categoryId", "name image");
    if (!food) {
      return ApiResponse.error(res, "Food not found", 404);
    }
    return ApiResponse.success(res, { food }, "Food retrieved successfully");
  } catch (err) {
    return ApiResponse.error(res, "Error retrieving food", 400, err.message);
  }
};

exports.updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("categoryId", "name image");
    if (!food) {
      return ApiResponse.error(res, "Food not found", 404);
    }
    return ApiResponse.success(res, { food }, "Food updated successfully");
  } catch (err) {
    return ApiResponse.error(res, "Error updating food", 400, err.message);
  }
};

exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return ApiResponse.error(res, "Food not found", 404);
    }
    return ApiResponse.success(res, null, "Food deleted successfully");
  } catch (err) {
    return ApiResponse.error(res, "Error deleting food", 400, err.message);
  }
};
