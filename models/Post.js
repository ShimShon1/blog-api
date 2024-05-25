const { default: mongoose } = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  isPublic: { type: Boolean, required: true },
  comments: [
    {
      type: {
        title: { type: String, required: true },
        content: { type: String, required: true },
      },
      required: true,
    },
  ],
});

module.exports = mongoose.model("Post", PostSchema);
