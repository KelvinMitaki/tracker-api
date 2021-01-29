import { Router } from "express";
import { check } from "express-validator";
import { validate } from "../middlewares/validation";
import bcrypt from "bcrypt";
import { User } from "../models/User";

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
      res.send(user);
    } catch (error) {
      res.status(501).send({ message: error });
    }
  }
);

export { router as authRoutes };
