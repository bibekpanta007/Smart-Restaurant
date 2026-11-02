import { useState } from 'react';
import { useReservations } from '../context/ReservationContext';

// how many bookings one time slot can take (simulates a limited number of tables)
const MAX_PER_SLOT = 3;

// time slots from 11:00 to 21:00 every 30 minutes
const timeSlots = [];
for (let hour = 11; hour <= 21; hour++) {
  timeSlots.push(`${hour}:00`);
  if (hour < 21) timeSlots.push(`${hour}:30`);
}

// today's date as YYYY-MM-DD in local time
function getToday() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  guests: 2,
  type: 'Regular',
  requirements: '',
};

function Reservations() {
  const { reservations, addReservation, cancelReservation } = useReservations();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [confirmation, setConfirmation] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function validate() {
    const newErrors = {};

    if (form.name.trim() === '') newErrors.name = 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Please enter a valid email.';
    if (form.phone.replace(/\D/g, '').length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number.';
    }

    if (!form.date) {
      newErrors.date = 'Please choose a date.';
    } else if (form.date < getToday()) {
      newErrors.date = 'The date cannot be in the past.';
    } else if (new Date(form.date + 'T00:00').getDay() === 1) {
      newErrors.date = 'Sorry, the restaurant is closed on Mondays.';
    }

        if (!form.time) {
      newErrors.time = 'Please choose a time.';
    } else if (form.date === getToday()) {
      // for today, the time must be later than now
      const [hour, minute] = form.time.split(':').map(Number);
      const now = new Date();
      if (hour < now.getHours() || (hour === now.getHours() && minute <= now.getMinutes())) {
        newErrors.time = 'This time has already passed. Please choose a later time.';
      }
    }

    const guests = Number(form.guests);
    if (guests < 1 || guests > 20) newErrors.guests = 'Guests must be between 1 and 20.';

    // prevent double booking: count active bookings in the same slot
    const bookedInSlot = reservations.filter(
      (r) => r.date === form.date && r.time === form.time && r.status !== 'Cancelled'
    ).length;
    if (form.date && form.time && bookedInSlot >= MAX_PER_SLOT) {
      newErrors.time = 'This time slot is fully booked. Please choose another time.';
    }

    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const reservation = addReservation({ ...form, guests: Number(form.guests) });
    setConfirmation(reservation); // show the success message
    setForm(emptyForm); // clear the form
  }

  return (
    <div>
      <h2 className="page-title">Book a Table</h2>

      {/* confirmation notification */}
      {confirmation && (
        <div className="success-box">
          <div>
            <h3>Reservation request received!</h3>
            <p>
              Thank you, {confirmation.name}. Your {confirmation.type === 'Regular' ? 'table' : confirmation.type.toLowerCase() + ' event'} for{' '}
              {confirmation.guests} guests on {confirmation.date} at {confirmation.time} is
              pending approval. A confirmation will be sent to {confirmation.email}.
            </p>
          </div>
          <button className="close-btn" onClick={() => setConfirmation(null)}>×</button>
        </div>
      )}

      <form className="reservation-form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label className="form-field">
            Full name
            <input name="name" value={form.name} onChange={handleChange} />
            {errors.name && <span className="error">{errors.name}</span>}
          </label>

          <label className="form-field">
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} />
            {errors.email && <span className="error">{errors.email}</span>}
          </label>

          <label className="form-field">
            Phone
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="403-555-1234" />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </label>

          <label className="form-field">
            Number of guests
            <input type="number" name="guests" min="1" max="20" value={form.guests} onChange={handleChange} />
            {errors.guests && <span className="error">{errors.guests}</span>}
          </label>

          <label className="form-field">
            Date
            <input type="date" name="date" min={getToday()} value={form.date} onChange={handleChange} />
            {errors.date && <span className="error">{errors.date}</span>}
          </label>

          <label className="form-field">
            Time
            <select name="time" value={form.time} onChange={handleChange}>
              <option value="">Select a time</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
            {errors.time && <span className="error">{errors.time}</span>}
          </label>

          <label className="form-field full-width">
            Reservation type
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="Regular">Regular table</option>
              <option value="Birthday">Birthday party</option>
              <option value="Corporate">Corporate gathering</option>
              <option value="Other">Other special event</option>
            </select>
          </label>

          {/* extra field only for special events */}
          {form.type !== 'Regular' && (
            <label className="form-field full-width">
              Additional requirements
              <textarea
                name="requirements"
                rows="3"
                value={form.requirements}
                onChange={handleChange}
                placeholder="e.g. birthday cake, projector, vegetarian set menu"
              />
            </label>
          )}
        </div>

        <button type="submit" className="btn">Book Now</button>
      </form>
            <h3 className="section-title">My Reservations</h3>

      {reservations.length === 0 ? (
        <p className="hint">You have no reservations yet.</p>
      ) : (
        <div className="reservation-list">
          {reservations.map((r) => (
            <div key={r.id} className="reservation-card">
              <div>
                <h4>{r.type === 'Regular' ? 'Table reservation' : `${r.type} event`}</h4>
                <p>{r.date} at {r.time} · {r.guests} guests</p>
                {r.requirements && <p className="hint">Notes: {r.requirements}</p>}
              </div>

              <div className="reservation-right">
                <span className={`status-badge status-${r.status.toLowerCase()}`}>
                  {r.status}
                </span>
                {r.status !== 'Cancelled' && (
                  <button
                    className="remove-btn"
                    onClick={() => {
                      if (window.confirm('Cancel this reservation?')) cancelReservation(r.id);
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reservations;