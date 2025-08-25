const express = require("express");
const userRoutes = require("./src/router/router");
const deiveryassignROute = require("./src/router/delivery-assignRouter");
const vehiallocationsRoute = require("./src/router/vehicleAllocRoter");
const shiftScheduleRouter = require("./src/router/shiftScheduleRouter");
const cors = require("cors");

const app = express();
require("dotenv").config();
app.use(express.json());
// ✅ Allow only your frontend domain
const allowedOrigins = [
  "http://localhost:3000", 
  "https://employee-management-system-dhq915ko5.vercel.app"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/api", userRoutes);
app.use("/api", deiveryassignROute);
app.use("/api", vehiallocationsRoute);
app.use("/api", shiftScheduleRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
