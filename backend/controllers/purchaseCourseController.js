const Stripe = require("stripe");
const Course = require("../models/courseModel");
const CoursePurchase = require("../models/coursePurchaseModel");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const newPurchase = new CoursePurchase({
      userId,
      courseId,
      amount: course.coursePrice,
      status: "pending",
    });

    const session = await stripe.checkout.session.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100, // Amount in paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/course-progress/${courseId}`, // once payment successful redirect to course progress page
      cancel_url: `http://localhost:5173/course-detail/${courseId}`,
      metadata: {
        courseId: courseId,
        userId: userId,
      },
      shipping_address_collection: {
        allowed_countries: ["IN"], // Optionally restrict allowed countries
      },
    });

    if (!session.url) {
      res.status(400).json({
        success: false,
        message: "Error while creating a session",
      });
    }

    newPurchase.paymentId = session.id;
    await newPurchase.save();

    res.status(200).json({
      success: true,
      url: session.url, // Return the Stripe checkout URL
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error creating checkout session",
    });
  }
};

const stripeWebhook = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error connecting with stripe webhook",
    });
  }
};

const getCourseDetailsWithPurchaseStatus = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    if (!course) {
      res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const purchased = await CoursePurchase.findOne({ userId, courseId });

    res.status(200).json({
      success: true,
      purchased: !!purchased,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error getting details of course with purchase status",
    });
  }
};

const getAllPurchasedCourse = async (req, res) => {
  try {
    const purchasedCourses = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");

    if (!purchasedCourses) {
      return res.status(404).json({
        success: false,
        purchasedCourses: [],
      });
    }

    res.status(200).json({
      success: false,
      purchasedCourses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error getting all purchased courses",
    });
  }
};

module.exports = {
  stripeWebhook,
  createCheckoutSession,
  getCourseDetailsWithPurchaseStatus,
  getAllPurchasedCourse,
};
