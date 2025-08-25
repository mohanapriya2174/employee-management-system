const express = require("express");
const userController = require("../controller/control");
const deliveryController = require("../del-assignment/geo-control");
const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get(
  "/dashboard",
  userController.ensureAuthenticated,
  userController.newPage
);
router.get(
  "/getleaveapp",
  userController.ensureAuthenticated,
  userController.leaves
);
router.put(
  "/addleave",
  userController.ensureAuthenticated,
  userController.addLeave
);
router.put(
  "/approve",
  userController.ensureAuthenticated,
  userController.approve
);
router.post(
  "/getattendence",
  userController.ensureAuthenticated,
  userController.attendence
);

router.put(
  "/updateAttendence",
  userController.ensureAuthenticated,
  userController.updateAttendence
);

router.get("/assign", deliveryController.assignDeliveries);

module.exports = router;
