import { Request, Response, Router } from "express";
import { isAuth } from "../middlewares/isAuth";
import { Track } from "../models/Track";
const router = Router();

router.get("/tracks", isAuth, async (req: Request, res: Response) => {
  try {
    const tracks = await Track.find({ user: req.user?._id });
    res.send(tracks);
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

export { router as trackRoutes };
