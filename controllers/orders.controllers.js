const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const Meal = require("../models/meals.model");
const User = require("../models/users.model");
const Order = require("../models/orders.model");

// CREATE ORDER //

exports.createOrder = catchAsync(async (req, res, next) => {
  const { quantity, mealId } = req.body;
  const { sessionUser } = req;

  const meal = await Meal.findOne({
    where: {
      id: mealId,
      status: "active",
    },
  });

  if (!meal) {
    next(new AppError("Meal not found", 404));
  }

  const order = await Order.create({
    quantity,
    mealId,
    userId: sessionUser.id,
    totalPrice: meal.price * quantity,
  });

  res.status(201).json({
    status: "success",
    message: "Order has been created succesfully!",
    order,
    meal,
  });
});

// FIND ALL USER ORDERS //

exports.findAllUserOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const user = await User.findOne({
    where: {
      id: sessionUser.id,
      status: "active",
    },
    attributes: ["id", "name", "email", "role"],
    include: [
      {
        model: Order,
        attributes: ["id", "mealId", "totalPrice", "quantity"],
        include: [
          {
            model: Meal,
            attributes: ["id", "name", "price", "restaurantId"],
          },
        ],
      },
    ],
  });

  if (!user) next(new AppError("User not found", 404));

  res.status(200).json({
    status: "success",
    user,
  });
});

// UPDATE ORDER //

exports.updateOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({
    status: "completed",
  });

  res.status(200).json({
    status: "success",
    message: "Order has been update successfully",
  });
});

// DELETE ORDER //

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({
    status: "cancelled",
  });

  res.status(200).json({
    status: "success",
    message: "Order has been cancelled",
  });
});
