const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  /* Shorthand for:

    avatar: {
      type: String
    }
*/
  avatar: String,
  date: {
    type: Date,
    default: Date.now
  }
});
// Two arguments:
module.exports = mongoose.model("User", userSchema);
