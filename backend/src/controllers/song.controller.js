import { Song } from "../models/song.model.js";
import { asyncHandler } from "../asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { parseFile } from "music-metadata";

export const uploadSong = asyncHandler(async (req, res) => {
  // validate req body
  // get image and audio path
  // add song in db
  // return response

  const { title, artist, album } = req.body;

  if ([title, artist, album].some((field) => field?.trim === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const localAudioFilePath = req.files?.audioFile[0]?.path;
  const localCoverImagePath = req.files?.coverImage[0]?.path;

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
    audioFile: localAudioFilePath,
  });

  const createdSong = await Song.findById(song._id).select("-audioFile -__v");

  if (!createdSong) {
    throw new ApiError(500, "Something went wrong while creating song");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdSong, "Song uploaded successfully"));
});

export const getAllSongs = asyncHandler(async (req, res) => {
  const songs = await Song.find().select("-audioFile -__v");

  if (songs.length === 0) {
    throw new ApiError(404, "No songs found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, songs, "Songs fetched successfully"));
});
