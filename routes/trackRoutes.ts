import { Request, Response, Router } from "express";
import { check } from "express-validator";
import { isAuth } from "../middlewares/isAuth";
import { validate } from "../middlewares/validation";
import { Track, TrackAttrs } from "../models/Track";
const router = Router();

router.get("/tracks", isAuth, async (req: Request, res: Response) => {
  try {
    const tracks = await Track.find({ user: req.user?._id });
    res.send(tracks);
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

router.post(
  "/tracks",
  isAuth,
  check("name").trim().notEmpty().withMessage("enter a valid name"),
  check("locations").isArray().notEmpty().withMessage("enter valid locations"),
  validate,
  async (req: Request, res: Response) => {
    try {
      const { name, locations } = req.body as TrackAttrs;
      const track = Track.build({ name, locations, user: req.user!._id });
      await track.save();
      res.send(track);
    } catch (error) {
      res.status(500).send({ message: error });
    }
  }
);

export { router as trackRoutes };
