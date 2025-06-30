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

async function updateDeliveryStatus(data) {
  try {
    const presentValue = await connection.query(
      `select load_capacity from vehicles where
    assigned_to =?`,
      [data.assigned_to]
    );
    const load_capacity = presentValue[0][0].load_capacity + data.load_size;
    const query1 = `update deliveries set status = ? where id =?`;
    await connection.query(query1, [data.status, data.delivery_id]);
    if(data.status=='completed'){
    const query2 = ` update vehicles set load_capacity=? where assigned_to=?`;
    await connection.query(query2, [load_capacity, data.assigned_to]);
    const query3 = `update employee_data set latitude=?, longitude=? where emp_id=?`;
    await connection.query(query3, [data.lat, data.lng, data.assigned_to]);
    }
  } catch (err) {
    console.error("Failed to update status:", err.message);
  }
}

module.exports = {
  uploadDelivery,
  getalldeliveries,
  updateDeliveryStatus,
};
