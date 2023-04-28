const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const Restaurant = require("../models/restaurants.model");
const Review = require("../models/reviews.model");
const Meal = require("../models/meals.model");

exports.restaurantExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findOne({
    where: {
      id,
      status: "active",
    },
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: [
      {
        model: Meal,
      },
    ],
  });

  if (!restaurant) {
    next(new AppError("Restaurant not found", 404));
  }

  req.restaurant = restaurant;

  next();
});

exports.reviewExist = catchAsync(async (req, res, next) => {
  const { restaurantId, id } = req.params;

  const restaurant = await Restaurant.findOne({
    where: {
      id: restaurantId,
      status: "active",
    },
  });

  if (!restaurant) {
    next(new AppError("Restaurant not found", 404));
  }

  const review = await Review.findOne({
    where: {
      id,
      restaurantId: restaurant.id,
    },
  });

  if (!review) {
    next(new AppError("Review not found", 404));
  }

  req.review = review;

  next();
});
