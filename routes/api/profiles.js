const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const { check, validationResult } = require("express-validator/check");

// @route GET api/profiles/
// @desc get all profiles
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    const profiles = await Profile.find({}).populate("user", "name avatar");
    res.json(profiles);
  } catch (e) {
    console.log(e);
    res.status(500).send("Server error");
  }
});

// @route GET api/profiles/:id
// @desc get specific profile
// @access Private
router.get("/:id", auth, async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Profile does not exist" }] });
    }
    res.json(profile);
  } catch (e) {
    console.log(e);
    if (e.name === "CastError") {
      return res
        .status(404)
        .json({ errors: [{ msg: "Profile does not exist" }] });
    }
    res.status(500).send("Server error");
  }
});
module.exports = router;
