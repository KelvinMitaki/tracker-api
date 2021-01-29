import { Router } from "express";

const router = Router();

router.post("/signup", async (req, res) => {
  res.send("post req");
});

export { router as authRoutes };
