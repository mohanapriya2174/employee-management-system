const connection = require("../model");
const moment = require("moment");

/** Insert ONE row representing a period */
async function addShiftPeriod(empId, startDate, endDate, startTime, endTime) {
  if (
    !moment(startDate, "YYYY-MM-DD").isValid() ||
    !moment(endDate, "YYYY-MM-DD").isValid() ||
    moment(endDate).isBefore(startDate)
  ) {
    throw new Error("INVALID_DATE_RANGE");
  }

  await connection.query(
    `INSERT INTO shift_schedule
       (employee_id, start_date, end_date, shift_start, shift_end)
     VALUES (?,?,?,?,?)`,
    [empId, startDate, endDate, `${startTime}:00`, `${endTime}:00`]
  );
}

/** Build the matrix for one calendar month */
async function getMonthlyMatrix(year, month) {
  const first = moment({ year, month: month - 1, day: 1 }).format("YYYY-MM-DD");
  const last = moment(first).endOf("month").format("YYYY-MM-DD");

  // fetch periods that overlap this month
  const [rows] = await connection.query(
    `SELECT
         s.*,
         e.emp_id        AS employee_id, 
         e.name          AS employee_name,
         e.latitude,
         e.longitude,
         e.vehicle_id,
         e.max_assignments,
         e.current_load
     FROM shift_schedule   AS s
     JOIN employee_data    AS e   ON e.emp_id = s.employee_id
     WHERE NOT (s.end_date < ? OR s.start_date > ?)`,
    [first, last]
  );

  /** pivot: { empId: { name, days: { 'yyyy-mm-dd':'9‑5' } } } */
  const matrix = {};

  rows.forEach((r) => {
    const emp = (matrix[r.employee_id] ??= { name: r.employee_name, days: {} });
    const label = `${r.shift_start.slice(0, 5)}‑${r.shift_end.slice(0, 5)}`;

    for (
      let d = moment.max(moment(r.start_date), moment(first));
      d.isSameOrBefore(moment.min(moment(r.end_date), moment(last)));
      d.add(1, "day")
    ) {
      emp.days[d.format("YYYY-MM-DD")] = label;
    }
  });

  return { year, month, matrix };
}

module.exports = { addShiftPeriod, getMonthlyMatrix };
