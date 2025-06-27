const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const dayjs = require("dayjs");

const connection = require("../model"); // Adjust path as needed

async function uploadDelivery(input, createdById) {
  const {
    id, // delivery_id
    date,
    address,
    lat,
    lng,
    load_size,
    delivery_deadline,
  } = input;

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

  const deliveryDate = dayjs(date).format("YYYY-MM-DD");
  const deadline = dayjs(delivery_deadline).format("YYYY-MM-DD HH:mm:ss");

  // Prepare SQL Insert
  const query = `
    INSERT INTO deliveries (
      id, delivery_date, address, latitude, longitude,
      load_size, delivery_deadline, status, assigned_to
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await connection.query(query, [
    id,
    deliveryDate,
    address,
    parseFloat(lat),
    parseFloat(lng),
    parseInt(load_size),
    deadline,
    "Not Started", // Default status
    "", // Default assigned_to
  ]);

  console.log("✅ Delivery inserted into MySQL.");
}

async function getalldeliveries() {
  const [rows] = await connection.query("SELECT * FROM deliveries");
  console.log(rows);
  return rows;
}
module.exports = {
  uploadDelivery,
  getalldeliveries,
};
