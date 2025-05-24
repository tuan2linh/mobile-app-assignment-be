class ApiResponse {
  static success(res, data = null, message = "Success", status = 200) {
    return res.status(status).json({
      success: true,
      message,
      data
    });
  }

  static error(res, message = "Error", status = 400, errors = null) {
    return res.status(status).json({
      success: false,
      message,
      errors
    });
  }
}

module.exports = ApiResponse;
