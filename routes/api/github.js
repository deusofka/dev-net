const express = require("express");
const router = express.Router();
const githubToken = require("config").get("githubToken");
const axios = require("axios");

// @route GET /profile/github
// @desc get github repos
// @access Public
router.get("/:username", async (req, res) => {
  try {
    const result = await axios.get(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`,
      {
        headers: {
          "user-agent": "node.js",
          Authorization: `token ${githubToken}`
        }
      }
    );
    res.json(result.data);
  } catch (e) {
    if (e.response.status === 404) {
      return res.status(404).json({
        errors: [{ msg: "Github profile matching the id does not exist" }]
      });
    }
    res.status(500).send("Server error");
  }
});
module.exports = router;
