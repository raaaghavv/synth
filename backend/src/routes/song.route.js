import { Router } from "express";
import {
  uploadSong,
  getAllSongs,
  streamSong,
} from "../controllers/song.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(getAllSongs);

router.route("/upload").post(
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "audioFile", maxCount: 1 },
    { name: "videoFile", maxCount: 1 },
  ]),
  uploadSong
);

router.route("/:songId/stream").get(streamSong);

export default router;
