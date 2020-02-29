const express = require("express");
const app = express();
// Call method to config db
require("./config/db.js")();
// Look for an env var called PORT to use when deployed on Heroku
// Locally, run on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server stated on port ${PORT}`));
app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api/users/", require("./routes/api/users"));
app.use("/api/auth/", require("./routes/api/auth"));
app.use("/api/profile/", require("./routes/api/profile"));
app.use("/api/posts/", require("./routes/api/posts"));
