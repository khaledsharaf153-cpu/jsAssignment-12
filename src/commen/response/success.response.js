export function successResponse({ res, statusCode = 200, msg = "done", data }) {
  res.status(statusCode).json({ msg, data });
}
