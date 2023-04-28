const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const restrictTo = require("../middlewares/restrictTo");

const validation = require("../middlewares/validations.middleware");
const mealsControllers = require("../controllers/meals.controllers");
const mealsMiddleware = require("../middlewares/meals.middleware");
const restaurantMiddleware = require("../middlewares/restaurants.middleware");

const router = express.Router();

router.get("/", mealsControllers.findAllMeals);

router.get("/:id", mealsMiddleware.mealExist, mealsControllers.findOneMeal);

router.use(protect, restrictTo("admin"));

router
  .route("/:id")
  .post(
    validation.createMealValidation,
    restaurantMiddleware.restaurantExist,
    mealsControllers.createMeal
  )
  .patch(
    validation.createMealValidation,
    mealsMiddleware.mealExist,
    mealsControllers.updateMeal
  )
  .delete(mealsMiddleware.mealExist, mealsControllers.deleteMeal);

module.exports = router;
