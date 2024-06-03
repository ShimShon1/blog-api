const express = require("express");
const mongoose = require("mongoose");
const PostsRouter = require("./routes/posts");
const IndexRouter = require("./routes/index");
const ProtectedPostsRouter = require("./routes/postsProtected");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Post = require("./models/Post");
const cors = require("cors");
const app = express();

require("dotenv").config();

mongoose.connect(process.env.DB_LINK);
app.use(express.json());
app.use(cors());

async function verifyUser(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verify;
    return next();
  } catch (error) {
    return next();
  }
}

app.use(verifyUser);

app.use("/api/posts", PostsRouter);
app.use("/api", IndexRouter);
app.use("/api/protected/posts", ProtectedPostsRouter);

app.listen(process.env.PORT || 3000);
