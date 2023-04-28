const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const Order = require("../models/orders.model");

exports.existOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findOne({
    where: {
      id,
      status: "active",
    },
  });

  if (!order) {
    next(new AppError("Order not found", 404));
  }

  req.order = order;

  next();
});
