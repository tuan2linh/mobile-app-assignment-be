const ApiResponse = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return ApiResponse.error(res, 'Validation Error', 400, err.errors);
  }
  
  if (err.code === 11000) {
    return ApiResponse.error(res, 'Duplicate Key Error', 400);
  }

  return ApiResponse.error(
    res,
    'Internal Server Error',
    500
  );
};

module.exports = errorHandler;
