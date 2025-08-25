import React from "react";
import "./shift.css"; // Optional if using external CSS
import { Link } from "react-router-dom";

const ShiftRegtoLog = () => {
  return (
    <nav className="navbar">
      <div className="nav-buttons">
        <div>
          <Link to={"/register"}>
            <button className="nav-btn">Register</button>
          </Link>
        </div>
        <div>
          <Link to={"/login"}>
            <button className="nav-btn">Login</button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default ShiftRegtoLog;
