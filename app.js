const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const User = require("./models/User");
const Post = require("./models/Post");
const app = express();

require("dotenv").config();

mongoose.connect(process.env.DB_LINK);
app.use(express.json());
console.log(process.env.JWT_SECRET);

// Post.create({
//   title: "hello i'm private",
//   content: "what what what ",
//   date: new Date(),
//   isPublic: true,
//   comments: [
//     {
//       username: "me",
//       title: "comment",
//       content: "some content for that comment huh",
//     },

//     {
//       username: "me",
//       title: "comment",
//       content: "some content for that comment huh",
//     },
//   ],
// });

app.use("/api", indexRouter);

app.listen(process.env.PORT || 3000);
