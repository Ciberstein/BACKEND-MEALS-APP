const Restaurant = require("./restaurants.model");
const Review = require("./reviews.model");
const Meal = require("./meals.model");
const User = require("./users.model");
const Order = require("./orders.model");

const initModel = () => {
  Restaurant.hasMany(Meal);
  Meal.belongsTo(Restaurant);

  Restaurant.hasMany(Review);
  Review.belongsTo(Restaurant);

  Meal.belongsTo(Order);
  Order.belongsTo(Meal);

  User.hasMany(Order);
  Order.belongsTo(User);

  User.hasMany(Review);
  Review.belongsTo(User);
};

module.exports = initModel;
