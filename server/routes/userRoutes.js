const express = require("express");
const { protect } = require("../backend/middleware/authMiddleware");

const {
  registerUser,
  authUser,
  allUser,
} = require("../controller/userController");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUser);
router.post("/login", authUser);

module.exports = router;
