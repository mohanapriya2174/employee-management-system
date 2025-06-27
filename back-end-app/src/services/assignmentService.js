//const deliveries = deliveriesData["2025"]?.["June"]?.["26"] || [];
const connection = require("../model");
const dayjs = require("dayjs");
const { getDrivingRoute } = require("../del-assignment/get-route");
const { fetchLatLng } = require("../del-assignment/geo-code");

exports.assignDeliveries = async () => {
  const assignments = [];

  // 1. Fetch unassigned deliveries
  const [deliveries] = await connection.query(`
    SELECT * FROM deliveries
    WHERE assigned_to = ""
    ORDER BY delivery_deadline ASC
  `);
  // console.log(deliveries);

  // 2. Fetch employees and their vehicles
  const [employees] = await connection.query(`
    SELECT 
      e.emp_id, e.name, e.latitude, e.longitude, 
      e.vehicle_id, e.max_assignments, e.current_load,
      v.load_capacity
    FROM employee_data e
    JOIN vehicles v ON e.vehicle_id = v.vehicle_id
  `);
  console.log(employees);
  for (const delivery of deliveries) {
    let bestEmployee = null;
    let shortestEta = Infinity;

    // If missing lat/lng, geocode the address
    if (!delivery.latitude || !delivery.longitude) {
      try {
        const coords = await fetchLatLng(delivery.address);
        if (!coords) continue;
        delivery.latitude = coords.latitude;
        delivery.longitude = coords.longitude;

        await connection.query(
          `UPDATE deliveries SET latitude = ?, longitude = ? WHERE id = ?`,
          [coords.latitude, coords.longitude, delivery.id]
        );
      } catch (err) {
        console.error(`Geocode failed for ${delivery.address}: ${err.message}`);
        continue;
      }
    }

    for (const emp of employees) {
      const canCarry =
        (emp.current_load || 0) + delivery.load_size <= emp.load_capacity;
      if (!canCarry) continue;

      await new Promise((res) => setTimeout(res, 6000)); // To avoid rate-limiting

      try {
        const route = await getDrivingRoute([
          { lat: emp.latitude, lng: emp.longitude },
          { lat: delivery.latitude, lng: delivery.longitude },
        ]);

        const eta = route.durationMinutes;
        const deadline = dayjs(delivery.delivery_deadline);
        const arrival = dayjs().add(eta, "minute");

        if (arrival.isAfter(deadline)) continue;

        if (eta < shortestEta) {
          bestEmployee = emp;
          shortestEta = eta;
        }
      } catch (err) {
        console.warn(
          `Route error for delivery ${delivery.id}: ${err.message}`
        );
      }
    }

    if (bestEmployee) {
      console.log(bestEmployee);
      // 1. Assign delivery
      await connection.query(
        `UPDATE deliveries SET assigned_to = ?, status = 'Assigned' WHERE id = ?`,
        [bestEmployee.emp_id, delivery.id]
      );

      // 2. Update employee current_load
      const newLoad = (bestEmployee.current_load || 0) + delivery.load_size;
      await connection.query(
        `UPDATE employee_data SET current_load = ? WHERE emp_id = ?`,
        [newLoad, bestEmployee.emp_id]
      );

      assignments.push({
        delivery_id: delivery.id,
        emp_id: bestEmployee.emp_id,
        vehicle_id: bestEmployee.vehicle_id,
        eta_minutes: Math.round(shortestEta),
        assigned_at: new Date().toISOString(),
        status: "Assigned",
      });
    }
  }

  return assignments;
};
