import React, { useEffect, useState } from "react";
import axios from "axios";
import "./vehicleAlloc.css";
import Sidebar from "../sidebar/sidebar"; // plain CSS

const VehicleAllocation = () => {
  const [userRole, setUserRole] = useState("");
  const [employees, setEmployees] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");

  // initial data load
  useEffect(() => {
    const token = localStorage.getItem("token");

    const load = async () => {
      try {
        const empRes = await fetch("https://employee-management-system-zqqv.onrender.com/api/employees", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        const empData = await empRes.json();
        let empIds = [];
        //console.log(empData.emplist);
        empIds = empData.emplist;

        const vehRes = await fetch("https://employee-management-system-zqqv.onrender.com/api/vehicles", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        const vehData = await vehRes.json();
        let vehIds = [];
        //console.log(vehData.vehlist);
        vehIds = vehData.vehlist;

        const allocRes = await fetch(
          "https://employee-management-system-zqqv.onrender.com/api/vehiallocations",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        const allocData = await allocRes.json();
        // console.log(allocData.vehiAllocList[0]);

        const allocated = allocData.vehiAllocList;

        // Log first employee ID for debugging
        if (empData && empData.length > 0) {
          console.log("First Employee ID:", empData[0].emp_id);
        }

        // Update state
        setEmployees([...empIds]);
        setVehicles(vehIds);
        setAllocations(allocated[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    load();
  }, []);

  async function handleAllocate() {
    if (!selectedEmployee || !selectedVehicle) {
      return alert("Please select both an employee and a vehicle.");
    }
    console.log(selectedEmployee,selectedVehicle);
    await axios.post("/api/allocations", {
      emp_Id: selectedEmployee,
      vehicle_Id: selectedVehicle,
    });
    // refresh the allocation table
    const allocRes = await axios.get("/api/allocations");
    setAllocations(allocRes.data);
  }

  return (
    <div>
      <Sidebar />
      <div className="va-container">
        <h2 className="va-heading">Vehicle Allocation</h2>

        <div className="va-form-row">
          <select
            className="va-select"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">— Select Employee —</option>
            {employees.map((emp) => (
              <option key={emp.emp_id} value={emp.emp_id}>
                {emp.emp_id}
              </option>
            ))}
          </select>

          <select
            className="va-select"
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
          >
            <option value="">— Select Vehicle —</option>
            {vehicles.map((veh) => (
              <option key={veh.vehicle_id} value={veh.vehicle_id}>
                {veh.vehicle_id}
              </option>
            ))}
          </select>

          <button className="va-btn" onClick={handleAllocate}>
            Allocate
          </button>
        </div>

        <h3 className="va-subheading">Allocated Vehicles</h3>

        <table className="va-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Vehicle</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((a, i) => (
              <tr key={i}>
                <td>{a.assigned_to}</td>
                <td>{a.vehicle_id}</td>
                <td>{a.vehicle_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleAllocation;
