import { Routes, Route } from "react-router-dom";

//import ShiftRegtoLog from "./shift/shiftRegtoLog.js";
import Register from "./register/register.js";
import Login from "./login/login.js";
//import Sidebar from "./sidebar/sidebar.js";
import "./index.css";
import Dashboard from "./dashboard/dashboard.js";
import LeaveManage from "./leaveManage/leaveManage.js";
import EmployeeAttendance from "./attendence/attendence.js";
import DeliveryAssign from "./delivery-assign/deliveryAssign.js";
import VehicleAllocation from "./vehicle-alloc/vehicleAlloc.js";
function App() {
  return (
    <div>
      <Routes>
        <Route
          path="/Register"
          element={
            <>
              <Register />
            </>
          }
        ></Route>
        <Route
          path="/login"
          element={
            <>
              <Login />
            </>
          }
        ></Route>
        <Route
          path="/dashboard"
          element={
            <>
              <Dashboard />
            </>
          }
        ></Route>
        <Route
          path="/leave"
          element={
            <>
              <LeaveManage />
            </>
          }
        ></Route>
        <Route
          path="/attendance"
          element={
            <>
              <EmployeeAttendance />
            </>
          }
        ></Route>
        <Route
          path="/assignments"
          element={
            <>
              <DeliveryAssign />
            </>
          }
        ></Route>
        <Route
          path="/vehicles"
          element={
            <>
              <VehicleAllocation />
            </>
          }
        ></Route>
      </Routes>
    </div>
  );
}
export default App;
