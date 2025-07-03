import React, { useState } from "react";

const LeaveApplication = ({ onLeaveApply }) => {
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    fromDate: "",
    toDate: "",
    noOfDays: "",
    reason: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const leaveData = {
      ...formData,
      status: "Applied",
    };

    try {
      const response = await fetch("http://localhost:4000/api/addleave", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify(leaveData),
      });
      console.log(JSON.stringify(leaveData));
      const data = await response.json();
      if (response.ok) {
        onLeaveApply(leaveData);
        setFormData({
          name: "",
          id: "",
          fromDate: "",
          toDate: "",
          noOfDays: "",
          reason: "",
        });
      } else {
        alert("Error:" + data.message);
      }
    } catch (err) {
      console.error("Submit error", err);
      alert("Submission failed.");
    }
  };
  return (
  
    <form onSubmit={handleSubmit} className="leave-form">
      <label>Name:</label>
      <input
        type="text"
        name="name"
        placeholder="name"
        required
        value={formData.name}
        onChange={handleChange}
      />
      <label>Employee Id:</label>
      <input
        type="text"
        name="id"
        placeholder="Id"
        required
        value={formData.id}
        onChange={handleChange}
      />
      <label>From Date:</label>
      <input
        type="date"
        name="fromDate"
        required
        value={formData.fromDate}
        onChange={handleChange}
      />
      <label>To Date:</label>
      <input
        type="date"
        name="toDate"
        required
        value={formData.toDate}
        onChange={handleChange}
      />
      <label>No Of Days:</label>
      <input
        type="number"
        name="noOfDays"
        required
        value={formData.noOfDays}
        onChange={handleChange}
      />
      <label>reason:</label>
      <textarea
        type="text"
        name="reason"
        placeholder="reason for leave"
        required
        value={formData.reason}
        onChange={handleChange}
      />
      <button type="submit">Apply</button>
    </form>
  );
};

export default LeaveApplication;
