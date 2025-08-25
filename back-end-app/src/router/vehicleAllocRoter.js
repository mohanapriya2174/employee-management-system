const express = require("express");
const vehicleAllocController = require("../controller/vehicleAllocColtrol");
const userController = require("../controller/control");
const router = express.Router();

router.get(
  "/employees",
  userController.ensureAuthenticated,
  vehicleAllocController.getEmployees
);

router.get(
  "/vehicles",
  userController.ensureAuthenticated,
  vehicleAllocController.getVehicles
);

router.get(
  "/vehiallocations",
  userController.ensureAuthenticated,
  vehicleAllocController.getVehicleAlloc
);
module.exports = router;