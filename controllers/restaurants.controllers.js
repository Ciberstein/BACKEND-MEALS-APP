const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const Restaurant = require("../models/restaurants.model");
const Review = require("../models/reviews.model");

// FIND ALL RESTAURANTS //

exports.findAllRestaurants = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurant.findAll({
    where: {
      status: "active",
    },
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });

  if (!restaurants) {
    next(new AppError("No restaurants found", 404));
  }

  res.status(200).json({
    status: "success",
    results: restaurants.length,
    restaurants,
  });
});

// FIND ONE RESTAURANT //

exports.findOneRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  res.status(200).json({
    status: "success",
    restaurant,
  });
});

// CREATE RESTAURANT //

exports.createRestaurant = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;

  const restaurant = await Restaurant.create({
    name: name.toLowerCase(),
    address: address.toLowerCase(),
    rating,
  });

  res.status(201).json({
    status: "success",
    message: "Restaurant has been created",
    restaurant,
  });
});

// UPDATE RESTAURANT //

exports.updateRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  const { name, address } = req.body;

  await restaurant.update({
    name: name.toLowerCase(),
    address: address.toLowerCase(),
  });

  res.status(200).json({
    status: "success",
    message: "Restaurant has been update",
  });
});

// DELETE RESTAURANT //

exports.deleteRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  await restaurant.update({
    status: "disabled",
  });

  res.status(200).json({
    status: "success",
    message: "Restaurant has been removed",
  });
});

// CREATE REVIEW //

exports.createReview = catchAsync(async (req, res, next) => {
  const { comment, rating } = req.body;
  const { sessionUser, restaurant } = req;

  const review = await Review.create({
    comment,
    rating,
    userId: sessionUser.id,
    restaurantId: restaurant.id,
  });

  res.status(201).json({
    status: "success",
    message: "The review has been created",
    review,
  });
});

// UPDATE REVIEW //

exports.updateReview = catchAsync(async (req, res, next) => {
  const { comment, rating } = req.body;
  const { review } = req;

  await review.update({
    comment,
    rating,
  });

  res.status(200).json({
    status: "success",
    message: "Review has been update",
  });
});

// DELETE REVIEW //

exports.deleteReview = catchAsync(async (req, res, next) => {
  const { review } = req;

  await review.update({
    status: "deleted",
  });

  res.status(200).json({
    status: "success",
    message: "Review has been deleted",
  });
});
