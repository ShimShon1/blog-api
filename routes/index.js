const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
router.post("/login", async function (req, res, next) {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(401).json({ msg: "unauthorized" });
  if (user.password !== req.body.password)
    return res.status(401).json({ msg: "unauthorized" });
  const token = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.json({ user, token });
});

module.exports = router;
