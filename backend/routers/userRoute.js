const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const upload = require("../utils/multer");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/profile", isAuthenticated, getUserProfile);
router.put(
  "/profile/update",
  isAuthenticated,
  upload.single("profilePhoto"),
  updateUserProfile
);

module.exports = router;
