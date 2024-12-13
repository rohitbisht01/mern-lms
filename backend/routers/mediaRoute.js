const express = require("express");
const upload = require("../utils/multer");
const { uploadMedia } = require("../utils/cloudinary");
const router = express.Router();

router.post("/upload-video", upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMedia(req.file.path);
    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error uploading video",
    });
  }
});

module.exports = router;
