import React from "react";

const LeaveList = ({ applications, isAdmin, onApprove }) => {
  return (
    <div>
      <h3>Applied Leave</h3>
      <ul className="Leave-list">
        {applications.map((app, index) => (
          <li key={index} className="leave-card">
            <strong>{app.name}</strong>
            {app.id}
            <br />
            {app.fromDate} to {app.toDate} ({app.noOfDays} days)
            <br />
            <em>reason: </em>
            {app.reason}
            <br />
            <em>status: </em>
            {app.status}
            {isAdmin && app.status !== "Approved" && (
              <>
                <br />
                <button onClick={() => onApprove(index, app.id)}>
                  Approve
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default LeaveList;
