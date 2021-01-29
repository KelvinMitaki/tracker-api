import { Router } from "express";
import { check } from "express-validator";
import { validate } from "../middlewares/validation";
import bcrypt from "bcrypt";
import { User, UserDoc } from "../models/User";
import jwt from "jsonwebtoken";

const router = Router();

router.post(
  "/signup",
  check("email").trim().isEmail().withMessage("enter a valid email"),
  check("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("password must be six characters min"),
  validate,
  async (req, res) => {
    try {
      const { email, password } = req.body as { [key: string]: string };
      const userExists = await User.exists({ email });
      if (userExists) {
        return res
          .status(403)
          .send({ message: "user with that email already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.build({
        email: email.toLowerCase(),
        password: hashedPassword
      });
      await user.save();
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!);
      res.send({ token });
    } catch (error) {
      res.status(500).send({ message: error });
    }
  }
);

router.post(
  "/signin",
  check("email").trim().isEmail().withMessage("enter a valid email"),
  check("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("password must be six characters min"),
  validate,
  async (req, res) => {
    try {
      const { email, password } = req.body as { [key: string]: string };
      const user = (await User.findOne({
        email: email.toLowerCase()
      })) as UserDoc | null;
      if (!user) {
        return res.status(401).send({ message: "Invalid email or password" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).send({ message: "Invalid email or password" });
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!);
      res.send({ token });
    } catch (error) {
      res.status(500).send({ message: error });
    }
  }
);

export { router as authRoutes };
