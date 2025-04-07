import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth";

export const verifyAuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new Error("Token Not Found");
      }
      const token = authHeader.split(' ')[1];
      const payload = verifyToken(token);

      if (payload == null) {
        throw new Error("Invalid Token");
      }
      next();
    } catch (error) {
      res.status(401).json(error)
    }
  }