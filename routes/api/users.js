const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const secret = require("config").get("jwtSecret");
const auth = require("../../middleware/auth");

// @route POST api/users
// @desc Register user
// @access Public
router.post(
  "/",
  // Validator
  [
    check("name", "Please include a name")
      .ltrim()
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please include a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    // 1. Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.errors });
    }
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      // 2. See if the user does not already exist
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already registered!" }] });
      }
      // 3. Get users gravatar
      // size, rating, default (mp: mystery person)
      const avatar = gravatar.url(email, { s: 200, r: "pg", d: "mp" });
      // 4. Encrypt password with bcrypt: Pass salt rounds (10) in the second field
      const hash = await bcrypt.hash(password, 10);
      user = new User({ name, email, avatar, password: hash });
      // 5. Save user to the db
      await user.save();
      // 6. Return jsonwebtoken
      const payload = { user: { id: user.id } };
      const token = await jwt.sign(
        // You can use id with mongoose even though it's _id in the db
        payload,
        secret,
        {
          expiresIn: 3600
        }
      );
      return res.json({ token });
    } catch (e) {
      console.error("Error message: " + e.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
