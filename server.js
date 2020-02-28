const express = require("express");
const app = express();
// Look for an env var called PORT to use when deployed on Heroku
// Locally, run on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server stated on port ${PORT}`));
app.get("/", (req, res)=> {
  res.send("API running");
})
