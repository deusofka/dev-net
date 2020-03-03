const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");

// Call middleware to test if valid token before accessing the protected route
router.use(auth);
// Protected route
// @route GET api/auth
// @desc Test route
// @access Public
router.get("/", async (req, res) => {
  // Get user from User model
  try {
    // Could also use findOne() and pass in the id
    const user = await User.findById({ _id: req.user.id })
      .select("-__v")
      .select("-password");
    console.log("Matched from db:" + user);
    if (!user) {
      throw "Unable to find user in db";
    }
    res.send(user);
  } catch (e) {
    console.log("Error: " + e);
    res.status(500).send("Server error");
  }
});
module.exports = router;
