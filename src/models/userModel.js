const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
