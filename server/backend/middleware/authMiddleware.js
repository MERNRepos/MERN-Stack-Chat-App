const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "tejas");

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      console.log("protect Error", error);
      throw new Error("Not authorized, token failed 1");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

module.exports = { protect };
