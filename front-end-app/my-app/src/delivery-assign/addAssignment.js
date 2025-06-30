import React, { useEffect, useState } from "react";

const AddAssignment = () => {
  const [delivery, setDelivery] = useState({
    id: "",
    date: "",
    address: "",
    lat: "",
    lng: "",
    load_size: "",
    delivery_deadline: "",
  });

  // useEffect(()=>{
  //   const fetchLeave = async () => {
  //     const token = localStorage.getItem("token");
  //     try {
  //       const response = await fetch("http://localhost:4000/api/assign", {
  //         headers: { Authorization: token },
  //       });
  //     }catch(err){

  //     }
  //   }

  // })

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDelivery((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddDelivery = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const payload = {
      ...delivery,
      lat: parseFloat(delivery.lat),
      lng: parseFloat(delivery.lng),
      load_size: parseInt(delivery.load_size),
      status: "Not Started",
      assigned_to: "",
    };

    try {
      const response = await fetch("http://localhost:4000/api/addassignment", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify(payload),
      });
      console.log(response);
      console.log(payload);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    } catch (err) {
      console.error("Submit error", err);
      alert("Submission failed.");
    }
  };
  const handleAssign = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:4000/api/assign", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      });
      console.log("deliveries are assigned");
    } catch (err) {
      console.error("Submit error", err);
    }
  };
  return (
    <div className="delivery-assign">
      <h2>Admin Delivery Assignment</h2>

      <div className="form-section">
        <input
          type="text"
          name="id"
          placeholder="Delivery ID"
          value={delivery.id}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="date"
          value={delivery.date}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Delivery Address"
          value={delivery.address}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="lat"
          value={delivery.lat}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="lng"
          value={delivery.lng}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="load_size"
          value={delivery.load_size}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="delivery_deadline"
          value={delivery.delivery_deadline}
          onChange={handleInputChange}
        />

        <button onClick={handleAddDelivery}>Add Delivery</button>
        <button onClick={handleAssign}>Assign Deliveries</button>
      </div>
    </div>
  );
};
export default AddAssignment;
