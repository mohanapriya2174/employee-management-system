const dayjs = require("dayjs");
const deliveriesData = require("../../data/deliveries.json");
const userService = require("../services/delivery-assignService");

const today = new Date();
const year = today.getFullYear().toString();
const month = today.getMonth().toString();
const date = today.getDate().toString();

const deliveries = deliveriesData[year]?.[month]?.[date] || [];
const employees = require("../../data/employee.json");
const vehicles = require("../../data/vehicle.json");
const { getDrivingRoute } = require("../del-assignment/get-route");
const { fetchLatLng } = require("../del-assignment/geo-code");

exports.assignDeliveries = async () => {
  const assignments = [];
  console.log(deliveries);

  for (const delivery of deliveries) {
    if (delivery.assigned_to) continue;

    let bestEmployee = null;
    let shortestEta = Infinity;

    for (const emp of employees) {
      const vehicle = vehicles.find((v) => v.id === emp.vehicle_id);
      if (!vehicle) continue;

      const canCarry =
        (emp.current_load || 0) + delivery.load_size <= vehicle.load_capacity;
      if (!canCarry) continue;

      await new Promise((res) => setTimeout(res, 6000));

      if (!delivery.lat || !delivery.lng) {
        console.log(`Looking up lat/lng for "${delivery.address}"`);
        try {
          const coords = await fetchLatLng(delivery.address);
          if (!coords) {
            console.warn(`Could not find location for: ${delivery.address}`);
            continue; // skip this delivery
          }
          delivery.lat = coords.lat;
          delivery.lng = coords.lng;
          console.log(`✅ Geocoded to: ${coords.lat}, ${coords.lng}`);
        } catch (err) {
          console.error(
            `❌ Geocode error for ${delivery.address}:`,
            err.message
          );
          continue;
        }
      }

      try {
        const route = await getDrivingRoute([
          emp.current_location,
          { lat: delivery.lat, lng: delivery.lng },
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
        console.log(`Route error for ${delivery.id}:`, err.message);
      }
    }

    if (bestEmployee) {
      delivery.assigned_to = bestEmployee.id;
      bestEmployee.assigned_deliveries = bestEmployee.assigned_deliveries || [];
      bestEmployee.assigned_deliveries.push(delivery.id);
      bestEmployee.current_load =
        (bestEmployee.current_load || 0) + delivery.load_size;

      assignments.push({
        delivery_id: delivery.id,
        employee_id: bestEmployee.id,
        eta_minutes: Math.round(shortestEta),
        vehicle_id: bestEmployee.vehicle_id,
        assigned_at: new Date().toISOString(),
        status: "Assigned",
      });
    }
  }
  

  return assignments;
};
