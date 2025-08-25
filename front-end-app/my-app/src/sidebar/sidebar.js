import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./sidebar.css";

const Sidebar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarClass = `sidebar ${menuOpen ? "open" : ""} ${
    isMobile ? "glass" : ""
  }`;

  return (
    <div className="responsive-container">
      {isMobile && (
        <div className="top-navbar">
          <div className="logo">🚚 Logistics EMS</div>
          <div className="welcome">Welcome user</div>
          <button className="menu-toggle" onClick={toggleMenu}>
            ☰
          </button>
        </div>
      )}

      <div className={sidebarClass}>
        {!isMobile && <h2>🚚 Logistics EMS</h2>}
        <nav>
          <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
          <NavLink to="/assignments" onClick={() => setMenuOpen(false)}>Delivery Assignments</NavLink>
          <NavLink to="/attendance" onClick={() => setMenuOpen(false)}>Attendance</NavLink>
          <NavLink to="/vehicles" onClick={() => setMenuOpen(false)}>Vehicle Allocation</NavLink>
          <NavLink to="/leave" onClick={() => setMenuOpen(false)}>Leave Management</NavLink>
          <NavLink to="/shifts" onClick={() => setMenuOpen(false)}>Shift Scheduling</NavLink>
          <NavLink to="/incidents" onClick={() => setMenuOpen(false)}>Incident Reporting</NavLink>
          <NavLink to="/employees" onClick={() => setMenuOpen(false)}>Employee Directory</NavLink>
          <NavLink to="/reports" onClick={() => setMenuOpen(false)}>Reports & Analytics</NavLink>
          <NavLink to="/documents" onClick={() => setMenuOpen(false)}>Document Uploads</NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
