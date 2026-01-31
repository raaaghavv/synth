import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    album: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    duration: {
      type: Number,
      required: true,
    },
    audioFile: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Song = mongoose.model("song", songSchema);
