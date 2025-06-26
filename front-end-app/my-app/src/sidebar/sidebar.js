import React from "react";
import { NavLink } from "react-router-dom";
import "./sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>🚚 Logistics EMS</h2>
      <nav>
        <NavLink to="/dashboard"> Dashboard</NavLink>
        <NavLink to="/assignments"> Delivery Assignments</NavLink>
        <NavLink to="/attendance">Attendance</NavLink>
        <NavLink to="/vehicles"> Vehicle Allocation</NavLink>
        <NavLink to="/leave">Leave Management</NavLink>
        <NavLink to="/shifts">Shift Scheduling</NavLink>
        <NavLink to="/incidents">Incident Reporting</NavLink>
        <NavLink to="/employees"> Employee Directory</NavLink>
        <NavLink to="/reports"> Reports & Analytics</NavLink>
        <NavLink to="/documents">Document Uploads</NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
