import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/sidebar";
import "./attendence.css";
const workingHours = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];
const totalDays = 30;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Employees = ["1749800232450", "1749800232452", "1749800232453"];
const currentYear = new Date().getFullYear();

const initializeAttendance = () => {
  const data = [];
  for (let i = 1; i <= totalDays; i++) {
    const dayRow = {};
    workingHours.forEach((hour) => {
      dayRow[hour] = ""; // Start empty
    });
    data.push({ day: i, hours: dayRow });
  }
  //console.log(data);
  return data;
};

const mergeBackendWithTemplate = (attendanceData, newData) => {
  const backendRecords = newData.attendence[0].records;

  return attendanceData.map((dayEntry) => {
    const dayStr = dayEntry.day.toString(); // backend uses string keys
    const backendDay = backendRecords[dayStr];

    if (backendDay) {
      return {
        ...dayEntry,
        hours: {
          ...dayEntry.hours,
          ...backendDay.hours, // only merge that day
        },
      };
    } else {
      return dayEntry;
    }
  });
};

const EmployeeAttendance = () => {
  const [userRole, setUserRole] = useState("");
  const [attendanceData, setAttendanceData] = useState(initializeAttendance());
  const [selectedMonth, setSelectedMonth] = useState("June");
  const [selectedEmployee, setEmployee] = useState("1749800232450");
  const [selectedYear, setSelectedYear] = useState(currentYear);
  //console.log(selectedMonth, selectedYear, userRole, selectedEmployee);

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
      //console.log(role.role);
      setUserRole(role.role);
    };
    userDetails();
  }, []);

  useEffect(() => {
    console.log(
      "Effect triggered with:",
      selectedMonth,
      selectedYear,
      userRole,
      selectedEmployee
    );
    const fetchAttendence = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "http://localhost:4000/api/getattendence",
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({
              month: selectedMonth,
              year: selectedYear,
              role: userRole,
              empId: selectedEmployee,
            }),
          }
        );

        const newData = await response.json();
        console.log(newData);

        if (newData.attendence[0] === undefined) {
          setAttendanceData(initializeAttendance());
        } else {
          const finalData = mergeBackendWithTemplate(
            initializeAttendance(),
            newData
          );
          setAttendanceData(finalData);
        }
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }
      } catch (err) {
        console.error("Failed to fetch leave data:", err.message);
      }
    };

    fetchAttendence();
  }, [selectedMonth, selectedYear, userRole, selectedEmployee]);

  const updateAttendence = async (updated) => {
    const token = localStorage.getItem("token");
    //console.log(updated);
    const updatedObject = {};
    updated.forEach((entry) => {
      updatedObject[String(entry.day)] = entry;
    });
    try {
      const response = await fetch(
        "http://localhost:4000/api/updateAttendence",
        {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            month: selectedMonth,
            year: selectedYear,
            role: userRole,
            empId: selectedEmployee,
            updated: updatedObject,
          }),
        }
      );
      console.log(response);
    } catch (err) {}
  };

  const toggleAttendance = (targetDayIndex, targetHour) => {
    const updated = attendanceData.map((entry, dayIndex) => {
      if (dayIndex === targetDayIndex) {
        // loop through each hour in this row and modify only the clicked one
        const newHours = {};
        for (const hour of workingHours) {
          if (hour === targetHour) {
            const current = entry.hours[hour];
            newHours[hour] = current === "" ? "P" : current === "P" ? "A" : "";
          } else {
            newHours[hour] = entry.hours[hour]; // copy untouched hours
          }
        }
        return { ...entry, hours: newHours };
      } else {
        return entry; // keep other rows untouched
      }
    });

    setAttendanceData(updated);
    console.log(updated);
    updateAttendence(updated);
  };

  return (
    <div>
      <Sidebar />
      <div className="attendance-container">
        <h2>Employee Attendance - June</h2>
        <div className="header-section">
          <h2>Employee Attendance</h2>
          <div className="selector-container">
            {userRole === "admin" && (
              <select
                value={selectedEmployee}
                onChange={(e) => setEmployee(e.target.value)}
              >
                {Employees.map((employee) => (
                  <option key={employee} value={employee}>
                    {employee}
                  </option>
                ))}
              </select>
            )}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i} value={currentYear - 5 + i}>
                  {currentYear - 5 + i}
                </option>
              ))}
            </select>
          </div>
        </div>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Day</th>
              {workingHours.map((hour) => (
                <th key={hour}>{hour}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((entry, dayIndex) => (
              <tr key={entry.day}>
                <td>{entry.day}</td>
                {workingHours.map((hour) => (
                  <td
                    key={hour}
                    className={
                      entry.hours[hour] === "P"
                        ? "present"
                        : entry.hours[hour] === "A"
                        ? "absent"
                        : "empty"
                    }
                    onClick={() => {
                      if(userRole === "admin"){
                      toggleAttendance(dayIndex, hour)}}}
                  >
                    {entry.hours[hour]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeAttendance;
