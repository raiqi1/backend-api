import jwt from "jsonwebtoken";
import { prisma } from "../config/database.js";

// Authentication middleware
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token diperlukan",
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if user still exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, role: true },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Token tidak valid",
        });
      }

      req.user = decoded;
      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid",
      });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Authorization middleware for admin only
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak. Hanya admin yang diizinkan",
    });
  }
  next();
};

// Authorization middleware for user or admin
export const requireUserOrAdmin = (req, res, next) => {
  if (req.user.role !== "USER" && req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak",
    });
  }
  next();
};
