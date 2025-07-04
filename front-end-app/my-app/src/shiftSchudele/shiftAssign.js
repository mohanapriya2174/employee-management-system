import { useState } from "react"; // ← import the stylesheet

export default function AdminShiftForm({ onSaved }) {
  const [form, setForm] = useState({
    employee_id: "",
    start_date: "",
    end_date: "",
    shift_start: "09:00",
    shift_end: "17:00",
  });

  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function save(e) {
    e.preventDefault();
    const res = await fetch("http://localhost:4000/api/shift-range", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Shift saved");
      onSaved?.();
      setForm((f) => ({ ...f, employee_id: "" })); // clear ID for next add
    } else {
      const { error } = await res.json();
      alert(error || "Error");
    }
  }

  return (
    <form className="shift-form" onSubmit={save}>
      <input
        className="shift-input"
        type="number"
        placeholder="Emp ID"
        value={form.employee_id}
        onChange={upd("employee_id")}
        required
      />

      <input
        className="shift-input"
        type="date"
        value={form.start_date}
        onChange={upd("start_date")}
        required
      />

      <input
        className="shift-input"
        type="date"
        value={form.end_date}
        onChange={upd("end_date")}
        required
      />

      <input
        className="shift-input"
        type="time"
        value={form.shift_start}
        onChange={upd("shift_start")}
        required
      />

      <input
        className="shift-input"
        type="time"
        value={form.shift_end}
        onChange={upd("shift_end")}
        required
      />

      <button className="shift-btn">Save</button>
    </form>
  );
}
