const mongoose = require("mongoose");

const feedSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    describe: {
      type: String,
      max: 500,
    },
    image: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("feeds", feedSchema);
