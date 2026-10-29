export function GlobalErrorHandler(error, req, res, next) {
  res.status(error.cause?.statusCode || 500).json({
    errMsg: error.message,
    errStack: error.stack,
    issues: error.cause?.issues,
  });
}
