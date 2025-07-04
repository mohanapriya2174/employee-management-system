const svc = require("../services/shiftScheduleServies");

async function addShift(req, res, next) {
  try {
    const { employee_id, start_date, end_date, shift_start, shift_end } = req.body;
    await svc.addShiftPeriod(employee_id, start_date, end_date, shift_start, shift_end);
    res.json({ ok:true });
  } catch (e) {
    if (e.message === "INVALID_DATE_RANGE") {
      return res.status(400).json({ error:"Bad date range" });
    }
    next(e);
  }
}

async function monthView(req, res, next) {
  try {
    const { year, month } = req.params;
    const data = await svc.getMonthlyMatrix(+year, +month);
    res.json(data);
  } catch (e) { next(e); }
}

module.exports = { addShift, monthView };
