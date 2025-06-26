const dayjs = require("dayjs");
const fs = require("fs");
const path = require("path");

const deliveriesPath = path.join(__dirname, "../../data/deliveries.json");
const vechilePath = path.join(__dirname, "../../data/vehicle.json");

//const deliveries = deliveriesData["2025"]?.["June"]?.["26"] || [];
const deliveriesData = require("../../data/deliveries.json");
const userService = require("../services/delivery-assignService");
const employees = require("../../data/employee.json");
const vehicles = require("../../data/vehicle.json");
const { getDrivingRoute } = require("../del-assignment/get-route");
const { fetchLatLng } = require("../del-assignment/geo-code");

function flattenDeliveries(obj) {
  const list = [];
  for (const y of Object.keys(obj)) {
    for (const m of Object.keys(obj[y])) {
      for (const d of Object.keys(obj[y][m])) {
        list.push(...obj[y][m][d]);
      }
    }
  }
  return list;
}

function patchAssignedTo(tree, delivery, employeeId) {
  const dt = dayjs(delivery.date);
  const yKey = dt.year().toString();
  const mKey = dt.month().toString(); // 0-based
  const dKey = dt.date().toString();

  const bucket = tree?.[yKey]?.[mKey]?.[dKey];
  if (!bucket) return false;

  const target = bucket.find((d) => d.id === delivery.id);
  if (!target) return false;

  target.assigned_to = employeeId;
  return true;
}

function pathchVechileCap(employee, addedLoad) {
  const v = vehicles.find((veh) => veh.id === employee.vehicle_id);
  if (!v) return;
  v.load_capacity = Math.max(0, v.load_capacity - addedLoad);
}

exports.assignDeliveries = async () => {
  const assignments = [];
  const deliveries = flattenDeliveries(deliveriesData)
    .filter((d) => !d.assigned_to) // unassigned only
    .sort((a, b) =>
      dayjs(a.delivery_deadline).diff(dayjs(b.delivery_deadline))
    );
  console.log(deliveries);

  for (const delivery of deliveries) {
    // if (delivery.assigned_to) continue;

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
        console.log(eta);
        console.log(`current load of ${emp.id} is ${delivery.load_size}`);
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
      patchAssignedTo(deliveriesData, delivery, bestEmployee.id);
      pathchVechileCap(bestEmployee, delivery.load_size);
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
  fs.writeFileSync(
    deliveriesPath,
    JSON.stringify(deliveriesData, null, 2),
    "utf8"
  );

  fs.writeFileSync(vechilePath, JSON.stringify(vehicles, null, 2), "utf8");
  return assignments;
};
