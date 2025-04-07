import Jwt, { JwtPayload } from "jsonwebtoken";

export const verifyToken = (token: string): JwtPayload | null => {
    try {
        return Jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    } catch (error) {
        return null;
    }
  }