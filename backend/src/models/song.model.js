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
    hasVideo: {
      type: Boolean,
      default: false,
    },
    audioFile: {
      type: String,
      required: true,
    },
    videoFile: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

export const Song = mongoose.model("song", songSchema);
