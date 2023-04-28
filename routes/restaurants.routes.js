const express = require("express");
const { protect } = require("../middlewares/auth.middleware");

const validation = require("../middlewares/validations.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const restaurantController = require("../controllers/restaurants.controllers");
const restaurantMiddleware = require("../middlewares/restaurants.middleware");

const router = express.Router();

router.get("/", restaurantController.findAllRestaurants);

router.get(
  "/:id",
  restaurantMiddleware.restaurantExist,
  restaurantController.findOneRestaurant
);

router.use(protect);

router.post(
  "/",
  validation.createRestaurantValidation,
  restaurantController.createRestaurant
);

router
  .route("/:id")
  .patch(
    restaurantMiddleware.restaurantExist,
    validation.updateRestaurantValidation,
    restaurantController.updateRestaurant
  )
  .delete(
    restaurantMiddleware.restaurantExist,
    restaurantController.deleteRestaurant
  );

router.post(
  "/reviews/:id",
  restaurantMiddleware.restaurantExist,
  restaurantController.createReview
);

router
  .route("/reviews/:restaurantId/:id")
  .patch(
    validation.updateReviewValidation,
    restaurantMiddleware.reviewExist,
    authMiddleware.protectReviewOwner,
    restaurantController.updateReview
  )
  .delete(
    restaurantMiddleware.reviewExist,
    authMiddleware.protectReviewOwner,
    restaurantController.deleteReview
  );

module.exports = router;
