const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/users.model");

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token)
    next(
      new AppError("You are not logged in. Please login to get access", 401)
    );

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  const user = await User.findOne({
    where: {
      id: decoded.id,
      status: "active",
    },
  });

  if (!user)
    next(
      new AppError("The owner of this account it not longer avalaible", 401)
    );

  req.sessionUser = user;

  next();
});

exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  const { user, sessionUser } = req;

  if (user.id !== sessionUser.id)
    next(new AppError("You do not own of this account", 401));

  next();
});

exports.protectReviewOwner = catchAsync(async (req, res, next) => {
  const { review, sessionUser } = req;

  if (review.userId !== sessionUser.id) {
    return next(
      new AppError("You dont are owner of this review, you cant update it", 401)
    );
  }

  next();
});
