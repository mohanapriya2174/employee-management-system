import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Sidebar from "../sidebar/sidebar";

const Dashboard = () => {
  const [username, setUserName] = useState("");
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("https://employee-management-system-zqqv.onrender.com/api/dashboard", {
          headers: { authorization: token },
        });
        if (!response.ok) {
          const errorText = await response.text;
          throw new Error(errorText);
        }
        const data = await response.json();
        setUserName(data.username);
      } catch (err) {
        console.error("Failed to fetch profile:", err.message);
        setUserName("Guest");
      }
    };
    fetchProfile();
  }, []);
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="dashboard">
        <h1>Hello, {username}</h1>
        {/* <h1>📦 Logistics Dashboard</h1> */}
        <div className="cards">
          <div className="card">Deliveries: 25 Assigned / 18 Completed</div>
          <div className="card">Attendance: 32 Present / 5 Absent</div>
          <div className="card">Vehicles: 12 Available / 3 In Repair</div>
          <div className="card">Shifts: Morning: 15 | Night: 22</div>
          <div className="card">Incidents: 3 Open Today</div>
          <div className="card">Documents: 4 Pending</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
