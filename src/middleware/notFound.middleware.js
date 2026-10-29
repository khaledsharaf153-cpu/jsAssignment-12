export function notFoundMiddleware(req, res) {
  res.status(404).json({ msg: "Not found" });
}
