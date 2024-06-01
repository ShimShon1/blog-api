const { body } = require("express-validator");

const titleValidation = body("title")
  .isString()
  .trim()
  .isLength(2)
  .withMessage("title must have at least 2 characters");
const contentValidation = body("content")
  .isString()
  .trim()
  .isLength(2)
  .withMessage("content must have at least 2 characters");

const userValidation = body("username")
  .isString()
  .trim()
  .isLength(2)
  .withMessage("username must have at least 2 characters");

const isPublicValidation = body("isPublic")
  .isBoolean()
  .withMessage("isPublic must be a Boolean");

//validate comment model
exports.commentValidation = [
  userValidation,
  titleValidation,
  contentValidation,
];
exports.postValidation = [
  isPublicValidation,
  titleValidation,
  contentValidation,
];
