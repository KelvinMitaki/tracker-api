import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

declare module "express" {
  export interface Request {
    user?: {
      email: string;
      password: string;
    };
  }
}

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ message: "unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      _id: string;
    };
    const user = await User.findById(payload._id);
    if (!user) {
      return res.status(401).send({ message: "unauthorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ message: "unauthorized" });
  }
};
