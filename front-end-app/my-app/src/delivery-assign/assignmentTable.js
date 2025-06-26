import React, { useEffect, useState } from "react";

const AsignmentTable = () => {
  const [deliveries, setdeliveries] = useState([]);
  const [unassigned, setunassigned] = useState([]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "http://localhost:4000/api/getdeliveries",
          {
            headers: {
              Authorization: token,
              "content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        const data = result.deliveries;

        console.log(data);

        const today = new Date().toISOString().split("T")[0];

        const filtered = [];
        const unassigned_del = [];

        for (let year in data) {
          const years = data[year];
          for (let month in years) {
            const months = years[month];
            for (let date in months) {
              const deliverylist = data[year][month][date];
              for (let items of deliverylist) {
                const istoday = items.date === today;
                const isnotCompleted = items.status !== "completed";
                //const unassigned = items.assigned_to === undefined;

                if (istoday || isnotCompleted) {
                  if (items.assigned_to === "") {
                    unassigned_del.push(items);
                    continue;
                  }
                  filtered.push(items);
                }
              }
            }
          }
        }
        console.log(filtered);
        setdeliveries(filtered);
        setunassigned(unassigned_del);
      } catch (err) {
        console.error("Failed to fetch leave data:", err.message);
      }
    };
    fetchDeliveries();
  }, []);
  return (
    <div className="table-section">
      <h3>Assigned Deliveries</h3>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Employee Id</th>
            <th>Employee Name</th>
            <th>Delivery Id</th>
            <th>Delivery Status</th>
            <th>deadline</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((items, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{items.assigned_to}</td>
              <td>{items.assigned_to}</td>
              <td>{items.id}</td>
              <td onClick={()=>{
                toggelStatus(items,index);
              }}>{items.status}</td>
              <td>{items.delivery_deadline.split("T")[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Unassigned Deliveries</h3>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Delivery Id</th>
            <th>Delivery Status</th>
            <th>deadline</th>
          </tr>
        </thead>
        <tbody>
          {unassigned.map((items, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{items.id}</td>
              <td>{items.status}</td>
              <td>{items.delivery_deadline.split("T")[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AsignmentTable;
