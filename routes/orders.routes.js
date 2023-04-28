const express = require("express");
const { protect } = require("../middlewares/auth.middleware");

const validation = require("../middlewares/validations.middleware");
const ordersControllers = require("../controllers/orders.controllers");
const ordersMiddlewares = require("../middlewares/orders.middleware");

const router = express.Router();

router.use(protect);

router.post(
  "/",
  validation.createOrderValidation,
  ordersControllers.createOrder
);

router.get("/me", ordersControllers.findAllUserOrders);

router
  .route("/:id")
  .patch(ordersMiddlewares.existOrder, ordersControllers.updateOrder)
  .delete(ordersMiddlewares.existOrder, ordersControllers.deleteOrder);

module.exports = router;
