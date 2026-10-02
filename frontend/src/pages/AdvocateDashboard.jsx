import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import CaseStageTimeline from "../components/CaseStageTimeline";
import ContactAdminModal from "../components/ContactAdminModal";

const AdvocateDashboard = () => {
  const { currentUser, updateUser } = useAuth();
  const [showContactAdminModal, setShowContactAdminModal] = useState(false);

  const {
    advocates,
    appointments,
    cases,
    reviews,
    sosAlerts,
    resolveSOS,
    updateAdvocateProfile,
    updateAppointmentStatus,
    createCase,
    updateCaseStage,
    updateCaseStageNote,
    uploadCaseDocument,
    getAdvocateRating,
  } = useData();

  const myProfile = useMemo(() => {
    return (
      advocates.find(
        (advocate) => advocate.id === currentUser?.id
      ) ||
      advocates.find(
        (advocate) => advocate.email === currentUser?.email
      ) ||
      currentUser
    );
  }, [advocates, currentUser]);

  const [activeTab, setActiveTab] = useState("overview");

  const [editBio, setEditBio] = useState(
    myProfile?.bio || ""
  );

  const [editFees, setEditFees] = useState(
    myProfile?.fees ?? ""
  );

  const [editExp, setEditExp] = useState(
    myProfile?.experience ?? ""
  );

  const [editSpec, setEditSpec] = useState(
    myProfile?.specialization || ""
  );

  const [editDistrict, setEditDistrict] = useState(
    myProfile?.district || currentUser?.district || ""
  );

  const [editOfficeAddress, setEditOfficeAddress] = useState(
    myProfile?.officeAddress || currentUser?.officeAddress || ""
  );

  const [newClientName, setNewClientName] = useState("");
  const [newCourtName, setNewCourtName] = useState("");
  const [nextHearing, setNextHearing] = useState("");
  const [newCaseTitle, setNewCaseTitle] = useState("");

  const [message, setMessage] = useState("");
  const [rejectingApptId, setRejectingApptId] = useState(null);
  const [rejectionReasonText, setRejectionReasonText] = useState("");
  const [callModalTarget, setCallModalTarget] = useState(null);

  const handleOpenCallModal = (name, phone, email) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/[^0-9+]/g, "");
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      // On mobile devices: launch native phone dialer with number pre-dialed
      window.location.href = `tel:${cleanPhone}`;
    } else {
      // On Desktop PC: launch instant Web Video/Audio Call directly in a new tab
      const meetingRoom = `LegalAssist-DirectCall-${cleanPhone.slice(-6)}-${Date.now().toString().slice(-4)}`;
      window.open(`https://meet.jit.si/${meetingRoom}`, "_blank");
      setMessage(`Launching instant Web Call room for ${name || "Client"} (${phone})...`);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  const myAppointments = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    return appointments.filter(
      (appointment) =>
        String(appointment.advocateId) === String(currentUser.id) ||
        appointment.advocateEmail === currentUser.email
    );
  }, [appointments, currentUser]);

  const myCases = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    return cases.filter(
      (caseItem) =>
        String(caseItem.advocateId) === String(currentUser.id) ||
        caseItem.advocateEmail === currentUser.email
    );
  }, [cases, currentUser]);

  const myReviews = useMemo(() => {
    if (!currentUser) return [];
    return (reviews || []).filter(
      (r) => String(r.advocateId) === String(currentUser.id) || r.advocateEmail === currentUser.email
    );
  }, [reviews, currentUser]);

  const mySOSAlerts = useMemo(() => {
    if (!currentUser) return [];
    return (sosAlerts || []).filter(
      (s) => String(s.advocateId) === String(currentUser.id) || s.advocateEmail === currentUser.email
    );
  }, [sosAlerts, currentUser]);

  const activeSOSAlerts = useMemo(() => {
    return mySOSAlerts.filter((s) => (s.status || "").toLowerCase() !== "resolved");
  }, [mySOSAlerts]);

  const { avgRating, count: myReviewCount } = getAdvocateRating(currentUser?.id);

  const pendingAppointments = myAppointments.filter(
    (appointment) => (appointment.status || "").toLowerCase() === "pending"
  );

  const acceptedAppointments = myAppointments.filter(
    (appointment) =>
      ["accepted", "confirmed"].includes((appointment.status || "").toLowerCase())
  );

  const activeCases = myCases.filter(
    (caseItem) =>
      caseItem.stage !== "Closed" &&
      caseItem.stage !== "Completed"
  );

  const handleSaveProfile = () => {
    const updatedProfile = {
      bio: editBio,
      fees: Number(editFees) || 0,
      experience: Number(editExp) || 0,
      specialization: editSpec,
      district: editDistrict,
      officeAddress: editOfficeAddress,
    };

    if (myProfile?.id) {
      updateAdvocateProfile(
        myProfile.id,
        updatedProfile
      );
    }

    updateUser(updatedProfile);

    setMessage("Profile updated successfully.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleAppointmentStatus = (
    appointmentId,
    status,
    rejectionReason = ""
  ) => {
    const finalReason = rejectionReason.trim() || (status === "Rejected" ? "Advocate is unavailable at the requested time slot." : "");

    updateAppointmentStatus(
      appointmentId,
      status,
      finalReason
    );

    setRejectingApptId(null);
    setRejectionReasonText("");

    setMessage(
      `Appointment ${status} successfully.`
    );

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleCreateCase = (appointment) => {
    if (!appointment) {
      return;
    }

    const clientName =
      appointment.userName ||
      appointment.clientName ||
      "";

    const caseTitle =
      newCaseTitle.trim() ||
      `${clientName} - Legal Case`;

    createCase({
      title: caseTitle,
      clientId: appointment.userId || "",
      clientName,
      clientEmail: appointment.userEmail || "",
      clientPhone: appointment.userPhone || "",

      advocateId: currentUser?.id || "",
      advocateName: currentUser?.name || "",
      advocateEmail: currentUser?.email || "",

      appointmentId: appointment.id,

      court: newCourtName.trim(),
      nextHearing: nextHearing || "",

      stage: "Consultation",
      documents: [],
    });

    setNewCaseTitle("");
    setNewCourtName("");
    setNextHearing("");

    setActiveTab("cases");
    setMessage("Case created successfully for client. Switched to Cases page.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleCreateManualCase = () => {
    if (!newClientName.trim()) {
      setMessage("Please enter the client name.");
      return;
    }

    createCase({
      title:
        newCaseTitle.trim() ||
        `${newClientName.trim()} - Legal Case`,

      clientId: "",
      clientName: newClientName.trim(),
      clientEmail: "",
      clientPhone: "",

      advocateId: currentUser?.id || "",
      advocateName: currentUser?.name || "",
      advocateEmail: currentUser?.email || "",

      appointmentId: "",

      court: newCourtName.trim(),
      nextHearing: nextHearing || "",

      stage: "Consultation",
      documents: [],
    });

    setNewClientName("");
    setNewCaseTitle("");
    setNewCourtName("");
    setNextHearing("");

    setMessage("Case created successfully.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleCaseStage = (caseId, stage) => {
    updateCaseStage(caseId, stage);

    setMessage("Case stage updated.");

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const handleSaveStageNote = (caseId, stage, note, setAsCurrent = false) => {
    updateCaseStageNote(caseId, stage, note, currentUser?.name || "Advocate", setAsCurrent);

    setMessage(`Stage note for "${stage}" saved successfully.`);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };


  const handleDocumentUpload = (
    caseId,
    event
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const documentData = {
      id: `document-${Date.now()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    };

    uploadCaseDocument(
      caseId,
      documentData
    );

    setMessage("Document added to case.");

    setTimeout(() => {
      setMessage("");
    }, 2500);

    event.target.value = "";
  };

  if (!currentUser) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Please login as an advocate to access this page.
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container">

        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">
              Advocate Dashboard
            </h2>

            <p className="text-muted mb-0">
              Welcome, {currentUser.name}
            </p>
          </div>

          <div className="d-flex align-items-center flex-wrap gap-2 mt-3 mt-md-0">
            <span
              className={`badge rounded-pill px-3 py-2 ${
                currentUser.status === "verified" || myProfile?.status === "verified"
                  ? "bg-success"
                  : "bg-danger text-white"
              }`}
            >
              {currentUser.status === "verified" || myProfile?.status === "verified"
                ? "Verified Advocate"
                : "Pending Verification"}
            </span>

            {currentUser.status === "verified" || myProfile?.status === "verified" ? (
              <Link
                to="/advocate-availability"
                className="btn btn-danger text-white rounded-pill px-3 fw-bold ms-md-2"
              >
                <i className="bi bi-calendar-range me-1"></i>
                Manage Availability
              </Link>
            ) : (
              <button
                disabled
                className="btn btn-outline-secondary rounded-pill px-3 ms-md-2 opacity-75"
                title="Admin approval required to set appointment availability"
              >
                <i className="bi bi-lock me-1"></i>
                Availability Locked (Pending Approval)
              </button>
            )}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="alert alert-success rounded-3">
            {message}
          </div>
        )}

        {/* Navigation */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body">
            <div className="d-flex flex-wrap gap-2">
              <button
                className={`btn rounded-pill ${
                  activeTab === "overview"
                    ? "btn-dark"
                    : "btn-outline-dark"
                }`}
                onClick={() =>
                  setActiveTab("overview")
                }
              >
                Overview
              </button>

              <button
                className={`btn rounded-pill ${
                  activeTab === "appointments"
                    ? "btn-dark"
                    : "btn-outline-dark"
                }`}
                onClick={() =>
                  setActiveTab("appointments")
                }
              >
                Appointments
              </button>

              <button
                className={`btn rounded-pill ${
                  activeTab === "cases"
                    ? "btn-dark"
                    : "btn-outline-dark"
                }`}
                onClick={() =>
                  setActiveTab("cases")
                }
              >
                Cases
              </button>

              <button
                className={`btn rounded-pill ${
                  activeTab === "profile"
                    ? "btn-dark"
                    : "btn-outline-dark"
                }`}
                onClick={() =>
                  setActiveTab("profile")
                }
              >
                My Profile
              </button>

              <button
                className={`btn rounded-pill ${
                  activeTab === "reviews"
                    ? "btn-dark"
                    : "btn-outline-dark"
                }`}
                onClick={() =>
                  setActiveTab("reviews")
                }
              >
                <i className="bi bi-star-fill text-warning me-1"></i>
                Reviews & Ratings ({myReviews.length})
              </button>

              <button
                className={`btn rounded-pill ${
                  activeTab === "sos"
                    ? "btn-danger text-white fw-bold shadow-sm"
                    : activeSOSAlerts.length > 0
                    ? "btn-outline-danger fw-bold border-2"
                    : "btn-outline-secondary"
                }`}
                onClick={() =>
                  setActiveTab("sos")
                }
              >
                <i className="bi bi-bell-fill me-1"></i>
                Emergency SOS
                {activeSOSAlerts.length > 0 && (
                  <span className="badge bg-danger text-white ms-2 rounded-pill">
                    {activeSOSAlerts.length} Active
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <>
            {activeSOSAlerts.length > 0 && (
              <div className="alert alert-danger border border-danger shadow-sm rounded-4 mb-4 p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-danger text-white rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>
                    <i className="bi bi-bell-fill fs-4"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1 text-danger">
                      🚨 URGENT: {activeSOSAlerts.length} Client Emergency SOS Alert(s)!
                    </h5>
                    <p className="mb-0 text-dark small">
                      Client(s) have triggered emergency help messages requesting immediate advocate response.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-danger text-white rounded-pill px-4 fw-bold shadow-sm text-nowrap"
                  onClick={() => setActiveTab("sos")}
                >
                  View Emergency Alerts ({activeSOSAlerts.length})
                </button>
              </div>
            )}

            <div className="row g-4 mb-4">

              <div className="col-md-3">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body">
                    <p className="text-muted mb-1">
                      Appointments
                    </p>

                    <h3 className="fw-bold mb-0">
                      {myAppointments.length}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body">
                    <p className="text-muted mb-1">
                      Pending
                    </p>

                    <h3 className="fw-bold mb-0">
                      {pendingAppointments.length}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body">
                    <p className="text-muted mb-1">
                      Active Cases
                    </p>

                    <h3 className="fw-bold mb-0">
                      {activeCases.length}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body">
                    <p className="text-muted mb-1">
                      Cases Handled
                    </p>

                    <h3 className="fw-bold mb-0">
                      {myProfile?.casesHandled || 0}
                    </h3>
                  </div>
                </div>
              </div>

            </div>

            {/* Profile Summary */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">

                <h4 className="fw-bold mb-4">
                  Professional Information
                </h4>

                <div className="row g-4">

                  <div className="col-md-6">
                    <small className="text-muted">
                      Name
                    </small>

                    <p className="fw-semibold mb-0">
                      {currentUser.name}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted">
                      Email
                    </small>

                    <p className="fw-semibold mb-0">
                      {currentUser.email}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted">
                      Phone
                    </small>

                    <p className="fw-semibold mb-0">
                      {currentUser.phone || "Not provided"}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted">
                      Bar Council ID
                    </small>

                    <p className="fw-semibold mb-0">
                      {currentUser.barId || "Not provided"}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted">
                      Specialization
                    </small>

                    <p className="fw-semibold mb-0">
                      {myProfile?.specialization ||
                        "Not specified"}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted">
                      Experience
                    </small>

                    <p className="fw-semibold mb-0">
                      {myProfile?.experience ?? 0} years
                    </p>
                  </div>

                </div>

              </div>
            </div>

            {/* Recent Appointments */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="fw-bold mb-0">
                    Recent Appointments
                  </h4>

                  <button
                    className="btn btn-outline-dark btn-sm rounded-pill"
                    onClick={() =>
                      setActiveTab("appointments")
                    }
                  >
                    View All
                  </button>
                </div>

                {myAppointments.length === 0 ? (
                  <p className="text-muted mb-0">
                    No appointments available.
                  </p>
                ) : (
                  <div className="table-responsive">
                    <table className="table align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Client</th>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {myAppointments
                          .slice(0, 5)
                          .map((appointment) => (
                            <tr
                              key={appointment.id}
                            >
                              <td>
                                {appointment.userName ||
                                  appointment.clientName ||
                                  "Client"}
                              </td>

                              <td>
                                {appointment.date ||
                                  "Not scheduled"}
                              </td>

                              <td>
                                <span className="badge bg-secondary">
                                  {appointment.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            </div>
          </>
        )}

        {/* APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">

              <h4 className="fw-bold mb-4">
                Appointment Requests
              </h4>

              {myAppointments.length === 0 ? (
                <div className="text-center py-5">
                  <h5 className="fw-semibold">
                    No appointments
                  </h5>

                  <p className="text-muted mb-0">
                    You do not have any appointment
                    requests yet.
                  </p>
                </div>
              ) : (
                <div className="row g-4">
                  {myAppointments.map((appointment) => {
                    const statusLower = (appointment.status || "").toLowerCase();
                    const isPending = statusLower === "pending";
                    const isAccepted = statusLower === "accepted" || statusLower === "confirmed";
                    const isRejected = statusLower === "rejected";

                    return (
                      <div className="col-lg-6" key={appointment.id}>
                        <div className="card border rounded-4 h-100 shadow-sm">
                          <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h5 className="fw-bold mb-0">
                                {appointment.userName || appointment.clientName || "Client"}
                              </h5>
                              <span
                                className={`badge ${
                                  isAccepted
                                    ? "bg-success"
                                    : isRejected
                                    ? "bg-danger"
                                    : "bg-warning text-dark"
                                }`}
                              >
                                {appointment.status}
                              </span>
                            </div>

                            <p className="mb-2">
                              <strong>Email:</strong> {appointment.userEmail || "Not provided"}
                            </p>
                            <p className="mb-2">
                              <strong>Phone:</strong>{" "}
                              {appointment.userPhone ? (
                                <button
                                  type="button"
                                  className="btn btn-link btn-sm p-0 text-decoration-none fw-bold text-danger"
                                  onClick={() => handleOpenCallModal(appointment.userName, appointment.userPhone, appointment.userEmail)}
                                >
                                  <i className="bi bi-telephone-fill me-1"></i>
                                  {appointment.userPhone}
                                </button>
                              ) : (
                                "Not provided"
                              )}
                            </p>
                            <p className="mb-2">
                              <strong>Date:</strong> {appointment.date || "Not scheduled"}
                            </p>
                            <p className="mb-3">
                              <strong>Time:</strong> {appointment.time || "Not scheduled"}
                            </p>

                             {(appointment.consultationType === "Online Consultation" || appointment.meetingLink) && (appointment.status || "").toLowerCase() !== "rejected" && (
                              <div className="bg-primary-subtle border border-primary-subtle rounded-3 p-3 mb-3">
                                <small className="text-primary d-block mb-1 fw-bold"><i className="bi bi-camera-video-fill me-1"></i> Virtual Video Consultation Link:</small>
                                <a
                                  href={appointment.meetingLink || `https://meet.jit.si/LegalAssist-Room-${appointment.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-primary btn-sm rounded-pill px-3 fw-bold shadow-sm"
                                >
                                  <i className="bi bi-camera-video-fill me-1"></i>
                                  Join Video Meeting with Client
                                </a>
                              </div>
                            )}

                            {(appointment.reason || appointment.notes) && (
                              <div className="bg-light rounded-3 p-3 mb-3">
                                <small className="text-muted d-block fw-bold">Client Consultation Reason:</small>
                                <p className="mb-0 mt-1 small">{appointment.reason || appointment.notes}</p>
                              </div>
                            )}

                            {(appointment.rejectionReason || isRejected) && rejectingApptId !== appointment.id && (
                              <div className="bg-danger-subtle border border-danger-subtle text-danger rounded-3 p-3 mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <small className="fw-bold"><i className="bi bi-info-circle me-1"></i> Rejection Reason Sent:</small>
                                  {isRejected && (
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-outline-danger py-0 px-2 rounded-pill"
                                      style={{ fontSize: "11px" }}
                                      onClick={() => {
                                        setRejectingApptId(appointment.id);
                                        setRejectionReasonText(appointment.rejectionReason || "");
                                      }}
                                    >
                                      <i className="bi bi-pencil me-1"></i> Edit Reason
                                    </button>
                                  )}
                                </div>
                                <p className="mb-0 small fw-semibold text-dark">
                                  {appointment.rejectionReason || "No specific reason written yet."}
                                </p>
                              </div>
                            )}

                            {/* PENDING / REJECT EDIT ACTIONS */}
                            {(isPending || (isRejected && rejectingApptId === appointment.id)) && (
                              <div>
                                {rejectingApptId === appointment.id ? (
                                  <div className="bg-light p-3 rounded-3 border border-danger mb-2 shadow-sm">
                                    <label className="form-label small fw-bold text-danger mb-2">
                                      <i className="bi bi-chat-left-text me-1"></i>
                                      {isRejected ? "Update Rejection Reason:" : "Rejection Reason (Message sent to User):"}
                                    </label>

                                    {/* Quick Selection Buttons */}
                                    <div className="d-flex flex-wrap gap-1 mb-2">
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary rounded-pill py-0 px-2"
                                        style={{ fontSize: "11px" }}
                                        onClick={() => setRejectionReasonText("Court hearing scheduled at requested date/time.")}
                                      >
                                        ⚖️ Court Hearing
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary rounded-pill py-0 px-2"
                                        style={{ fontSize: "11px" }}
                                        onClick={() => setRejectionReasonText("Advocate is unavailable at requested time slot.")}
                                      >
                                        ⏰ Slot Unavailable
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary rounded-pill py-0 px-2"
                                        style={{ fontSize: "11px" }}
                                        onClick={() => setRejectionReasonText("Outside advocate specialization area.")}
                                      >
                                        📋 Specialization Mismatch
                                      </button>
                                    </div>

                                    <textarea
                                      className="form-control form-control-sm mb-2"
                                      rows="2"
                                      placeholder="Type specific reason for rejection..."
                                      value={rejectionReasonText}
                                      onChange={(e) => setRejectionReasonText(e.target.value)}
                                    ></textarea>

                                    <div className="d-flex gap-2">
                                      <button
                                        type="button"
                                        className="btn btn-danger btn-sm rounded-pill flex-fill fw-bold shadow-sm"
                                        onClick={() => handleAppointmentStatus(appointment.id, "Rejected", rejectionReasonText)}
                                      >
                                        {isRejected ? "Save Updated Reason" : "Confirm Reject"}
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm rounded-pill"
                                        onClick={() => {
                                          setRejectingApptId(null);
                                          setRejectionReasonText("");
                                        }}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="d-flex gap-2">
                                    <button
                                      type="button"
                                      className="btn btn-success rounded-pill flex-fill fw-bold shadow-sm"
                                      onClick={() => handleAppointmentStatus(appointment.id, "Confirmed")}
                                    >
                                      <i className="bi bi-check-circle me-1"></i>
                                      Accept
                                    </button>

                                    <button
                                      type="button"
                                      className="btn btn-outline-danger rounded-pill flex-fill fw-bold"
                                      onClick={() => {
                                        setRejectingApptId(appointment.id);
                                        setRejectionReasonText(appointment.rejectionReason || "");
                                      }}
                                    >
                                      <i className="bi bi-x-circle me-1"></i>
                                      Reject
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}

                            {isAccepted && (
                              <button
                                type="button"
                                className="btn btn-dark rounded-pill w-100 fw-bold"
                                onClick={() => handleCreateCase(appointment)}
                              >
                                <i className="bi bi-folder-plus me-1"></i>
                                Create Case
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>
        )}

        {/* CASES */}
        {activeTab === "cases" && (
          <>
            {/* Create Case */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">

                <h4 className="fw-bold mb-4">
                  Create New Case
                </h4>

                <div className="row g-3">

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Client Name
                    </label>

                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={newClientName}
                      onChange={(e) =>
                        setNewClientName(
                          e.target.value
                        )
                      }
                      placeholder="Enter client name"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Case Title
                    </label>

                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={newCaseTitle}
                      onChange={(e) =>
                        setNewCaseTitle(
                          e.target.value
                        )
                      }
                      placeholder="Enter case title"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Court
                    </label>

                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={newCourtName}
                      onChange={(e) =>
                        setNewCourtName(
                          e.target.value
                        )
                      }
                      placeholder="Enter court name"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Next Hearing
                    </label>

                    <input
                      type="date"
                      className="form-control rounded-3"
                      value={nextHearing}
                      onChange={(e) =>
                        setNextHearing(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="col-12">
                    <button
                      className="btn btn-dark rounded-pill"
                      onClick={handleCreateManualCase}
                    >
                      Create Case
                    </button>
                  </div>

                </div>
              </div>
            </div>

            {/* Case List */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">

                <h4 className="fw-bold mb-4">
                  My Cases
                </h4>

                {myCases.length === 0 ? (
                  <div className="text-center py-5">
                    <h5 className="fw-semibold">
                      No cases available
                    </h5>

                    <p className="text-muted mb-0">
                      Cases created by you will appear
                      here.
                    </p>
                  </div>
                ) : (
                  <div className="row g-4">
                    {myCases.map((caseItem) => (
                      <div
                        className="col-lg-6"
                        key={caseItem.id}
                      >
                        <div className="card border rounded-4 h-100">
                          <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h5 className="fw-bold mb-1">
                                  {caseItem.title ||
                                    "Untitled Case"}
                                </h5>

                                <p className="text-muted mb-0">
                                  Client:{" "}
                                  {caseItem.clientName ||
                                    "Not provided"}
                                </p>
                              </div>

                              <span className="badge bg-dark">
                                {caseItem.stage ||
                                  "Filed"}
                              </span>
                            </div>

                            <p className="mb-2">
                              <strong>Court:</strong>{" "}
                              {caseItem.court ||
                                "Not provided"}
                            </p>

                            <p className="mb-3">
                              <strong>
                                Next Hearing:
                              </strong>{" "}
                              {caseItem.nextHearing ||
                                "Not scheduled"}
                            </p>

                            <CaseStageTimeline
                              currentStage={caseItem.stage || "Filed"}
                              stageNotes={caseItem.stageNotes}
                              isAdvocate={true}
                              caseTitle={caseItem.title}
                              onStageChange={(stg) => handleCaseStage(caseItem.id, stg)}
                              onSaveStageNote={(stg, note, setAsCurrent) => handleSaveStageNote(caseItem.id, stg, note, setAsCurrent)}
                            />

                            <div className="mb-3">
                              <label className="form-label fw-semibold">
                                Case Stage
                              </label>

                              <select
                                className="form-select rounded-3"
                                value={
                                  caseItem.stage ||
                                  "Filed"
                                }
                                onChange={(e) =>
                                  handleCaseStage(
                                    caseItem.id,
                                    e.target.value
                                  )
                                }
                              >
                                <option value="Filed">
                                  Filed
                                </option>

                                <option value="Consultation">
                                  Consultation
                                </option>

                                <option value="Investigation">
                                  Investigation
                                </option>

                                <option value="Hearing">
                                  Hearing
                                </option>

                                <option value="Judgment">
                                  Judgment
                                </option>

                                <option value="Completed">
                                  Completed
                                </option>

                                <option value="Closed">
                                  Closed
                                </option>
                              </select>
                            </div>

                            <div>
                              <label className="form-label fw-semibold">
                                Case Document
                              </label>

                              <input
                                type="file"
                                className="form-control rounded-3"
                                onChange={(e) =>
                                  handleDocumentUpload(
                                    caseItem.id,
                                    e
                                  )
                                }
                              />
                            </div>

                            {Array.isArray(
                              caseItem.documents
                            ) &&
                              caseItem.documents.length >
                                0 && (
                                <div className="mt-3">
                                  <small className="text-muted">
                                    Documents
                                  </small>

                                  <ul className="mb-0 mt-2">
                                    {caseItem.documents.map(
                                      (document) => (
                                        <li
                                          key={
                                            document.id
                                          }
                                        >
                                          {document.name}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}

                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          </>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4 p-md-5">

              <h4 className="fw-bold mb-4">
                My Professional Profile
              </h4>

              <div className="row g-4">

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Full Name
                  </label>

                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={currentUser.name || ""}
                    disabled
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control rounded-3"
                    value={currentUser.email || ""}
                    disabled
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Bar Council ID
                  </label>

                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={currentUser.barId || ""}
                    disabled
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Specialization
                  </label>

                  <select
                    className="form-select rounded-3"
                    value={editSpec}
                    onChange={(e) =>
                      setEditSpec(e.target.value)
                    }
                  >
                    <option value="">
                      Select specialization
                    </option>

                    <option value="Criminal Law">
                      Criminal Law
                    </option>

                    <option value="Civil Law">
                      Civil Law
                    </option>

                    <option value="Family Law">
                      Family Law
                    </option>

                    <option value="Corporate Law">
                      Corporate Law
                    </option>

                    <option value="Property Law">
                      Property Law
                    </option>

                    <option value="Consumer Law">
                      Consumer Law
                    </option>

                    <option value="Cyber Law">
                      Cyber Law
                    </option>

                    <option value="Intellectual Property">
                      Intellectual Property
                    </option>

                    <option value="Constitutional Law">
                      Constitutional Law
                    </option>

                    <option value="Labour Law">
                      Labour Law
                    </option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Years of Experience
                  </label>

                  <input
                    type="number"
                    min="0"
                    className="form-control rounded-3"
                    value={editExp}
                    onChange={(e) =>
                      setEditExp(e.target.value)
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    District / City
                  </label>

                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="e.g. Ernakulam, Trivandrum, Kottayam"
                    value={editDistrict}
                    onChange={(e) =>
                      setEditDistrict(e.target.value)
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Office Address (for Offline Consultations)
                  </label>

                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="e.g. Room 402, High Court Chambers, MG Road"
                    value={editOfficeAddress}
                    onChange={(e) =>
                      setEditOfficeAddress(e.target.value)
                    }
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Professional Bio
                  </label>

                  <textarea
                    className="form-control rounded-3"
                    rows="5"
                    value={editBio}
                    onChange={(e) =>
                      setEditBio(e.target.value)
                    }
                    placeholder="Tell clients about your professional experience and practice."
                  />
                </div>

                <div className="col-12">
                  <button
                    className="btn btn-dark rounded-pill px-4"
                    onClick={handleSaveProfile}
                  >
                    Save Profile
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* CLIENT REVIEWS & RATINGS TAB */}
        {activeTab === "reviews" && (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1">
                    Client Feedback & Ratings
                  </h4>

                  <p className="text-muted mb-0">
                    Read feedback reviews submitted by your clients for legal consultations and representation.
                  </p>
                </div>

                <div className="text-end">
                  <span className="badge bg-danger text-white rounded-pill px-3 py-2 fs-6 shadow-sm">
                    ★ {avgRating} / 5.0
                  </span>
                  <small className="d-block text-muted mt-1">({myReviewCount} Client Reviews)</small>
                </div>
              </div>

              {myReviews.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-star-half display-3 text-muted"></i>
                  <h5 className="fw-semibold mt-3">
                    No client reviews received yet
                  </h5>

                  <p className="text-muted mb-0">
                    Once clients submit feedback for consultations, their reviews and ratings will appear here.
                  </p>
                </div>
              ) : (
                <div className="row g-3">
                  {myReviews.map((rev) => (
                    <div className="col-md-6" key={rev.id}>
                      <div className="card border rounded-4 p-3 h-100 shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <strong className="text-dark">
                            <i className="bi bi-person-circle text-primary me-2"></i>
                            {rev.userName || "Client"}
                          </strong>

                          <span className="badge bg-warning text-dark rounded-pill px-3 py-1">
                            {"★".repeat(rev.rating || 5)} ({rev.rating}/5)
                          </span>
                        </div>

                        <p className="text-muted small mb-2 fst-italic">
                          "{rev.comment || "No comment written."}"
                        </p>

                        <div className="mt-auto text-end">
                          <small className="text-muted opacity-75" style={{ fontSize: "11px" }}>
                            Submitted on {new Date(rev.createdAt || Date.now()).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* EMERGENCY SOS ALERTS TAB */}
        {activeTab === "sos" && (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1 text-danger">
                    <i className="bi bi-bell-fill me-2"></i>
                    Client Emergency SOS Alerts
                  </h4>

                  <p className="text-muted mb-0">
                    Urgent help messages triggered by your clients during legal proceedings or emergencies.
                  </p>
                </div>

                <span className="badge bg-danger text-white rounded-pill px-3 py-2 fs-6 shadow-sm">
                  {activeSOSAlerts.length} Active Alert(s)
                </span>
              </div>

              {mySOSAlerts.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-shield-check display-3 text-muted"></i>
                  <h5 className="fw-semibold mt-3">
                    No Emergency Alerts Received
                  </h5>

                  <p className="text-muted mb-0">
                    When your clients trigger an emergency SOS, their alerts and contact details will appear here immediately.
                  </p>
                </div>
              ) : (
                <div className="row g-4">
                  {mySOSAlerts.map((sos) => {
                    const isActive = (sos.status || "").toLowerCase() !== "resolved";

                    return (
                      <div className="col-lg-6" key={sos.id}>
                        <div
                          className={`card border rounded-4 h-100 shadow-sm ${
                            isActive
                              ? "border-danger bg-danger-subtle text-dark"
                              : "bg-light"
                          }`}
                        >
                          <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <span
                                  className={`badge ${
                                    isActive ? "bg-danger text-white" : "bg-success text-white"
                                  } me-2 mb-1`}
                                >
                                  {isActive ? "🚨 EMERGENCY ALERT" : "✓ RESOLVED"}
                                </span>

                                <h5 className="fw-bold mb-0 text-dark">
                                  Client: {sos.userName || "Client"}
                                </h5>
                              </div>

                              <small className="text-muted opacity-75" style={{ fontSize: "11px" }}>
                                {new Date(sos.createdAt || Date.now()).toLocaleString()}
                              </small>
                            </div>

                            <div className="bg-white p-3 rounded-3 border mb-3">
                              <small className="text-muted fw-bold d-block mb-1">
                                Emergency Message:
                              </small>

                              <p className="mb-0 fw-semibold text-danger" style={{ fontSize: "15px" }}>
                                "{sos.message || "EMERGENCY ALERT: Immediate legal assistance required!"}"
                              </p>
                            </div>

                            <div className="row g-2 mb-3 small">
                              <div className="col-md-6">
                                <span className="text-muted d-block">Phone Contact:</span>
                                {sos.userPhone ? (
                                  <button
                                    type="button"
                                    className="btn btn-link btn-sm p-0 fw-bold text-danger text-decoration-none"
                                    onClick={() => handleOpenCallModal(sos.userName, sos.userPhone, sos.userEmail)}
                                  >
                                    <i className="bi bi-telephone-fill me-1"></i>
                                    {sos.userPhone}
                                  </button>
                                ) : (
                                  <span className="text-muted">Not provided</span>
                                )}
                              </div>

                              <div className="col-md-6">
                                <span className="text-muted d-block">Client Email:</span>
                                {sos.userEmail ? (
                                  <a
                                    href={`mailto:${sos.userEmail}`}
                                    className="fw-bold text-dark text-decoration-none"
                                  >
                                    <i className="bi bi-envelope-fill me-1"></i>
                                    {sos.userEmail}
                                  </a>
                                ) : (
                                  <span className="text-muted">Not provided</span>
                                )}
                              </div>

                              {sos.caseTitle && (
                                <div className="col-12 mt-2">
                                  <span className="text-muted">Associated Case:</span>{" "}
                                  <strong className="text-dark">{sos.caseTitle}</strong>
                                </div>
                              )}
                            </div>

                            <div className="d-flex gap-2 border-top pt-3">
                              {isActive && (
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm rounded-pill flex-fill fw-bold shadow-sm"
                                  onClick={() => {
                                    resolveSOS(sos.id);
                                    setMessage(`Emergency SOS from ${sos.userName} marked as resolved.`);
                                    setTimeout(() => setMessage(""), 3000);
                                  }}
                                >
                                  <i className="bi bi-check-circle-fill me-1"></i>
                                  Mark Action Taken / Resolved
                                </button>
                              )}

                              {sos.userPhone && (
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm rounded-pill fw-bold"
                                  onClick={() => handleOpenCallModal(sos.userName, sos.userPhone, sos.userEmail)}
                                >
                                  <i className="bi bi-telephone-out-fill me-1"></i>
                                  Call Client Now
                                </button>
                              )}
                            </div>

                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>
        )}

        {/* QUICK CALL & CONTACT MODAL */}
        {callModalTarget && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.65)", zIndex: 1065 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
                <div className="modal-header bg-danger text-white border-0 p-3 px-4">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-telephone-out-fill me-2"></i>
                    Call & Contact Client
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setCallModalTarget(null)}
                  ></button>
                </div>
                <div className="modal-body p-4 text-center">
                  <div className="avatar-circle mx-auto mb-3 bg-danger-subtle text-danger rounded-circle d-flex align-items-center justify-content-center" style={{ width: "68px", height: "68px" }}>
                    <i className="bi bi-person-fill fs-1"></i>
                  </div>
                  <h5 className="fw-bold mb-1">{callModalTarget.name || "Client"}</h5>
                  <p className="text-muted small mb-3">Client Emergency & Consultation Contact</p>

                  <div className="bg-light p-3 rounded-3 mb-4 border d-flex align-items-center justify-content-between">
                    <span className="fs-4 fw-bold text-dark font-monospace">
                      <i className="bi bi-telephone-fill text-danger me-2"></i>
                      {callModalTarget.rawPhone}
                    </span>
                    <button
                      type="button"
                      className="btn btn-outline-dark btn-sm rounded-pill fw-bold"
                      onClick={() => {
                        navigator.clipboard.writeText(callModalTarget.rawPhone);
                        setMessage(`Copied ${callModalTarget.rawPhone} to clipboard!`);
                        setTimeout(() => setMessage(""), 3000);
                      }}
                    >
                      <i className="bi bi-copy me-1"></i> Copy
                    </button>
                  </div>

                  <div className="d-grid gap-2">
                    <a
                      href={`tel:${callModalTarget.phone}`}
                      className="btn btn-danger btn-lg rounded-pill fw-bold text-white shadow-sm"
                    >
                      <i className="bi bi-telephone-fill me-2"></i>
                      Launch Mobile Phone Dialer
                    </a>

                    <a
                      href={`https://wa.me/${callModalTarget.phone.replace(/^\+/, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-success btn-lg rounded-pill fw-bold text-white shadow-sm"
                    >
                      <i className="bi bi-whatsapp me-2"></i>
                      Open WhatsApp Chat / Call
                    </a>

                    <a
                      href={`https://meet.jit.si/LegalAssist-Room-Call-${Date.now().toString().slice(-6)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-lg rounded-pill fw-bold text-white shadow-sm"
                    >
                      <i className="bi bi-camera-video-fill me-2"></i>
                      Start Instant Web Video Call
                    </a>
                  </div>
                </div>
                <div className="modal-footer border-0 bg-light p-3 justify-content-center">
                  <button
                    type="button"
                    className="btn btn-secondary rounded-pill px-4 fw-bold"
                    onClick={() => setCallModalTarget(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTACT ADMIN MODAL */}
        <ContactAdminModal
          show={showContactAdminModal}
          onClose={() => setShowContactAdminModal(false)}
          currentUser={currentUser}
          role="advocate"
        />

      </div>
    </div>
  );
};

export default AdvocateDashboard;