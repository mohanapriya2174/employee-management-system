const dayjs = require("dayjs");
const connection = require("../model");

async function getEmployees() {
  const [rows] = await connection.query("SELECT emp_id FROM employee_data ");
  console.log(rows);
  return rows;
}
async function getVehicles() {
  const [rows] = await connection.query("SELECT vehicle_id FROM vehicles ");
  return rows;
}
async function getVehicleAlloc() {
  const rows = await connection.query("SELECT * FROM vehicles ");
  return rows;
}

module.exports = {
  getEmployees,
  getVehicles,
  getVehicleAlloc,
};
