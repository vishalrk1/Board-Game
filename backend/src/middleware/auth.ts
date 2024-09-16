import { NextFunction, Request, Response } from "express";
import Jwt from "jsonwebtoken";
import { verifyToken } from "utils/jwtUtils";

declare global {
  namespace Express {
    interface Request {
      user?: Jwt.JwtPayload;
    }
  }
}

// function to authenticate and check where the jwt token is valid or not
// this function will also add user data associated to that token in request
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authorization token in required" });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
