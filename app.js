const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const User = require("./models/User");
const Post = require("./models/Post");
const cors = require("cors");
const app = express();

require("dotenv").config();

mongoose.connect(process.env.DB_LINK);
app.use(express.json());
app.use(cors());

app.use("/api", indexRouter);

app.listen(process.env.PORT || 3000);
