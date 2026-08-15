import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

const DAYS = [
  {
    key: "monday",
    label: "Monday",
  },
  {
    key: "tuesday",
    label: "Tuesday",
  },
  {
    key: "wednesday",
    label: "Wednesday",
  },
  {
    key: "thursday",
    label: "Thursday",
  },
  {
    key: "friday",
    label: "Friday",
  },
  {
    key: "saturday",
    label: "Saturday",
  },
  {
    key: "sunday",
    label: "Sunday",
  },
];

const createEmptyAvailability = () => ({
  sunday: [],
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
});

function AdvocateAvailability() {
  const { currentUser } = useAuth();

  const {
    advocates,
    updateAdvocateAvailability,
    getAdvocateAppointments,
  } = useData();

  const navigate = useNavigate();

  const [availability, setAvailability] = useState(
    createEmptyAvailability()
  );

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const advocate = advocates.find(
    (item) => String(item.id) === String(currentUser?.id) || item.email === currentUser?.email
  );

  const isApprovedAdvocate =
    currentUser?.role === "advocate" &&
    (currentUser?.status === "verified" || currentUser?.verified === true || advocate?.status === "verified" || advocate?.verified === true);

  useEffect(() => {
    if (advocate) {
      setAvailability({
        ...createEmptyAvailability(),
        ...(advocate.availability || {}),
      });
    }
  }, [advocate]);

  if (!currentUser) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning rounded-4 p-4 shadow-sm">
          <h5 className="fw-bold mb-2">Login Required</h5>
          <p className="mb-3">Please log in to manage your appointment availability.</p>
          <Link to="/login" className="btn btn-dark rounded-pill">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (currentUser.role !== "advocate") {
    return (
      <div className="container py-5">
        <div className="alert alert-danger rounded-4 p-4 shadow-sm">
          <h5 className="fw-bold mb-2">Access Restricted</h5>
          <p className="mb-0">Only registered advocates can manage appointment availability.</p>
        </div>
      </div>
    );
  }

  if (!isApprovedAdvocate) {
    return (
      <div className="container py-5">
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4 p-md-5 text-center">
            <div
              className="bg-danger-subtle text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: "70px", height: "70px" }}
            >
              <i className="bi bi-shield-lock fs-1"></i>
            </div>
            <h3 className="fw-bold mb-2">Admin Approval Required</h3>
            <p className="text-muted mb-4">
              Only approved advocates can manage their appointment availability.
              Your advocate account is currently pending administrator review and verification.
            </p>
            <Link to="/advocate-dashboard" className="btn btn-dark rounded-pill px-4">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!advocate) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger rounded-4 p-4 shadow-sm">
          <h5 className="fw-bold mb-2">Profile Not Found</h5>
          <p className="mb-0">Your advocate profile could not be located.</p>
        </div>
      </div>
    );
  }

  const handleAddSlot = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: [
        ...(prev[day] || []),
        {
          start: "09:00",
          end: "17:00",
        },
      ],
    }));

    setMessage("");
    setError("");
  };

  const handleRemoveSlot = (day, index) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, slotIndex) => slotIndex !== index),
    }));

    setMessage("");
    setError("");
  };

  const handleSlotChange = (day, index, field, value) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: prev[day].map((slot, slotIndex) =>
        slotIndex === index
          ? {
              ...slot,
              [field]: value,
            }
          : slot
      ),
    }));

    setMessage("");
    setError("");
  };

  const handleApplyStandardWeekdays = () => {
    setAvailability((prev) => ({
      ...prev,
      monday: [{ start: "09:00", end: "17:00" }],
      tuesday: [{ start: "09:00", end: "17:00" }],
      wednesday: [{ start: "09:00", end: "17:00" }],
      thursday: [{ start: "09:00", end: "17:00" }],
      friday: [{ start: "09:00", end: "17:00" }],
    }));
    setMessage("Standard weekday hours (09:00 - 17:00) applied. Click Save to publish.");
    setError("");
  };

  const handleCopyMondayToWeekdays = () => {
    const mondaySlots = availability.monday || [{ start: "09:00", end: "17:00" }];
    setAvailability((prev) => ({
      ...prev,
      tuesday: JSON.parse(JSON.stringify(mondaySlots)),
      wednesday: JSON.parse(JSON.stringify(mondaySlots)),
      thursday: JSON.parse(JSON.stringify(mondaySlots)),
      friday: JSON.parse(JSON.stringify(mondaySlots)),
    }));
    setMessage("Monday's schedule copied to Tue–Fri. Click Save to publish.");
    setError("");
  };

  const handleClearAllDays = () => {
    setAvailability(createEmptyAvailability());
    setMessage("All availability reset. Click Save to publish.");
    setError("");
  };

  const validateAvailability = () => {
    for (const day of DAYS) {
      const slots = availability[day.key] || [];

      for (const slot of slots) {
        if (!slot.start || !slot.end) {
          return `Please select both start and end time for ${day.label}.`;
        }

        if (slot.start >= slot.end) {
          return `End time must be after start time on ${day.label}.`;
        }
      }

      for (let i = 0; i < slots.length; i++) {
        for (let j = i + 1; j < slots.length; j++) {
          const first = slots[i];
          const second = slots[j];

          const firstStart = first.start;
          const firstEnd = first.end;

          const secondStart = second.start;
          const secondEnd = second.end;

          const overlap =
            firstStart < secondEnd && secondStart < firstEnd;

          if (overlap) {
            return `${day.label} has overlapping availability periods.`;
          }
        }
      }
    }

    return null;
  };

  const hasFutureAppointmentOutsideNewAvailability = () => {
    const advocateAppointments = getAdvocateAppointments(advocate.id);

    const activeAppointments = advocateAppointments.filter((appointment) =>
      ["Pending", "pending", "Accepted", "accepted", "Confirmed", "confirmed"].includes(
        appointment.status
      )
    );

    for (const appointment of activeAppointments) {
      const appointmentDate = new Date(
        `${appointment.date}T${appointment.time}:00`
      );

      if (appointmentDate < new Date()) {
        continue;
      }

      const dateParts = appointment.date.split("-").map(Number);

      if (dateParts.length !== 3) {
        continue;
      }

      const [year, month, day] = dateParts;

      const localDate = new Date(year, month - 1, day);

      const dayKey = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ][localDate.getDay()];

      const slots = availability[dayKey] || [];

      const appointmentMinutes =
        Number(appointment.time.split(":")[0]) * 60 +
        Number(appointment.time.split(":")[1]);

      const stillAvailable = slots.some((slot) => {
        const start =
          Number(slot.start.split(":")[0]) * 60 +
          Number(slot.start.split(":")[1]);

        const end =
          Number(slot.end.split(":")[0]) * 60 +
          Number(slot.end.split(":")[1]);

        return appointmentMinutes >= start && appointmentMinutes < end;
      });

      if (!stillAvailable) {
        return appointment;
      }
    }

    return null;
  };

  const handleSave = () => {
    setMessage("");
    setError("");

    const validationError = validateAvailability();

    if (validationError) {
      setError(validationError);
      return;
    }

    const affectedAppointment =
      hasFutureAppointmentOutsideNewAvailability();

    if (affectedAppointment) {
      setError(
        `You cannot remove this availability because you already have an appointment on ${affectedAppointment.date} at ${affectedAppointment.time}.`
      );
      return;
    }

    setSaving(true);

    updateAdvocateAvailability(advocate.id, availability);

    setTimeout(() => {
      setSaving(false);
      setMessage("Availability saved successfully.");
    }, 500);
  };

  const handleToggleDay = (dayKey) => {
    setAvailability((prev) => {
      const current = prev[dayKey] || [];
      if (current.length > 0) {
        return { ...prev, [dayKey]: [] };
      } else {
        return { ...prev, [dayKey]: [{ start: "09:00", end: "17:00" }] };
      }
    });
    setMessage("");
    setError("");
  };

  return (
    <div className="container py-4" style={{ maxWidth: "800px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="fw-bold mb-1">
            <i className="bi bi-clock-history me-2 text-primary"></i>
            Manage Availability
          </h3>
          <p className="text-muted small mb-0">
            Set your weekly working hours. Appointment duration: 1 hour.
          </p>
        </div>

        <Link to="/advocate-dashboard" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
          <i className="bi bi-arrow-left me-1"></i>
          Dashboard
        </Link>
      </div>

      {message && (
        <div className="alert alert-success py-2 px-3 small rounded-3 mb-3">
          <i className="bi bi-check-circle me-1"></i>
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3">
          <i className="bi bi-exclamation-triangle me-1"></i>
          {error}
        </div>
      )}

      {/* ULTRA-COMPACT 7-DAY AVAILABILITY CARD */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
        <div className="card-header bg-white py-2 px-3 border-bottom d-flex flex-wrap justify-content-between align-items-center">
          <span className="fw-bold text-dark small">Weekly Schedule</span>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-primary btn-xs py-1 px-2 rounded-pill small"
              style={{ fontSize: "11px" }}
              onClick={handleApplyStandardWeekdays}
            >
              <i className="bi bi-lightning me-1"></i>
              Mon-Fri (9 AM - 5 PM)
            </button>
            <button
              type="button"
              className="btn btn-outline-danger btn-xs py-1 px-2 rounded-pill small"
              style={{ fontSize: "11px" }}
              onClick={handleClearAllDays}
            >
              <i className="bi bi-x-circle me-1"></i>
              Clear All
            </button>
          </div>
        </div>

        <div className="card-body p-2 p-md-3">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead>
                <tr className="text-muted text-uppercase" style={{ fontSize: "11px" }}>
                  <th style={{ width: "25%" }}>Day</th>
                  <th style={{ width: "20%" }}>Status</th>
                  <th style={{ width: "45%" }}>Working Hours</th>
                  <th style={{ width: "10%" }} className="text-end">Shift</th>
                </tr>
              </thead>
              <tbody>
                {DAYS.map((day) => {
                  const slots = availability[day.key] || [];
                  const isWorking = slots.length > 0;

                  return (
                    <tr key={day.key} className={isWorking ? "table-light-subtle" : ""}>
                      <td className="fw-bold text-dark py-2">
                        <div className="form-check form-switch d-flex align-items-center gap-2 mb-0">
                          <input
                            className="form-check-input mt-0"
                            type="checkbox"
                            role="switch"
                            id={`switch-${day.key}`}
                            checked={isWorking}
                            onChange={() => handleToggleDay(day.key)}
                            style={{ cursor: "pointer" }}
                          />
                          <label className="form-check-label mb-0" htmlFor={`switch-${day.key}`} style={{ cursor: "pointer" }}>
                            {day.label}
                          </label>
                        </div>
                      </td>

                      <td className="py-2">
                        {isWorking ? (
                          <span className="badge bg-success-subtle text-success border border-success px-2 py-1">
                            <i className="bi bi-circle-fill me-1" style={{ fontSize: "7px" }}></i>
                            Working Day
                          </span>
                        ) : (
                          <span className="badge bg-light text-secondary border px-2 py-1 opacity-75">
                            Off Day
                          </span>
                        )}
                      </td>

                      <td className="py-2">
                        {!isWorking ? (
                          <span className="text-muted fst-italic">Unavailable (Click switch to enable)</span>
                        ) : (
                          <div className="d-flex flex-column gap-1">
                            {slots.map((slot, index) => (
                              <div key={`${day.key}-${index}`} className="d-flex align-items-center gap-1">
                                <input
                                  type="time"
                                  className="form-control form-control-sm py-0 px-2"
                                  style={{ width: "110px" }}
                                  value={slot.start}
                                  onChange={(e) =>
                                    handleSlotChange(day.key, index, "start", e.target.value)
                                  }
                                />
                                <span className="text-muted small">to</span>
                                <input
                                  type="time"
                                  className="form-control form-control-sm py-0 px-2"
                                  style={{ width: "110px" }}
                                  value={slot.end}
                                  onChange={(e) =>
                                    handleSlotChange(day.key, index, "end", e.target.value)
                                  }
                                />

                                {slots.length > 1 && (
                                  <button
                                    type="button"
                                    className="btn btn-link text-danger p-0 ms-1"
                                    onClick={() => handleRemoveSlot(day.key, index)}
                                    title="Remove shift"
                                  >
                                    <i className="bi bi-x-lg"></i>
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>

                      <td className="py-2 text-end">
                        {isWorking && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-xs py-0 px-2"
                            style={{ fontSize: "10px" }}
                            onClick={() => handleAddSlot(day.key)}
                            title="Add extra shift"
                          >
                            + Shift
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-footer bg-light p-3 text-center border-top">
          <button
            type="button"
            className="btn btn-success rounded-pill px-5 fw-bold shadow-sm"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Saving...
              </>
            ) : (
              <>
                <i className="bi bi-check2-circle me-1"></i>
                Save Availability
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdvocateAvailability;