exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Access denied. Required role: Admin" });
  next();
};
exports.isUser = (req, res, next) => {
  if (req.user.role !== "user") return res.status(403).json({ error: "Access denied. Required role: User" });
  next();
};
