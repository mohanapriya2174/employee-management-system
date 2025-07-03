const vehicleAllocService = require("../services/vehicleAllocService.js");
const userService = require("../services/service.js");

exports.getEmployees = async (req, res) => {
  try {
    const emplist = await vehicleAllocService.getEmployees();
    res.status(200).json({
      emplist: emplist,
      message: "the employee list is fitched succesfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in fetching employee list", error: err.message });
  }
};
exports.getVehicles = async (req, res) => {
  try {
    const vehlist = await vehicleAllocService.getVehicles();
    console.log(vehlist);
    res.status(200).json({
      vehlist: vehlist,
      message: "the vehicle list is fitched succesfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in fetching vehicle list", error: err.message });
  }
};
exports.getVehicleAlloc = async (req, res) => {
  try {
    await vehicleAllocService.getVehicleAlloc();
    res
      .status(200)
      .json({ message: "the vehicle allocation list is fitched succesfully" });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error in fetching vehicle allocation list",
        error: err.message,
      });
  }
};
