import { Router } from "express";
import { uploadSong } from "../controllers/song.controller.js";

const router = Router();

router.route("/").get((req, res) => {
  res.status(200).json({ message: "welcome to synth!" });
});

router.route("/upload").post(uploadSong);

export default router;
