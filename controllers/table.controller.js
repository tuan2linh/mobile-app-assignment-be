const Table = require("../models/table.model");
const ApiResponse = require("../utils/response");

exports.createTable = async (req, res) => {
  try {
    const table = await Table.create(req.body);
    const populatedTable = await table.populate("floorId", "name");
    return ApiResponse.success(res, { table: populatedTable }, "Table created successfully", 201);
  } catch (err) {
    return ApiResponse.error(res, "Error creating table", 400, err.message);
  }
};

exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().populate("floorId", "name");
    return ApiResponse.success(res, { tables }, "Tables retrieved successfully");
  } catch (err) {
    return ApiResponse.error(res, "Error retrieving tables", 500, err.message);
  }
};

exports.getTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id).populate("floorId", "name");
    if (!table) {
      return ApiResponse.error(res, "Table not found", 404);
    }
    return ApiResponse.success(res, { table }, "Table retrieved successfully");
  } catch (err) {
    return ApiResponse.error(res, "Error retrieving table", 400, err.message);
  }
};

exports.updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("floorId", "name");
    if (!table) {
      return ApiResponse.error(res, "Table not found", 404);
    }
    return ApiResponse.success(res, { table }, "Table updated successfully");
  } catch (err) {
    return ApiResponse.error(res, "Error updating table", 400, err.message);
  }
};

exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) {
      return ApiResponse.error(res, "Table not found", 404);
    }
    return ApiResponse.success(res, null, "Table deleted successfully");
  } catch (err) {
    return ApiResponse.error(res, "Error deleting table", 400, err.message);
  }
};
