import { Router } from "express";
import { uploadSong } from "../controllers/song.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get((req, res) => {
  res.status(200).json({ message: "welcome to synth!" });
});

router.route("/upload").post(
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "audioFile", maxCount: 1 },
  ]),
  uploadSong
);

export default router;
