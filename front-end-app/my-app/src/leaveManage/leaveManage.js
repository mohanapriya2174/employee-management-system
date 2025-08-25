import React, { useState, useEffect } from "react";
import "./leaveManage.css";
import Sidebar from "../sidebar/sidebar";
import LeaveApplication from "./leaveapp";
import LeaveList from "./leavelist";

const LeaveManage = () => {
  const [applications, setApplications] = useState([]);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchLeave = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("https://employee-management-system-zqqv.onrender.com/api/getleaveapp", {
          headers: { Authorization: token },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const data = await response.json();

        console.log("Fetched leave data:", data);
        setApplications(data.leaves);
        setUserRole(data.user.role);
      } catch (err) {
        console.error("Failed to fetch leave data:", err.message);
        setApplications([]);
      }
    };

    fetchLeave();
  }, []);

  const handleLeave = (newApplication) => {
    setApplications([newApplication, ...applications]);
  };

  const handleApprove = async (index) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("https://employee-management-system-zqqv.onrender.com/api/approve", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify({
          index: index,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const updatedApplications = [...applications];
      updatedApplications[index].status = "Approved";
      setApplications(updatedApplications);
    } catch (err) {}
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="leave-container">
        {userRole !== "admin" && (
          <LeaveApplication onLeaveApply={handleLeave} />
        )}
        <div className="leave-list-container">
          <LeaveList
            applications={applications}
            isAdmin={userRole === "admin"}
            onApprove={handleApprove}
          />
        </div>
      </div>
    </div>
  );
};

export default LeaveManage;
