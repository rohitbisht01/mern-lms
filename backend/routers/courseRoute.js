const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  createCourse,
  getPublishedCourse,
  searchCourse,
  getCreatorCourses,
} = require("../controllers/courseController");
const router = express();

router.post("/", isAuthenticated, createCourse);
router.get("/search", isAuthenticated, searchCourse);
router.get("/published-courses", getPublishedCourse);
router.get("/", isAuthenticated, getCreatorCourses);

module.exports = router;
