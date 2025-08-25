const deliveryService = require("../services/delivery-assignService");
const userService = require("../services/service.js");
const SECRET_KEY = "process.env.SECRET_KEY";

exports.addDelivery = async (req, res) => {
  try {
    const id = req.user.id;
    const users = await userService.findUserwithid(id);

    if (users.role === "admin") {
      await deliveryService.uploadDelivery(req.body, id); // ← Important to await
      res.status(200).json({ message: "Delivery uploaded successfully." });
    } else {
      res.status(403).json({ message: "Unauthorized" });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error uploading delivery",
      error: err.message,
    });
  }
};

exports.getalldeliveries = async (req, res) => {
  try {
    const deliveries = await deliveryService.getalldeliveries();
    res.status(200).json({ deliveries: deliveries });
    //console.log(deliveries);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating leave", error: err.message });
  }
};

exports.updateDeliverStatus = async (req, res) => {
  try {
    const id= req.user.id;
    const users = await userService.findUserwithid(id);
    //console.log(req.body);
    const data = req.body;
    if (users.role === "emp") {
      await deliveryService.updateDeliveryStatus(data);
      res
        .status(200)
        .json({ message: "delivery status and location updated successfully" });
    } else {
      res.status(403).json({ message: "Unauthorized" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
