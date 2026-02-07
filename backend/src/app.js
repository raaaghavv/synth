import express from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use("/uploads/images", express.static("uploads/images"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

import songRouter from "./routes/song.route.js";

app.use("/api/v1/songs", songRouter);

export { app };
