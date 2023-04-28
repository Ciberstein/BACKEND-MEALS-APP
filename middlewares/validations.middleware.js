const { body, validationResult } = require("express-validator");

const validFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      errors: errors.mapped(),
    });
  }

  next();
};

exports.signupValidaton = [
  body("name").notEmpty().withMessage("Name cannot be empty"),
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Must be a valid email"),
  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 8 })
    .withMessage("Must be a least 8 characters"),
  validFields,
];

exports.loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Must be a valid email"),
  body("password").notEmpty().withMessage("Password cannot be empty"),
  validFields,
];

exports.updateUserValidation = [
  body("name").notEmpty().withMessage("Name cannot be empty"),
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Must be a valid email"),
  validFields,
];

exports.createRestaurantValidation = [
  body("name").notEmpty().withMessage("Name cannot be empty"),
  body("address").notEmpty().withMessage("Address cannot be empty"),
  body("rating")
    .notEmpty()
    .withMessage("Rating cannot be empty")
    .isNumeric()
    .withMessage("Must be a valid rating"),
  validFields,
];

exports.updateRestaurantValidation = [
  body("name").notEmpty().withMessage("Name cannot be empty"),
  body("address").notEmpty().withMessage("Address cannot be empty"),
  validFields,
];

exports.updateReviewValidation = [
  body("comment").notEmpty().withMessage("Comment cannot be empty"),
  body("rating")
    .notEmpty()
    .withMessage("Rating cannot be empty")
    .isNumeric()
    .withMessage("Must be a valid rating"),
  validFields,
];

exports.createMealValidation = [
  body("name").notEmpty().withMessage("Name cannot be empty"),
  body("price")
    .notEmpty()
    .withMessage("Price cannot be empty")
    .isNumeric()
    .withMessage("Must be a valid price"),
  validFields,
];

exports.createOrderValidation = [
  body("quantity")
    .notEmpty()
    .withMessage("Quantity cannot be empty")
    .isNumeric()
    .withMessage("Must be a valid price"),
  body("mealId").notEmpty().withMessage("mealId cannot be empty"),
  validFields,
];
