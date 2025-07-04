import { useState } from "react";
import AdminShiftForm      from "./shiftAssign";
import ShiftCalendarTable  from "./shiftDisplayTable";
import "./shiftSchedule.css";
import Sidebar from "../sidebar/sidebar";

export default function ShiftAdminPage() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div>
        <Sidebar/>
    <div className="wrapper">
      <h2>Shift Scheduler</h2>
      <AdminShiftForm onSaved={() => setRefresh((n) => n + 1)} />
      {/* July 2025 example; change as needed */}
      <ShiftCalendarTable key={refresh} year={2025} month={7} />
    </div></div>
  );
}
