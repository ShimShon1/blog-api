const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const app = express();

require("dotenv").config();

mongoose.connect(process.env.DB_LINK);
console.log(process.env.JWT_SECRET);

app.use("/api", indexRouter);

app.listen(process.env.PORT || 3000);