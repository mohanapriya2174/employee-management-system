import React, { useEffect, useState } from "react";

const AsignmentTable = ({ isEmp }) => {
  const [deliveries, setdeliveries] = useState([]);
  const [unassigned, setunassigned] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDeliveries = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "http://localhost:4000/api/getdeliveries",
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();
        const rawDeliveries = result.deliveries;

        const today = new Date().toISOString().split("T")[0];

        const assigned = [];
        const unassigned = [];

        for (let d of rawDeliveries) {
          const deliveryDate = d.delivery_date.split("T")[0];
          const deadline = d.delivery_deadline.split("T")[0];

          const deliveryObj = {
            id: d.id,
            date: deliveryDate,
            address: d.address,
            lat: parseFloat(d.latitude),
            lng: parseFloat(d.longitude),
            load_size: d.load_size,
            delivery_deadline: deadline,
            status: d.status,
            assigned_to: d.assigned_to || "",
          };

          const isToday = deliveryObj.date === today;
          console.log(today, deliveryObj.date);
          const isNotCompleted = deliveryObj.status !== "completed";

          if (!deliveryObj.assigned_to) {
            unassigned.push(deliveryObj);
          } else {
            if (isToday) {
              assigned.push(deliveryObj);
            } else {
              if (isNotCompleted) {
                console.log(isNotCompleted);
                assigned.push(deliveryObj);
              }
            }
          }
        }

        setdeliveries(assigned);
        setunassigned(unassigned);
        console.log("✅ Assigned:", assigned);
        console.log("⏳ Unassigned:", unassigned);
      } catch (err) {
        console.error("❌ Failed to fetch deliveries:", err.message);
      }
    };
    fetchDeliveries();
  }, []);

  const setStatus = async (items) => {
    try {
      await fetch("http://localhost:4000/api/updateDeliveryStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          delivery_id: items.id,
          status: items.status,
          lat: items.lat,
          lng: items.lng,
          load_size: items.load_size,
          assigned_to: items.assigned_to,
        }),
      });
    } catch (err) {
      console.error("Failed to update status:", err.message);
    }
  };

  const toggelStatus = (items, index) => {
    const currentStatus = items.status;
    const newStatus = [...deliveries];
    let nextStatus = "Assigned";
    if (currentStatus === "Assigned") nextStatus = "Started";
    else if (currentStatus === "Started") nextStatus = "completed";
    else if (currentStatus === "completed") nextStatus = "Assigned";
    newStatus[index].status = nextStatus;
    console.log(newStatus);
    setdeliveries(newStatus);
    setStatus(items);
  };

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
              <td
                onClick={() => {
                  isEmp && toggelStatus(items, index);
                  console.log(items);
                }}
              >
                {items.status}
              </td>
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
