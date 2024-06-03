const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
router.post("/login", async function (req, res, next) {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(401).json({ msg: "unauthorized" });
  if (user.password !== req.body.password)
    return res.status(401).json({ msg: "unauthorized" });
  const token = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: 60 * 60,
  });
  res.json({ user, token });
});

router.get("/verify", async function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verify = await jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ user: verify });
  } catch (error) {
    return res.status(401).json({ msg: "no user" });
  }
});

module.exports = router;
