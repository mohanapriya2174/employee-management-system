const userService = require("../services/service.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usejwt = require("../../config/jwt.js");
const { customError } = require("../../middleware/customError.js");
//const { use } = require("./router.js");
const SECRET_KEY = "process.env.SECRET_KEY";
//const usejwt = require("../config/jwt");

exports.register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    if (!email || !password || !username || !role) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (userService.findUser(email)) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const newUser = {
      id: Date.now(),
      email,
      password: hashedPassword,
      username: username,
      role: role,
    };

    userService.addUser(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Registered successfully",
      token,
    });
    //console.log(token);
  } catch (err) {
    err.statusCode = 400;
    return next(err);
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = userService.findUser(email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
    //console.log(token);
  } catch (err) {
    err.statusCode = 400;
    return next(err);
  }
};

exports.ensureAuthenticated = (req, res, next) => {
  const accessToken = req.headers.authorization;
  if (!accessToken) {
    res.status(401), json({ message: "access token not found" });
  }
  try {
    const decodedAccessToken = jwt.verify(accessToken, SECRET_KEY);
    console.log(decodedAccessToken);
    req.user = {
      id: decodedAccessToken.id,
      email: decodedAccessToken.email,
    };
    next();
  } catch (err) {
    err.statusCode = 401;
    return next(err);
  }
};
exports.newPage = async (req, res) => {
  const email = req.user.email;
  const users = await userService.findUser(email);
  res.status(200).json({
    id: users.id,
    username: users.username,
    email: users.email,
    role: users.role,
  });
};

exports.leaves = async (req, res) => {
  const id = req.user.id;
  const email = req.user.email;
  const users = await userService.findUser(email);
  const leaves = await userService.readLeaves(id);
  const allleaves = await userService.readAllLeave(id);
  console.log(leaves);
  console.log(id);
  if (users.role === "admin") {
    res.status(200).json({
      leaves: allleaves,
      user: users,
    });
  } else {
    res.status(200).json({
      leaves: leaves,
      user: users,
    });
  }
};

exports.addLeave = async (req, res) => {
  try {
    const newLeave = {
      ...req.body,
    };
    const addedLeave = userService.addLeave(newLeave);
    res.status(201).json({ message: "Leave added", leave: addedLeave });
  } catch (err) {
    res.status(500).json({ message: "Error adding leave", error: err.message });
  }
};
exports.approve = async (req, res) => {
  try {
    const index = req.body.index;
    userService.updateapprove(index);
    res.status(201).json({ message: "approved" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating leave", error: err.message });
  }
};

exports.attendence = async (req, res) => {
  try {
    const id = req.user.id;
    const { month, year, role, empId } = req.body;
    //const users = await userService.findUser(email);
    if (role === "emp") {
      const attendence = userService.getattendence(id, month, year);
      //console.log(attendence);
      res.status(200).json({
        attendence: attendence,
        //user: users,
      });
    } else {
      const attendence = userService.getattendence(empId, month, year);
      //console.log(attendence);
      res.status(200).json({
        attendence: attendence,
        //user: users,
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating leave", error: err.message });
  }
};

exports.updateAttendence = async (req, res) => {
  try {
    const { month, year, role, empId, updated } = req.body;
    userService.updateAttendence(empId, month, year, updated);
    res.status(201).json({ message: "approved" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating leave", error: err.message });
  }
};

