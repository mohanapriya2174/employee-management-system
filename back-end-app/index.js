const express = require("express");
const userRoutes = require("./src/router/router");
const deiveryassignROute = require("./src/router/delivery-assignRouter");
const vehiallocationsRoute = require("./src/router/vehicleAllocRoter");
const shiftScheduleRouter = require("./src/router/shiftScheduleRouter");
const cors = require("cors");

const app = express();
require("dotenv").config();
app.use(express.json());
app.use(cors());

app.use("/api", userRoutes);
app.use("/api", deiveryassignROute);
app.use("/api", vehiallocationsRoute);
app.use("/api", shiftScheduleRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
