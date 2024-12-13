const CourseProgress = require("../models/courseProgressModel");
const Course = require("../models/courseModel");

const getCourseProgress = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.id;

    let courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    }).populate("courseId");

    const courseDetails = await Course.findById(courseId).populate("lectures");
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!courseProgress) {
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          progress: [],
          completed: false,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error getting course progress",
    });
  }
};

const updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;

    let courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress) {
      // no progress exists
      courseProgress = new CourseProgress({
        userId,
        courseId,
        completed: false,
        lectureProgress: [],
      });
    }

    const lectureIndex = courseProgress.lectureProgress.findIndex(
      (lecture) => lecture.lectureId === lectureId
    );

    // lecture exists update its status
    if (lectureId !== -1) {
      courseProgress.lectureProgress[lectureIndex].viewed = true;
    } else {
      // add new lecture progress
      courseProgress.lectureProgress.push({
        lectureId,
        viewed: true,
      });
    }

    // all lectures are complete
    const lectureProgressLength = courseProgress.lectureProgress.filter(
      (lecturePro) => lecturePro.viewed
    ).length;

    const course = await Course.findById(courseId);
    if (course.lectures.length === lectureProgressLength) {
      courseProgress.completed = true;
    }

    await courseProgress.save();

    res.status(200).json({
      success: true,
      message: "Lecture progress updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error updating course lecture progress",
    });
  }
};

const markAsComplete = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.id;

    const courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course progress not found",
      });
    }

    courseProgress.lectureProgress.map(
      (lectureProgress) => (lectureProgress.viewed = true)
    );
    courseProgress.completed = true;
    await courseProgress.save();
    res.status(200).json({
      success: true,
      message: "Course marked as completed",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error marking as completed",
    });
  }
};

const markAsInComplete = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.id;

    const courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course progress not found",
      });
    }

    courseProgress.lectureProgress.map(
      (lectureProgress) => (lectureProgress.viewed = false)
    );
    courseProgress.completed = false;
    await courseProgress.save();
    res.status(200).json({
      success: true,
      message: "Course marked as incompleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error marking as completed",
    });
  }
};

module.exports = {
  getCourseProgress,
  updateLectureProgress,
  markAsComplete,
  markAsInComplete,
};
