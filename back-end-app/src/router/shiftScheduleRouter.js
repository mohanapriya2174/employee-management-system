const router = require("express").Router();
const controller = require("../controller/shiftSchedulerController");

router.post("/shift-range", controller.addShift); // one row per form
router.get("/shifts/:year/:month", controller.monthView);

module.exports = router;
