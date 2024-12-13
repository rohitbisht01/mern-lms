const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const router = express.Router();

router.post(
  "/checkout/create-checkout-session",
  isAuthenticated,
  createCheckoutSession
);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);
router.get(
  "/course/:courseId/details",
  isAuthenticated,
  getCourseDetailsWithPurchaseStatus
);
router.get("/", isAuthenticated, getAllPurchasedCourse);

module.exports = router;
