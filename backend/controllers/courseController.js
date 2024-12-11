const Course = require("../models/courseModel");

const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;

    if (!courseTitle || !category) {
      return res.status(400).json({
        success: false,
        message: "Course title and category is required.",
      });
    }

    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id,
    });

    res.status(201).json({
      success: true,
      message: "Course created.",
      course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error creating course",
    });
  }
};

const getPublishedCourse = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true });

    if (courses) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error getting published course",
    });
  }
};

const searchCourse = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error searching courses",
    });
  }
};

const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await Course.find({
      creator: userId,
    });

    if (!courses) {
      return res.status(404).json({
        success: false,
        courses: [],
        message: "Courses not found",
      });
    }

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error getting courses",
    });
  }
};

module.exports = {
  createCourse,
  getPublishedCourse,
  searchCourse,
  getCreatorCourses,
};
