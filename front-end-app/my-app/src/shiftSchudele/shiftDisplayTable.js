import { useEffect, useState } from "react";
import dayjs from "dayjs";


export default function ShiftCalendarTable({ year, month }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`https://employee-management-system-zqqv.onrender.com/api/shifts/${year}/${month}`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [year, month]);

  if (!data) return <p>Loading shifts…</p>;

  const daysInMonth = dayjs(`${year}-${String(month).padStart(2, "0")}-01`).daysInMonth();
  const dayList = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="shift-wrapper">
      <table className="shift-table">
        <thead>
          <tr>
            <th className="header-cell sticky-col">Employee</th>
            {dayList.map(d => (
              <th key={d} className="header-cell">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(data.matrix).map(([empId, emp]) => (
            <tr key={empId}>
              <td className="emp-cell sticky-col">{emp.name}</td>
              {dayList.map(day => {
                const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                return (
                  <td key={day} className="day-cell">
                    {emp.days[dateStr] || ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
