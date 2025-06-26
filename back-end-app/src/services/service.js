const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const usersPath = path.join(__dirname, "../../data/data.json");
const leavePath = path.join(__dirname, "../../data/leaveData.json");
const attendancePath = path.join(__dirname, "../../data/attendence.json");


function readUsers() {
  const data = fs.readFileSync(usersPath, "utf-8");
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), "utf-8");
}

function findUser(email) {
  const users = readUsers();
  return users.find((user) => user.email === email);
}
function findUserwithid(id) {
  const users = readUsers();
  return users.find((user) => user.id === id);
}

function addUser(user) {
  const users = readUsers();
  users.push(user);
  writeUsers(users);
}
function readAllLeave() {
  const data = fs.readFileSync(leavePath, "utf-8");
  return JSON.parse(data);
}

function readLeaves(id) {
  const leaves = readAllLeave();
  //console.log(leaves);
  return leaves.filter(
    (leave) => String(leave.id).trim() === String(id).trim()
  );
}

function addLeave(newLeave) {
  const leaves = readAllLeave();
  leaves.unshift(newLeave);
  fs.writeFile(leavePath, JSON.stringify(leaves, null, 2), (err) => {
    if (err) throw err;
    console.log("Leave added successfully.");
  });
}

function writeAllLeave(leaves) {
  fs.writeFileSync(leavePath, JSON.stringify(leaves, null, 2), "utf-8");
}

function updateapprove(index) {
  const leaves = readAllLeave();

  if (index < 0 || index >= leaves.length) {
    throw new Error("Invalid index");
  }

  const leave = leaves[index];
  leave.status = "Approved";

  writeAllLeave(leaves); // ← Save changes!
  return leave;
}

function readAllAttendence() {
  const data = fs.readFileSync(attendancePath, "utf-8");
  return JSON.parse(data);
}

function getattendence(id, month, year) {
  const attendence = readAllAttendence();
  return attendence.filter(
    (att) =>
      String(att.id).trim() === String(id).trim() &&
      att.month === month &&
      String(att.year).trim() === String(year).trim()
  );
}

function writeAllAttendence(data) {
  fs.writeFileSync(attendancePath, JSON.stringify(data, null, 2));
}

function updateAttendence(empId, month, year, updated) {
  const attendance = readAllAttendence();

  const index = attendance.findIndex(
    (entry) =>
      entry.id === empId &&
      entry.month.toLowerCase() === month.toLowerCase() &&
      entry.year.toString() === year.toString()
  );

  if (index !== -1) {
    // 🔁 Update existing record
    //console.log(updated);
    attendance[index].records = updated;
  } else {
    // ➕ Create a new record if not found
    attendance.push({
      empId,
      month,
      year,
      records: updated,
    });
  }

  // 💾 Save to file
  writeAllAttendence(attendance);
}


module.exports = {
  findUser,
  findUserwithid,
  addUser,
  readUsers,
  readLeaves,
  addLeave,
  readAllLeave,
  updateapprove,
  getattendence,
  updateAttendence,
  
};
