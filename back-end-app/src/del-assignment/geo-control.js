const deliveryService = require("../services/assignmentService");

exports.assignDeliveries = async (req, res) => {
  try {
    const result = await deliveryService.assignDeliveries();
    res.status(200).json({ success: true, assignments: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
