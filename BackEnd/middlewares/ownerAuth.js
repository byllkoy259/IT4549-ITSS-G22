import jwt from "jsonwebtoken";

export const ownerAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ Error: "Bạn chưa đăng nhập" });
  try {
    const decoded = jwt.verify(token, "jwt_secret_key");
    req.ownerEmail = decoded.email; // Đúng tên trường
    next();
  } catch (err) {
    return res.status(401).json({ Error: "Token hết hạn hoặc không hợp lệ" });
  }
};
