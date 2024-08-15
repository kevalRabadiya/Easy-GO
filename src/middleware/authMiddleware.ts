import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT } from "../helper/constants";
import logger from "../utils/logger";

declare module "express" {
  interface Request {
    user?: JwtPayload;
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader =
      req.headers["authorization"] || req.headers["Authorization"];
    const token = (authHeader as string)?.split(" ")[1];
    if (!token) {
      logger.info("No token found");
      return res.status(404).json({
        success: false,
        messaage: "No Token Found"
      });
    }
    const decode = jwt.verify(token, JWT.SECRET) as JwtPayload;
    if (!decode.role) {
      logger.info("Unable to decode token");
      return res.status(404).json({
        success: false,
        message: "Unable to Decode Token"
      });
    }
    req.user = decode;
    next();
  } catch (error) {
    logger.error("An error occured while verifying token! ", error);
    return res.status(500).json({
      success: false,
      message: "Error occured at verifying Token"
    });
  }
};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== "admin") {
      logger.warn("Protected route for admin only");
      return res.status(401).json({
        success: false,
        message: "Protected routes for admin only"
      });
    }
    next();
  } catch (error) {
    logger.error("Error occured at isAdmin middleware", error);
    logger.error(error);
    return res.status(500).json({
      success: false,
      message: "Error occured at isAdmin"
    });
  }
};

export { verifyToken, isAdmin };
