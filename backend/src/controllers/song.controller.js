import { Song } from "../models/song.model.js";
import { asyncHandler } from "../asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { parseFile } from "music-metadata";
import path from "node:path";
import fs from "node:fs";

export const uploadSong = asyncHandler(async (req, res) => {
  // validate req body
  // get image and audio path
  // add song in db
  // return response

  const { title, artist, album } = req.body;

  if ([title, artist, album].some((field) => field?.trim === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const localAudioFilePath = req.files?.audioFile?.[0]?.path;
  const localCoverImagePath = req.files?.coverImage?.[0]?.path;
  const localVideoFilePath = req.files?.videoFile?.[0]?.path;

  if (!localAudioFilePath) {
    throw new ApiError(400, "Audio file is required");
  }

  const metadata = await parseFile(localAudioFilePath);

  const duration = Math.floor(metadata?.format?.duration);

  if (!duration) {
    throw new ApiError(400, "Invalid audio file");
  }

  const song = await Song.create({
    title: title.trim(),
    artist: artist.trim(),
    album: album.trim(),
    coverImage: localCoverImagePath,
    duration,
    hasVideo: !!localVideoFilePath,
    audioFile: localAudioFilePath,
    videoFile: localVideoFilePath,
  });

  const createdSong = await Song.findById(song._id).select(
    "-audioFile -videoFile -__v"
  );

  if (!createdSong) {
    throw new ApiError(500, "Something went wrong while creating song");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdSong, "Song uploaded successfully"));
});

export const getAllSongs = asyncHandler(async (req, res) => {
  const songs = await Song.find().select("-audioFile -videoFile -__v");

  return res
    .status(200)
    .json(new ApiResponse(200, songs, "Songs fetched successfully"));
});

export const streamSong = asyncHandler(async (req, res) => {
  const { songId } = req.params;
  const { type } = req.query;

  if (!songId) {
    throw new ApiError(400, "Song ID is required");
  }

  if (typeof songId !== "string") {
    throw new ApiError(400, "Invalid song ID");
  }

  if (type !== "audio" && type !== "video") {
    throw new ApiError(400, "Invalid type");
  }

  let file;
  if (type === "audio") {
    const { audioFile } = await Song.findById(songId).select("audioFile");
    file = audioFile;
  } else if (type === "video") {
    const { videoFile } = await Song.findById(songId).select("videoFile");
    file = videoFile;
  }

  if (!file) {
    throw new ApiError(404, "Song not found");
  }

  const PROJECT_ROOT = path.join(import.meta.dirname, "../../");
  const filePath = path.join(PROJECT_ROOT, file);

  const stat = fs.statSync(filePath);
  const fileSize = stat?.size;

  if (!fileSize) {
    throw new ApiError(404, "Song not found");
  }

  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;
    const fileStream = fs.createReadStream(filePath, { start, end });

    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "audio/mpeg",
    };

    res.writeHead(206, head);
    fileStream.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "audio/mpeg",
    };

    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});
