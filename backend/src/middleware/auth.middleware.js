import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(404).json({ message: "user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in auth middleware", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
