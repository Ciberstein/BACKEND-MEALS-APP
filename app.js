const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/error.controllers");

const usersRoutes = require("./routes/users.routes");
const restaurantsRoutes = require("./routes/restaurants.routes");
const mealsRoutes = require("./routes/meals.routes");
const ordersRoutes = require("./routes/orders.routes");

const app = express();

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in one hour!",
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(xss());
app.use(hpp());

app.use("/api/v1", limiter);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/restaurants", restaurantsRoutes);
app.use("/api/v1/meals", mealsRoutes);
app.use("/api/v1/orders", ordersRoutes);

app.all("*", (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
