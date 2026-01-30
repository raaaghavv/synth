import express from "express";
import helmet from "helmet";

const app = express();

app.use(helmet());
app.use(express.json({ limit: "16kb" }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "welcome to synth!" });
});

export { app };
