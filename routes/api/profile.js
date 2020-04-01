const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");
const { check, validationResult } = require("express-validator/check");

// @route GET api/profile
// @desc get current user's profile
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
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
    res.status(500).send("Server error");
  }
});

// @route POST api/profile
// @desc create profile
// @access Private
router.post(
  "/",
  [
    auth,
    check("status", "Please include a status").notEmpty(),
    check("skills", "Please include skills").notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.errors });
    }
    let {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      twitter,
      facebook,
      linkedin,
      youtube,
      instagram
    } = req.body;
    skills = skills.split(",").map(skill => skill.trim());
    const social = {};
    social.twitter = twitter;
    social.facebook = facebook;
    social.linkedin = linkedin;
    social.youtube = youtube;
    social.instagram = instagram;
    const profile = {
      user: req.user.id,
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      social
    };
    try {
      await Profile.updateOne({ user: req.user.id }, profile, {
        upsert: true
      });
      res.json(
        await Profile.findOne({ user: req.user.id }).populate(
          "user",
          "name avatar"
        )
      );
    } catch (e) {
      console.log(e);
      res.status(500).send("Server Error");
    }
  }
);

// @route DELETE api/profile/
// @desc delete current profile and the associated user
// @access Private
router.delete("/", auth, async (req, res) => {
  try {
    // Remove posts
    await Post.deleteMany({user: req.user.id});
    // Remove profile
    await Profile.findOneAndDelete({ user: req.user.id });
    // Remove user
    const user = await User.findByIdAndDelete(req.user.id)
      .select("-__v")
      .select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ errors: [{ msg: "User does not exist!" }] });
    }
    res.json(user);
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server error");
  }
});

// @route POST /profile/experience
// @desc post experience
// @access Private
router.post(
  "/experience",
  [
    auth,
    [
      check("title", "Please include title")
        .ltrim()
        .notEmpty(),
      check("company", "Please include company")
        .ltrim()
        .notEmpty(),
      check("from", "Please include from")
        .ltrim()
        .notEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send({ errors: errors.errors });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;
    let experience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return res
          .status(404)
          .json({ errors: [{ msg: "Profile does not exist" }] });
      }
      profile.experience.unshift(experience);
      await profile.save();
      res.json(profile);
    } catch (e) {
      console.log(e);
      res.status(500).send("Server error");
    }
  }
);

// @route PUT /profile/experience/:id
// @desc update experience
// @access Private
router.put("/experience/:id", auth, async (req, res) => {
  const { title, company, location, from, to, current, description } = req.body;
  let experience = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  };
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Profile does not exist" }] });
    }
    let index;
    profile.experience.map((xp, i) => {
      console.log(xp.id, req.params.id);
      if (xp.id === req.params.id) {
        console.log(i);
        index = i;
        if (title) xp.title = experience.title;
        if (company) xp.company = experience.company;
        if (location) xp.location = experience.location;
        if (from) xp.from = experience.from;
        if (to) xp.to = experience.to;
        if (current) xp.current = experience.current;
        if (description) xp.description = experience.description;
      }
      return xp;
    });
    if (!index && index !== 0) {
      res.json({
        errors: [{ msg: "Experience matching the id does not exist" }]
      });
    } else {
      await profile.save();
      res.json(profile.experience[index]);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Server error");
  }
});

// @route DELETE /profile/experience/:id
// @desc delete experience
// @access Private
router.delete("/experience/:id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Profile does not exist" }] });
    }
    let index;
    profile.experience.forEach((xp, i) => {
      console.log(xp.id, req.params.id);
      if (xp.id === req.params.id) {
        console.log(i);
        index = i;
      }
      return xp;
    });
    if (!index && index !== 0) {
      res.json({
        errors: [{ msg: "Experience matching the id does not exist" }]
      });
    } else {
      profile.experience.splice(index, 1);
      res.json(profile);
      await profile.save();
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Server error");
  }
});

// @route POST /profile/education
// @desc post education
// @access Private
router.post(
  "/education",
  [
    auth,
    [
      check("school", "Please include title")
        .ltrim()
        .notEmpty(),
      check("degree", "Please include company")
        .ltrim()
        .notEmpty(),
      check("fieldofstudy", "Please include from")
        .ltrim()
        .notEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send({ errors: errors.errors });
    }
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;
    let education = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return res
          .status(404)
          .json({ errors: [{ msg: "Profile does not exist" }] });
      }
      profile.education.unshift(education);
      await profile.save();
      res.json(profile);
    } catch (e) {
      console.log(e);
      res.status(500).send("Server error");
    }
  }
);

// @route PUT /profile/education/:id
// @desc update education
// @access Private
router.put("/education/:id", auth, async (req, res) => {
  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body;
  let education = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  };
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Profile does not exist" }] });
    }
    let index;
    profile.education.map((eduSingular, i) => {
      console.log(eduSingular.id, req.params.id);
      if (eduSingular.id === req.params.id) {
        console.log(i);
        index = i;
        if (school) eduSingular.school = education.school;
        if (degree) eduSingular.degree = education.degree;
        if (fieldofstudy) eduSingular.fieldofstudy = education.fieldofstudy;
        if (from) eduSingular.from = education.from;
        if (to) eduSingular.to = education.to;
        if (current) eduSingular.current = education.current;
        if (description) eduSingular.description = education.description;
      }
      return eduSingular;
    });
    await profile.save();
    res.json(profile.education[index]);
  } catch (e) {
    console.log(e);
    res.status(500).send("Server error");
  }
});

// @route DELETE /profile/education/:id
// @desc delete education
// @access Private
router.delete("/education/:id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Profile does not exist" }] });
    }
    let index;
    profile.education.forEach((edu, i) => {
      console.log(edu.id, req.params.id);
      if (edu.id === req.params.id) {
        console.log(i);
        index = i;
      }
      return edu;
    });
    if (!index && index !== 0) {
      res.json({
        errors: [{ msg: "Education matching the id does not exist" }]
      });
    } else {
      profile.education.splice(index, 1);
      res.json(profile);
      await profile.save();
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Server error");
  }
});
module.exports = router;
