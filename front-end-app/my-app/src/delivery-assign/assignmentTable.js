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
          const isNotCompleted = deliveryObj.status !== "completed";

          if ((isToday || isNotCompleted) && !deliveryObj.assigned_to) {
            unassigned.push(deliveryObj);
          } else {
            assigned.push(deliveryObj);
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

  // const toggelStatus = ( items, index) => {
  //   const updatedList = [...targetList];
  //   const currentStatus = updatedList[index].status;

  //   let nextStatus = "not started";
  //   if (currentStatus === "not started") nextStatus = "pending";
  //   else if (currentStatus === "pending") nextStatus = "completed";
  //   else if (currentStatus === "completed") nextStatus = "not started";

  //   updatedList[index].status = nextStatus;
  //   setList(updatedList);
  // };

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
              // onClick={() => {
              //   toggelStatus(items, index);
              // }}
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
