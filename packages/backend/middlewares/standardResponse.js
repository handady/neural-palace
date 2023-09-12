function standardResponse(req, res, next) {
  res.standard = (statusCode, data, message) => {
    res.status(statusCode).json({
      status: statusCode === 200 ? "success" : "fail",
      code: statusCode,
      data: data,
      message: message,
    });
  };
  next();
}

module.exports = standardResponse;
