const Floor = require("../models/floor.model");
const Table = require("../models/table.model");
const ApiResponse = require("../utils/response");

exports.createFloor = async (req, res) => {
  try {
    const floor = await Floor.create(req.body);
    return ApiResponse.success(res, { floor }, "Floor created successfully", 201);
  } catch (err) {
    return ApiResponse.error(res, "Error creating floor", 400, err.message);
  }
};

exports.getAllFloors = async (req, res) => {
  try {
    const floors = await Floor.find();
    return ApiResponse.success(res, { floors }, "Floors retrieved successfully");
  } catch (err) {
    return ApiResponse.error(res, "Error retrieving floors", 500, err.message);
  }
};

exports.getFloor = async (req, res) => {
  try {
    const floor = await Floor.findById(req.params.id);
    if (!floor) {
      return ApiResponse.error(res, "Floor not found", 404);
    }
    
    // Get tables for this floor
    const tables = await Table.find({ floorId: floor._id });
    
    return ApiResponse.success(res, { floor, tables }, "Floor retrieved successfully");
  } catch (err) {
    return ApiResponse.error(res, "Error retrieving floor", 400, err.message);
  }
};

exports.updateFloor = async (req, res) => {
  try {
    const floor = await Floor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!floor) {
      return ApiResponse.error(res, "Floor not found", 404);
    }
    return ApiResponse.success(res, { floor }, "Floor updated successfully");
  } catch (err) {
    return ApiResponse.error(res, "Error updating floor", 400, err.message);
  }
};

exports.deleteFloor = async (req, res) => {
  try {
    const floor = await Floor.findByIdAndDelete(req.params.id);
    if (!floor) {
      return ApiResponse.error(res, "Floor not found", 404);
    }
    // Also delete all tables associated with this floor
    await Table.deleteMany({ floorId: floor._id });
    return ApiResponse.success(res, null, "Floor and its tables deleted successfully");
  } catch (err) {
    return ApiResponse.error(res, "Error deleting floor", 400, err.message);
  }
};
