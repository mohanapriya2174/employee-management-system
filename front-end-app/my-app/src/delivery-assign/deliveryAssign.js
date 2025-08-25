import React, { useState, useEffect } from "react";
//import dayjs from "dayjs";
import "./deliveryAssign.css";
import AddAssignment from "./addAssignment";
import Sidebar from "../sidebar/sidebar";
import AssignmentTable from "./assignmentTable";

const DeliveryAssign = () => {
  const [userRole, setUserRole] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  useEffect(() => {
    const userDetails = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/dashboard", {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const role = await response.json();
      console.log(role);
      setUserRole(role.role);
      setCurrentUser(role.id);
    };
    userDetails();
  }, []);
  return (
    <div>
      <Sidebar />
      <div className="main-content">
        <div>{userRole === "admin" && <AddAssignment />}</div>
        <AssignmentTable isEmp={userRole === "emp"} UserID={currentUser} />
      </div>
    </div>
  );
};

export default DeliveryAssign;
