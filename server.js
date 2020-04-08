const express = require("express");
const app = express();
const path = require("path");
// Call method to config db
require("./config/db.js")();

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/users/", require("./routes/api/users"));
app.use("/api/auth/", require("./routes/api/auth"));
app.use("/api/profiles/", require("./routes/api/profiles"));
app.use("/api/profile/", require("./routes/api/profile"));
app.use("/api/github/", require("./routes/api/github"));
app.use("/api/posts/", require("./routes/api/posts"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));
  // Serve index.html file
  // * -- any other route other than the above
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Look for an env var called PORT to use when deployed on Heroku
// Locally, run on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server stated on port ${PORT}`));
