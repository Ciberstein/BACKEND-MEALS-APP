const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const generateJWT = require("../utils/jwt");

const User = require("../models/users.model");
const Order = require("../models/orders.model");
const Meal = require("../models/meals.model");

const bcrypt = require("bcryptjs");

// USER SIGNUP //

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password: encryptedPassword,
    role,
  });

  const token = await generateJWT(user.id);

  res.status(200).json({
    status: "success",
    message: "User has been created",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// USER LOGIN //

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email,
      status: "active",
    },
  });

  if (!user) next(new AppError("User not found", 401));

  if (!(await bcrypt.compare(password, user.password)))
    next(new AppError("Incorrect email or password", 401));

  const token = await generateJWT(user.id);

  res.status(201).json({
    status: "success",
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

// UPDATE USER //

exports.updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, email } = req.body;

  await user.update({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
  });

  res.status(200).json({
    status: "success",
    message: "The user has been update",
  });
});

// DELETE USER //

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;

  await user.update({
    status: "disabled",
  });

  res.status(200).json({
    status: "success",
    message: `User with id:${id} has been delete successfully`,
  });
});

// FIN ALL ORDERS //

exports.findAllOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const user = await User.findOne({
    where: {
      id: sessionUser.id,
      status: "active",
    },
    attributes: ["id", "name", "email"],
    include: [
      {
        model: Order,
        attributes: ["id", "mealId", "totalPrice", "quantity", "status"],
        include: [
          {
            model: Meal,
            attributes: ["id", "name", "price"],
            include: [
              {
                model: Restaurant,
                attributes: ["id", "name", "address", "rating"],
              },
            ],
          },
        ],
      },
    ],
  });

  if (!user) {
    next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    user,
  });
});

// FIND ONE ORDER //

exports.findOneOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const { sessionUser } = req;

  const order = await Order.findOne({
    where: {
      id,
      userId: sessionUser.id,
      status: status,
    },
    include: [
      {
        model: Meal,
        attributes: ["id", "name", "price"],
        include: [
          {
            model: Restaurant,
            attributes: ["id", "name", "address", "rating"],
          },
        ],
      },
    ],
  });

  if (!order) {
    next(new AppError(`The user does not own the order with id:${id}`, 404));
  }

  res.status(200).json({
    status: "success",
    order,
  });
});
