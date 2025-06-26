const express = require("express");
const deliveryController = require("../controller/delivery-assignCntroller");
const userController = require("../controller/control");
const router = express.Router();

router.put(
  "/addassignment",
  userController.ensureAuthenticated,
  deliveryController.addDelivery
);
router.get("/getdeliveries",userController.ensureAuthenticated,deliveryController.getalldeliveries);

module.exports = router;
