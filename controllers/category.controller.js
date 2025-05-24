const Category = require("../models/category.model");
const Food = require("../models/food.model");
const ApiResponse = require("../utils/response");

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    return ApiResponse.success(res, { category }, "Category created successfully", 201);
  } catch (err) {
    return ApiResponse.error(res, "Error creating category", 400, err.message);
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return ApiResponse.success(res, { categories }, "Categories retrieved successfully");
  } catch (err) {
    return ApiResponse.error(res, "Error retrieving categories", 500, err.message);
  }
};

exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return ApiResponse.error(res, "Category not found", 404);
    }

    // Fetch foods belonging to this category
    const foods = await Food.find({ categoryId: category._id });
    
    return ApiResponse.success(
      res, 
      { 
        category, 
        foods 
      }, 
      "Category and its foods retrieved successfully"
    );
  } catch (err) {
    return ApiResponse.error(res, "Error retrieving category", 400, err.message);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!category) {
      return ApiResponse.error(res, "Category not found", 404);
    }
    return ApiResponse.success(res, { category }, "Category updated successfully");
  } catch (err) {
    return ApiResponse.error(res, "Error updating category", 400, err.message);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return ApiResponse.error(res, "Category not found", 404);
    }
    return ApiResponse.success(res, null, "Category deleted successfully");
  } catch (err) {
    return ApiResponse.error(res, "Error deleting category", 400, err.message);
  }
};
