const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const deliveriesPath = path.join(__dirname, "../../data/deliveries.json");
//const deliveriesPath = path.join(__dirname, "/back-end-app/data/deliveries.json");
function getalldeliveries() {
  if (fs.existsSync(deliveriesPath)) {
    const context = JSON.parse(fs.readFileSync(deliveriesPath, "utf-8"));
    return context;
  }
}

function uploadDelivery(input) {
  const { id, date, address, lat, lng, load_size, delivery_deadline } = input;

  // Basic validation
  if (
    !id ||
    !date ||
    !address ||
    !lat ||
    !lng ||
    !load_size ||
    !delivery_deadline
  ) {
    throw new Error("Missing required fields.");
  }

  const d = dayjs(date);
  const year = d.format("YYYY");
  const month = d.format("MMMM"); // e.g., June
  const day = d.format("D"); // e.g., 23

  // New delivery object
  const newDelivery = {
    id,
    date,
    address,
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    load_size: parseInt(load_size),
    delivery_deadline,
    status: "Not Started",
    assigned_to: "",
  };

  // Read existing deliveries
  let deliveries = {};
  deliveries = getalldeliveries();

  // Ensure nested structure
  if (!deliveries[year]) deliveries[year] = {};
  if (!deliveries[year][month]) deliveries[year][month] = {};
  if (!deliveries[year][month][day]) deliveries[year][month][day] = [];

  // Push the new delivery
  deliveries[year][month][day].push(newDelivery);

  // Write back to file
  fs.writeFileSync(deliveriesPath, JSON.stringify(deliveries, null, 2));
  console.log("✅ Delivery uploaded successfully.");
}

module.exports = {
  uploadDelivery,
  getalldeliveries,
};
