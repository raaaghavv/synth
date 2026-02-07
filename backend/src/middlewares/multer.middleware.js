import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "./uploads";

    if (file.fieldname === "audioFile") {
      uploadPath = "./uploads/audio";
    } else if (file.fieldname === "coverImage") {
      uploadPath = "./uploads/images";
    } else if (file.fieldname === "videoFile") {
      uploadPath = "./uploads/video";
    }

    // Create directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });
