const express = require("express");
const router = express.Router();
const Profile = require("../../models/Profile");

// @route GET api/profiles/
// @desc get all profiles
// @access Private
router.get("/", async (req, res) => {
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
router.get("/:id", async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.id }).populate(
      "user",
      "name avatar"
    );
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
