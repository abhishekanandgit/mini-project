import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

function BookAppointment() {
  const { currentUser } = useAuth();

  const {
    advocates,
    appointments,
    bookAppointment,
    getAvailableTimeSlots,
    isAppointmentSlotAvailable,
  } = useData();

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);

  const advocateIdFromURL = queryParams.get("advocateId");

  const verifiedAdvocates = useMemo(() => {
    return advocates.filter(
      (advocate) =>
        advocate.status === "verified" || advocate.verified === true
    );
  }, [advocates]);

  const [selectedAdvocateId, setSelectedAdvocateId] = useState(
    advocateIdFromURL || ""
  );

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [consultationType, setConsultationType] = useState(
    "Online Consultation"
  );

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookedDetails, setBookedDetails] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  const triggerToast = (type, title, msg) => {
    setToast({ show: true, type, title, message: msg });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4500);
  };

  const selectedAdvocate = verifiedAdvocates.find(
    (advocate) =>
      String(advocate.id) === String(selectedAdvocateId)
  );

  // --------------------------------------------------
  // AVAILABLE TIME SLOTS
  // --------------------------------------------------

  const availableSlots = useMemo(() => {
    if (!selectedAdvocateId || !date) {
      return [];
    }

    return getAvailableTimeSlots(selectedAdvocateId, date);
  }, [
    selectedAdvocateId,
    date,
    appointments,
    advocates,
    getAvailableTimeSlots,
  ]);

  const bookableSlots = useMemo(() => {
    return availableSlots.filter((slot) =>
      isAppointmentSlotAvailable(
        selectedAdvocateId,
        date,
        slot
      )
    );
  }, [
    availableSlots,
    selectedAdvocateId,
    date,
    appointments,
    advocates,
    isAppointmentSlotAvailable,
  ]);

  useEffect(() => {
    setTime("");
    setError("");
  }, [selectedAdvocateId, date]);

  // --------------------------------------------------
  // 1-WEEK AVAILABILITY LOGIC
  // --------------------------------------------------

  const [weekOffset, setWeekOffset] = useState(0);

  const handlePrevWeek = () => {
    setWeekOffset((prev) => Math.max(0, prev - 1));
  };

  const handleNextWeek = () => {
    setWeekOffset((prev) => prev + 1);
  };

  const weekDays = useMemo(() => {
    const todayObj = new Date();
    todayObj.setHours(0, 0, 0, 0);

    const DAYS_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const startDate = new Date(todayObj);
    startDate.setDate(startDate.getDate() + weekOffset * 7);

    const days = [];

    for (let i = 0; i < 7; i++) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + i);

      const year = current.getFullYear();
      const monthStr = String(current.getMonth() + 1).padStart(2, "0");
      const dayStr = String(current.getDate()).padStart(2, "0");
      const dateString = `${year}-${monthStr}-${dayStr}`;

      const dayKey = DAYS_KEYS[current.getDay()];
      const weekdayLabel = DAY_NAMES[current.getDay()];
      const monthLabel = MONTH_NAMES[current.getMonth()];
      const dateNum = current.getDate();

      const dayAvailability = selectedAdvocate?.availability?.[dayKey] || [];
      const hasAvailability = dayAvailability.length > 0;

      days.push({
        dateString,
        dayKey,
        weekdayLabel,
        monthLabel,
        dateNum,
        dayAvailability,
        hasAvailability,
        isToday: weekOffset === 0 && i === 0,
        isSelected: date === dateString,
      });
    }

    return days;
  }, [weekOffset, selectedAdvocate, date]);

  // --------------------------------------------------
  // TODAY
  // --------------------------------------------------

  const today = new Date();

  const todayString = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!currentUser) {
      const msg = "Please login as a user before booking an appointment.";
      setError(msg);
      triggerToast("danger", "Login Required", msg);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!selectedAdvocate) {
      const msg = "Please select an advocate from the dropdown menu above.";
      setError(msg);
      triggerToast("warning", "Advocate Required", msg);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!date) {
      const msg = "Please select an available green date from the calendar.";
      setError(msg);
      triggerToast("warning", "Date Required", msg);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!time) {
      const msg = "Please click an available 1-hour time slot button (e.g. 09:00, 10:00).";
      setError(msg);
      triggerToast("warning", "Time Slot Required", msg);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!reason.trim()) {
      const msg = "Please enter the reason for your legal consultation in the box below.";
      setError(msg);
      triggerToast("warning", "Consultation Reason Required", msg);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Final availability check
    const slotAvailable = isAppointmentSlotAvailable(
      selectedAdvocate.id,
      date,
      time
    );

    if (!slotAvailable) {
      const msg = "This time slot is no longer available. Please select another slot.";
      setError(msg);
      triggerToast("danger", "Slot Unavailable", msg);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const isOnline = consultationType === "Online Consultation";
    const meetingRoomId = `LegalAssist-Room-${selectedAdvocate.id.toString().slice(-4)}-${Date.now().toString().slice(-6)}`;
    const meetingLink = isOnline ? `https://meet.jit.si/${meetingRoomId}` : "";

    const appointment = {
      advocateId: selectedAdvocate.id,
      advocateName:
        selectedAdvocate.name ||
        selectedAdvocate.fullName ||
        "Advocate",

      advocateEmail: selectedAdvocate.email || "",

      userId: currentUser.id,
      userName:
        currentUser.name ||
        currentUser.fullName ||
        currentUser.username ||
        "User",

      userEmail: currentUser.email || "",
      userPhone: currentUser.phone || "",

      date,
      time,
      reason: reason.trim(),
      consultationType,
      meetingLink,
      district: selectedAdvocate.district || selectedAdvocate.location || "",
      officeAddress: selectedAdvocate.officeAddress || "",

      status: "Pending",
    };

    const result = await bookAppointment(appointment);

    if (!result.success) {
      setError(result.message);
      triggerToast("danger", "Booking Failed", result.message);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Smooth scroll page to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Show Toast and Centered Success Modal
    triggerToast(
      "success",
      "Appointment Requested!",
      `Consultation with ${selectedAdvocate.name} for ${date} at ${time} submitted successfully.`
    );

    setBookedDetails({
      advocateName: selectedAdvocate.name || "Advocate",
      date,
      time,
      consultationType,
    });
    setShowSuccessModal(true);

    setMessage(
      "Appointment booked successfully."
    );

    setDate("");
    setTime("");
    setReason("");

    setTimeout(() => {
      navigate("/user-dashboard");
    }, 4000);
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="fw-bold">Book an Appointment</h2>

        <p className="text-muted">
          Select an advocate, date and one of their available time slots.
        </p>
      </div>

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ADVOCATE */}

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white">
            <h5 className="mb-0">Select Advocate</h5>
          </div>

          <div className="card-body">
            <label className="form-label">
              Advocate
            </label>

            <select
              className="form-select"
              value={selectedAdvocateId}
              onChange={(e) =>
                setSelectedAdvocateId(e.target.value)
              }
            >
              <option value="">
                Select an advocate
              </option>

              {verifiedAdvocates.map((advocate) => (
                <option
                  key={advocate.id}
                  value={advocate.id}
                >
                  {advocate.name ||
                    advocate.fullName ||
                    "Advocate"}
                </option>
              ))}
            </select>

            {verifiedAdvocates.length === 0 && (
              <div className="alert alert-warning mt-3 mb-0">
                No verified advocates are currently available.
              </div>
            )}

            {selectedAdvocate && (
              <div className="border rounded p-3 mt-3">
                <h5 className="mb-1">
                  {selectedAdvocate.name ||
                    selectedAdvocate.fullName}
                </h5>

                <p className="mb-1 text-muted">
                  {selectedAdvocate.email}
                </p>

                {selectedAdvocate.specialization && (
                  <p className="mb-0">
                    <strong>Specialization:</strong>{" "}
                    {selectedAdvocate.specialization}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 1-WEEK AVAILABILITY STATUS (COMPACT & SLIM) */}
        <div className="card shadow-sm mb-4 border-0 rounded-3">
          <div className="card-header bg-white py-2 px-3 border-0 d-flex flex-wrap justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <h6 className="mb-0 fw-bold">
                <i className="bi bi-calendar-week me-1 text-primary"></i>
                Select Date
              </h6>
              {weekDays[0] && (
                <span className="text-muted small">
                  ({weekDays[0].dateNum} {weekDays[0].monthLabel} - {weekDays[6].dateNum} {weekDays[6].monthLabel})
                </span>
              )}
            </div>

            {/* Compact Legend & Navigation */}
            <div className="d-flex align-items-center gap-3 mt-1 mt-sm-0">
              <div className="d-flex align-items-center gap-2 small me-2 d-none d-md-flex">
                <span className="text-success fw-semibold"><i className="bi bi-circle-fill text-success small me-1"></i>Available</span>
                <span className="text-danger fw-semibold"><i className="bi bi-circle-fill text-danger small me-1"></i>Off</span>
              </div>

              <div className="btn-group btn-group-sm">
                <button
                  type="button"
                  className="btn btn-outline-secondary py-0 px-2"
                  onClick={handlePrevWeek}
                  disabled={weekOffset === 0}
                  title="Previous 7 Days"
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary py-0 px-2"
                  onClick={handleNextWeek}
                  title="Next 7 Days"
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="card-body p-2 p-md-3">
            {!selectedAdvocate ? (
              <div className="alert alert-info text-center py-3 mb-0 rounded-3 small">
                <i className="bi bi-info-circle me-1"></i>
                Select an advocate above to view their available green dates.
              </div>
            ) : (
              <div className="row g-1 text-center" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
                {weekDays.map((item) => {
                  const { dateString, dayKey, weekdayLabel, monthLabel, dateNum, hasAvailability, isToday, isSelected } = item;

                  let cardStyle = "border-danger bg-danger-subtle text-danger opacity-75";
                  let statusText = "Off";

                  if (hasAvailability) {
                    statusText = "Available";
                    if (isSelected) {
                      cardStyle = "border-dark bg-dark text-white fw-bold shadow-sm";
                    } else {
                      cardStyle = "border-success bg-success-subtle text-success fw-bold";
                    }
                  }

                  return (
                    <div key={dateString} className="px-1">
                      <div
                        className={`card rounded-2 p-1 text-center transition-all ${cardStyle}`}
                        style={{ cursor: "pointer", minHeight: "68px" }}
                        onClick={() => {
                          if (!hasAvailability) {
                            setError(`Advocate is not available on ${dayKey}s. Please choose a green date.`);
                            setDate("");
                          } else {
                            setDate(dateString);
                            setError("");
                          }
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center px-1" style={{ fontSize: "10px", textTransform: "uppercase" }}>
                          <span>{weekdayLabel}</span>
                          {isToday && <span className="badge bg-primary p-0 px-1 text-white" style={{ fontSize: "8px" }}>Today</span>}
                        </div>

                        <div className="fw-bold my-0 fs-6">
                          {dateNum} <span className="fw-normal" style={{ fontSize: "11px" }}>{monthLabel}</span>
                        </div>

                        <div className="mt-auto">
                          <span
                            className={`badge ${
                              hasAvailability
                                ? isSelected
                                  ? "bg-warning text-dark"
                                  : "bg-success text-white"
                                : "bg-danger text-white"
                            }`}
                            style={{ fontSize: "9px", padding: "2px 4px" }}
                          >
                            {isSelected ? "Selected" : statusText}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TIME SLOTS FOR SELECTED DATE */}
            {selectedAdvocate && date && (
              <div className="mt-4 pt-3 border-top">
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-clock me-2 text-primary"></i>
                  Available 1-Hour Time Slots for {date}
                </h6>

                {availableSlots.length === 0 ? (
                  <div className="alert alert-warning mb-0 rounded-3">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    This advocate has not configured availability for this day.
                  </div>
                ) : bookableSlots.length === 0 ? (
                  <div className="alert alert-danger mb-0 rounded-3">
                    <i className="bi bi-x-circle me-2"></i>
                    All 1-hour time slots for this date are already booked. Please select another green date.
                  </div>
                ) : (
                  <div>
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      {bookableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          className={`btn btn-sm ${
                            time === slot
                              ? "btn-dark fw-bold shadow-sm"
                              : "btn-outline-dark"
                          } rounded-pill px-3 py-2`}
                          onClick={() => setTime(slot)}
                        >
                          <i className="bi bi-clock me-1"></i>
                          {slot}
                        </button>
                      ))}
                    </div>
                    {time ? (
                      <small className="text-success fw-semibold">
                        <i className="bi bi-check-circle me-1"></i>
                        Selected 1-Hour Slot: {time}
                      </small>
                    ) : (
                      <small className="text-muted">
                        Click on an available 1-hour slot above to select it.
                      </small>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CONSULTATION */}

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white">
            <h5 className="mb-0">
              Consultation Details
            </h5>
          </div>

          <div className="card-body">
            <div className="mb-3">
              <label className="form-label fw-bold">
                Consultation Type
              </label>

              <select
                className="form-select"
                value={consultationType}
                onChange={(e) =>
                  setConsultationType(e.target.value)
                }
              >
                <option value="Online Consultation">
                  📹 Online Consultation (Video Meeting)
                </option>

                <option value="Office Consultation">
                  📍 Office Consultation (In-Person Visit)
                </option>
              </select>

              {consultationType === "Online Consultation" ? (
                <div className="alert alert-primary border-primary-subtle rounded-3 p-3 mt-3 mb-0">
                  <div className="fw-bold text-primary mb-1">
                    <i className="bi bi-camera-video-fill me-2"></i>
                    Virtual Video Consultation Details
                  </div>
                  <small className="d-block text-muted">
                    An online video call meeting link will be generated automatically upon booking. Once confirmed by the advocate, both of you can join the 1-on-1 video call directly from your dashboards!
                  </small>
                </div>
              ) : (
                <div className="alert alert-success border-success-subtle rounded-3 p-3 mt-3 mb-0">
                  <div className="fw-bold text-success mb-1">
                    <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                    In-Person Office Location Details
                  </div>
                  <div className="small">
                    <strong>District / City:</strong> {selectedAdvocate?.district || selectedAdvocate?.location || "Not specified"}<br />
                    <strong>Office Address:</strong> {selectedAdvocate?.officeAddress || "Office address provided upon booking confirmation."}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">
                Reason for Consultation
              </label>

              <textarea
                className="form-control"
                rows="5"
                placeholder="Briefly explain why you need legal consultation..."
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* USER DETAILS */}

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white">
            <h5 className="mb-0">
              Your Details
            </h5>
          </div>

          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">
                  Name
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={
                    currentUser?.name ||
                    currentUser?.fullName ||
                    currentUser?.username ||
                    ""
                  }
                  readOnly
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  className="form-control"
                  value={currentUser?.email || ""}
                  readOnly
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Phone
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={currentUser?.phone || ""}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {/* SUBMIT */}

        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary px-4 fw-bold shadow-sm"
          >
            <i className="bi bi-calendar-check me-2"></i>
            Book Appointment
          </button>
        </div>
      </form>

      {/* DYNAMIC FLOATING TOAST NOTIFICATION */}
      {toast.show && (
        <div
          className={`position-fixed top-0 start-50 translate-middle-x mt-4 shadow-lg rounded-4 p-3 border d-flex align-items-center gap-3 text-white ${
            toast.type === "success"
              ? "bg-dark border-success"
              : "bg-dark border-danger"
          }`}
          style={{
            zIndex: 100000,
            minWidth: "320px",
            maxWidth: "90%",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            className={`rounded-circle p-2 d-flex align-items-center justify-content-center ${
              toast.type === "success"
                ? "bg-success text-white"
                : toast.type === "danger"
                ? "bg-danger text-white"
                : "bg-warning text-dark"
            }`}
            style={{ width: "36px", height: "36px" }}
          >
            <i
              className={`bi ${
                toast.type === "success"
                  ? "bi-check-lg fs-5"
                  : toast.type === "danger"
                  ? "bi-exclamation-triangle-fill fs-6"
                  : "bi-info-circle-fill fs-6"
              }`}
            ></i>
          </div>

          <div className="flex-grow-1 me-2">
            <strong className="d-block text-white" style={{ fontSize: "14px" }}>
              {toast.title}
            </strong>
            <small className="text-light opacity-75" style={{ fontSize: "12px" }}>
              {toast.message}
            </small>
          </div>

          <button
            type="button"
            className="btn-close btn-close-white ms-auto"
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
          ></button>
        </div>
      )}

      {/* CENTERED SCREEN SUCCESS MESSAGE MODAL */}
      {showSuccessModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(5px)",
            zIndex: 99999,
          }}
        >
          <div
            className="card border-0 shadow-lg rounded-4 p-4 text-center bg-white"
            style={{ maxWidth: "440px", width: "100%" }}
          >
            <div className="card-body p-2">
              <div
                className="rounded-circle bg-success-subtle text-success d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: "75px", height: "75px" }}
              >
                <i className="bi bi-check-circle-fill display-5"></i>
              </div>

              <h4 className="fw-bold text-dark mb-2">Appointment Requested!</h4>

              <p className="text-muted small mb-3">
                Your consultation request with <strong className="text-dark">{bookedDetails?.advocateName}</strong> for <strong className="text-dark">{bookedDetails?.date} at {bookedDetails?.time}</strong> has been submitted successfully.
              </p>

              <div className="alert alert-light border rounded-3 p-2 mb-4 text-start small">
                <i className="bi bi-info-circle text-primary me-1"></i>
                <span className="text-muted">Status:</span> <span className="badge bg-warning text-dark ms-1">Pending Approval</span>
              </div>

              <button
                type="button"
                className="btn btn-dark rounded-pill w-100 py-2.5 fw-bold shadow-sm"
                onClick={() => navigate("/user-dashboard")}
              >
                Go to My Dashboard <i className="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookAppointment;