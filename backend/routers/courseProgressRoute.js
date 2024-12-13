const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  markAsInComplete,
  markAsComplete,
  updateLectureProgress,
  getCourseProgress,
} = require("../controllers/courseProgressController");
const router = express.Router();

router.post("/:courseId", isAuthenticated, getCourseProgress);
router.post(
  "/:courseId/lecture/:lectureId/view",
  isAuthenticated,
  updateLectureProgress
);
router.post("/:courseId/complete", isAuthenticated, markAsComplete);
router.post("/:courseId/incomplete", isAuthenticated, markAsInComplete);

module.exports = router;
