const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = require("config").get("jwtSecret");

// Call middleware to test if valid token before accessing the protected route
// @route GET api/auth
// @desc Protected route
// @access Public
router.get("/", auth, async (req, res) => {
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

// @route POST api/auth
// @desc Authenticate user and get token
// @access Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please include a password")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // if validation failed
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.errors });
    const { email, password } = req.body;
    try {
      // email
      const user = await User.findOne({ email: email });
      if (!user)
        return res
          .status(401)
          .json({ errors: [{ msg: "Invalid credentials" }] });

      // password
      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (!passwordIsValid)
        return res
          .status(401)
          .json({ errors: [{ msg: "Invalid credentials" }] });

      // return token
      const payload = { user: { id: user.id } };
      const token = await jwt.sign(payload, secret, { expiresIn: 3600 });
      res.json({ token });
    } catch (e) {
      console.log("Error: ", e);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
