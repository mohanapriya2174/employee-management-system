
const connection = require("../model"); // your mysql connection using promise

async function findUser(email) {
  const [rows] = await connection.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
}

// Find user by id
async function findUserwithid(id) {
  const [rows] = await connection.query("SELECT * FROM users WHERE id = ?", [
    id,
  ]);
  return rows[0];
}

// Add user
async function addUser(user) {
  const { id, email, password, username, role } = user;
  await connection.query(
    "INSERT INTO users (id, email, password, username, role) VALUES (?, ?, ?, ?, ?)",
    [id, email, password, username, role]
  );
  return user;
}

// Read leaves for user
async function readLeaves(id) {
  const [rows] = await connection.query(
    "SELECT * FROM leave_requests WHERE emp_id = ?",
    [id]
  );
  return rows;
}

// Read all leaves (for admin)
async function readAllLeave() {
  const [rows] = await connection.query("SELECT * FROM leave_requests");
  return rows;
}

// Add leave
async function addLeave(leave) {
  const { name, id, fromDate, toDate, noOfDays, reason, status } = leave;
  await connection.query(
    "INSERT INTO leave_requests (emp_id, emp_name, from_date, to_date, no_of_days, reason, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, name, fromDate, toDate, noOfDays, reason, status]
  );
  return leave;
}

// Approve leave (using leave id)
async function updateapprove(leaveId) {
  await connection.query(
    "UPDATE leave_requests SET status = 'Approved' WHERE id = ?",
    [leaveId]
  );
}

async function getattendence(id, month, year) {
  const [rows] = await connection.query(
    "SELECT * FROM attendance WHERE emp_id = ? AND attendance_month = ? AND attendance_year = ?",
    [id, month, year]
  );
  return rows;
}

async function updateAttendence(empId, year, month, day, hour, status) {
  const [rows] = await connection.query(
    "SELECT * FROM attendance WHERE emp_id = ? AND attendance_month = ? AND attendance_year = ? AND attendance_day = ? AND attendance_hour = ?",
    [empId, month, year, day, hour]
  );

  if (rows.length > 0) {
    await connection.query(
      "UPDATE attendance SET status = ? WHERE emp_id = ? AND attendance_month = ? AND attendance_year = ? AND attendance_day = ? AND attendance_hour = ?",
      [status, empId, month, year, day, hour]
    );
  } else {
    await connection.query(
      "INSERT INTO attendance (emp_id,  attendance_year,attendance_month, attendance_day,attendance_hour,status) VALUES (?, ?, ?, ?, ?, ?)",
      [empId, year, month, day, hour, status]
    );
  }
}

module.exports = {
  findUser,
  findUserwithid,
  addUser,
  readLeaves,
  addLeave,
  readAllLeave,
  updateapprove,
  getattendence,
  updateAttendence,
};
