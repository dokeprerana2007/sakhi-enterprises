import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  const userId = req.cookies.userId;
  if (!userId) {
    return res.status(401).json({ message: "Please login" });
  }

  const user = await User.findById(userId).select("-password");
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  req.user = user;
  next();
};

export default authMiddleware;
