import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

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
    const userId = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).send({ message: "unauthorized" });
    }
    next();
  } catch (error) {
    res.status(401).send({ message: "unauthorized" });
  }
};
