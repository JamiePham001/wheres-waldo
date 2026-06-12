export function proxy(req, res) {
  res.status(404).json({ message: "Not Found" });
}
