import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import SOSModal from "../components/SOSModal";
import CaseStageTimeline from "../components/CaseStageTimeline";
import ContactAdminModal from "../components/ContactAdminModal";

function UserDashboard() {
  const { currentUser } = useAuth();
  const { advocates, appointments, cases, uploadCaseDocument, uploadAppointmentDocument, addReview, deleteAppointment } = useData();

  const [showSOS, setShowSOS] = useState(false);
  const [showContactAdminModal, setShowContactAdminModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [message, setMessage] = useState("");

  const [reviewingApptId, setReviewingApptId] = useState(null);
  const [ratingScore, setRatingScore] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const userAppointments = useMemo(() => {
    return appointments.filter(
      (app) => String(app.userId) === String(currentUser?.id) || app.userEmail === currentUser?.email
    );
  }, [appointments, currentUser]);

  const userCases = useMemo(() => {
    return cases.filter(
      (caseItem) => String(caseItem.clientId) === String(currentUser?.id) || caseItem.clientEmail === currentUser?.email
    );
  }, [cases, currentUser]);

  const activeCases = userCases.filter(
    (caseItem) =>
      caseItem.stage !== "Closed" &&
      caseItem.stage !== "Completed" &&
      caseItem.status !== "Closed" &&
      caseItem.status !== "Completed"
  );

  const handleUserFileUpload = (caseId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const documentData = {
      id: `document-${Date.now()}`,
      name: file.name,
      type: file.type || "Document",
      size: `${(file.size / 1024).toFixed(1)} KB`,
      uploadedBy: currentUser?.name || "Client",
      uploadedRole: "client",
      uploadedAt: new Date().toISOString(),
    };

    uploadCaseDocument(caseId, documentData);
    setMessage(`Successfully shared file "${file.name}" with your advocate.`);
    setTimeout(() => setMessage(""), 3500);
  };

  const handleAppointmentFileUpload = (appointmentId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const documentData = {
      id: `document-${Date.now()}`,
      name: file.name,
      type: file.type || "Document",
      size: `${(file.size / 1024).toFixed(1)} KB`,
      uploadedBy: currentUser?.name || "Client",
      uploadedRole: "client",
      uploadedAt: new Date().toISOString(),
    };

    uploadAppointmentDocument(appointmentId, documentData);
    setMessage(`Successfully shared consultation file "${file.name}" with your advocate.`);
    setTimeout(() => setMessage(""), 3500);
  };

  const openSOS = (caseItem) => {
    setSelectedCase(caseItem);
    setShowSOS(true);
  };

  const closeSOS = () => {
    setShowSOS(false);
    setSelectedCase(null);
  };

  return (
    <div className="bg-light min-vh-100">

      {/* HEADER */}
      <section className="bg-dark text-white py-5">
        <div className="container">
          <span className="badge bg-danger text-white rounded-pill px-3 py-2 mb-3">
            <i className="bi bi-person-check me-2"></i>
            User Dashboard
          </span>

          <h1 className="fw-bold mb-2">
            Welcome, {currentUser?.name || "User"}
          </h1>

          <p className="text-white-50 mb-0">
            Manage your advocates, appointments, cases and emergency
            assistance from one place.
          </p>
        </div>
      </section>

      {/* MAIN */}
      <section className="py-5">
        <div className="container">

          {/* QUICK ACTIONS ROW */}
          <div className="row g-4 mb-5">

            {/* CARD 1: AI LEGAL ASSISTANT */}
            <div className="col-md-4">
              <div
                className="card border-0 shadow-sm h-100"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  window.dispatchEvent(new Event("open-ai-chatbot"));
                }}
              >
                <div className="card-body p-4">
                  <div className="bg-dark text-warning rounded-3 p-3 d-inline-block mb-3">
                    <i className="bi bi-robot fs-3"></i>
                  </div>

                  <h5 className="fw-bold">AI Legal Assistant</h5>

                  <p className="text-muted small">
                    Get basic information about legal terms, procedures, rights and rules using the AI Legal Assistant.
                  </p>

                  <button
                    type="button"
                    className="btn btn-dark rounded-pill btn-sm px-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.dispatchEvent(new Event("open-ai-chatbot"));
                    }}
                  >
                    <i className="bi bi-robot me-2"></i>
                    Ask AI Assistant
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 2: FIND ADVOCATES & BOOK APPOINTMENT */}
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="bg-primary-subtle text-primary rounded-3 p-3 d-inline-block mb-3">
                    <i className="bi bi-person-badge fs-3"></i>
                  </div>

                  <h5 className="fw-bold">Find Advocates & Book Appointment</h5>

                  <p className="text-muted small">
                    Search verified advocates by specialization, view profiles, and book consultation time slots.
                  </p>

                  <Link
                    to="/advocates"
                    className="btn btn-outline-primary rounded-pill btn-sm"
                  >
                    Find & Book Consultation
                  </Link>
                </div>
              </div>
            </div>

            {/* CARD 3: CONSULTATIONS & CASE PORTAL */}
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="bg-success-subtle text-success rounded-3 p-3 d-inline-block mb-3">
                    <i className="bi bi-journal-bookmark-fill fs-3"></i>
                  </div>

                  <h5 className="fw-bold">My Consultations & Case Portal</h5>

                  <p className="text-muted small">
                    Track consultation requests, appointment status, real-time case stages, and advocate updates.
                  </p>

                  <a
                    href="#my-consultations-cases"
                    className="btn btn-outline-success rounded-pill btn-sm"
                  >
                    View Consultations & Cases
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* MY CONSULTATIONS & CASES */}
          <div id="my-consultations-cases" className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <span className="text-success fw-bold text-uppercase small">
                  Consultations & Case Management
                </span>
                <h2 className="fw-bold mb-1">My Consultations & Active Cases</h2>
                <p className="text-muted mb-0">
                  Track your appointment requests, real-time case stages, and share files with your advocate.
                </p>
              </div>

              <Link
                to="/advocates"
                className="btn btn-dark rounded-pill"
              >
                + Book New
              </Link>
            </div>

            {userAppointments.length === 0 ? (
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center py-5">
                  <i className="bi bi-calendar-x fs-1 text-muted"></i>
                  <h5 className="fw-bold mt-3">No Appointments Booked</h5>
                  <p className="text-muted mb-3">
                    You have not booked any advocate consultations yet.
                  </p>
                  <Link to="/advocates" className="btn btn-outline-dark rounded-pill btn-sm">
                    Find Advocates & Book
                  </Link>
                </div>
              </div>
            ) : (
              <div className="row g-4">
                {userAppointments.map((app) => {
                  const adv = advocates.find(
                    (a) => String(a.id) === String(app.advocateId) || a.name === app.advocateName
                  );
                  const displayAddress =
                    app.officeAddress ||
                    adv?.officeAddress ||
                    adv?.address ||
                    adv?.officeLocation ||
                    adv?.location ||
                    "High Court Law Chambers, District Court Road";
                  const displayDistrict =
                    app.district ||
                    adv?.district ||
                    adv?.city ||
                    adv?.location ||
                    "District Court Complex";

                  return (
                    <div className="col-lg-6" key={app.id}>
                      <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <span className="badge bg-secondary mb-2">
                                {app.consultationType || "Consultation"}
                              </span>
                              <h5 className="fw-bold mb-1">
                                {app.advocateName || "Advocate"}
                              </h5>
                            </div>
                            <span
                              className={`badge ${
                                app.status === "accepted" || app.status === "Accepted"
                                  ? "bg-success"
                                  : app.status === "rejected" || app.status === "Rejected"
                                  ? "bg-secondary"
                                  : "bg-danger text-white"
                              }`}
                            >
                              {app.status}
                            </span>
                          </div>

                          <div className="row g-2 mb-3 small">
                            <div className="col-6">
                              <span className="text-muted">Date:</span>{" "}
                              <strong>{app.date}</strong>
                            </div>
                            <div className="col-6">
                              <span className="text-muted">Time:</span>{" "}
                              <strong>{app.time}</strong>
                            </div>
                          </div>

                          {app.reason && (
                            <div className="bg-light rounded-3 p-3 mb-2 small">
                              <small className="text-muted fw-bold d-block mb-1">Consultation Topic / Notes:</small>
                              <span>{app.reason}</span>
                            </div>
                          )}

                          {(app.status || "").toLowerCase() === "rejected" && (
                            <div className="bg-danger-subtle border border-danger-subtle text-danger rounded-3 p-3 mb-2 shadow-sm">
                              <small className="fw-bold d-block mb-1">
                                <i className="bi bi-exclamation-triangle-fill me-1"></i> Rejection Reason from Advocate:
                              </small>
                              <span className="small fw-semibold d-block mb-3">
                                {app.rejectionReason || "Advocate is unavailable at the requested date and time."}
                              </span>
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm rounded-pill fw-bold w-100 bg-white shadow-sm"
                                onClick={() => {
                                  deleteAppointment(app.id);
                                  setMessage("Rejected appointment deleted from your dashboard.");
                                  setTimeout(() => setMessage(""), 3500);
                                }}
                              >
                                <i className="bi bi-trash me-1"></i>
                                Delete Rejected Appointment
                              </button>
                            </div>
                          )}

                          {/* ONLINE CONSULTATION VIDEO CALL LINK */}
                          {(app.consultationType === "Online Consultation" || app.meetingLink) && (app.status || "").toLowerCase() !== "rejected" && (
                            <div className="mt-3 pt-2 border-top">
                              <small className="text-muted d-block mb-1 fw-bold"><i className="bi bi-camera-video me-1 text-primary"></i> Virtual Video Consultation Link:</small>
                              <a
                                href={app.meetingLink || `https://meet.jit.si/LegalAssist-Room-${app.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary btn-sm rounded-pill px-3 fw-bold shadow-sm"
                              >
                                <i className="bi bi-camera-video-fill me-1"></i>
                                Join Video Consultation
                              </a>
                            </div>
                          )}

                          {/* ADVOCATE OFFICE LOCATION */}
                          {(app.status || "").toLowerCase() !== "rejected" && (
                            <div className="mt-3 pt-2 border-top small">
                              <small className="text-muted d-block mb-1 fw-bold"><i className="bi bi-geo-alt-fill text-danger me-1"></i> Advocate Office Location:</small>
                              <div>
                                {displayDistrict && <span className="badge bg-dark text-light border me-2">District: {displayDistrict}</span>}
                                <span className="fw-semibold text-dark">{displayAddress}</span>
                              </div>
                            </div>
                          )}

                        {/* CASE STAGE TIMELINE FOR CONFIRMED APPOINTMENTS */}
                        {((app.status || "").toLowerCase() === "accepted" || (app.status || "").toLowerCase() === "confirmed") && (() => {
                          const matchingCase = cases.find(
                            (c) => String(c.appointmentId) === String(app.id) ||
                            (c.clientEmail === currentUser?.email && String(c.advocateId) === String(app.advocateId))
                          );
                          return (
                            <CaseStageTimeline
                              currentStage={matchingCase?.stage || app.stage || "Consultation"}
                              stageNotes={matchingCase?.stageNotes || app.stageNotes}
                              caseTitle={matchingCase?.title || `${app.advocateName} - Legal Consultation`}
                              isAdvocate={false}
                            />
                          );
                        })()}

                        {/* ACCEPTED APPOINTMENT FILE SHARING */}
                        {((app.status || "").toLowerCase() === "accepted" || (app.status || "").toLowerCase() === "confirmed") && (
                          <div className="bg-light p-3 rounded-3 mt-3 border">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <small className="fw-bold text-dark">
                                <i className="bi bi-file-earmark-arrow-up text-success me-1"></i>
                                Share Consultation Files with Advocate:
                              </small>
                              {Array.isArray(app.documents) && (
                                <span className="badge bg-secondary">{app.documents.length} Shared</span>
                              )}
                            </div>
                            <input
                              type="file"
                              className="form-control form-control-sm rounded-3 mb-2"
                              onChange={(e) => handleAppointmentFileUpload(app.id, e)}
                            />
                            {Array.isArray(app.documents) && app.documents.length > 0 && (
                              <ul className="mb-0 ps-3 small text-muted">
                                {app.documents.map((doc) => (
                                  <li key={doc.id || doc.name} className="text-truncate">{doc.name}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}

                        {/* CLIENT RATE & REVIEW ADVOCATE PANEL */}
                        {((app.status || "").toLowerCase() === "accepted" || (app.status || "").toLowerCase() === "confirmed") && (
                          <div className="mt-3">
                            {reviewingApptId === app.id ? (
                              <div className="bg-light p-3 rounded-3 border border-warning">
                                <small className="fw-bold text-dark d-block mb-2">
                                  <i className="bi bi-star-fill text-warning me-1"></i>
                                  Rate & Feedback for Advocate {app.advocateName}:
                                </small>

                                <div className="d-flex gap-1 mb-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      className={`btn btn-sm ${
                                        ratingScore >= star ? "btn-warning text-dark" : "btn-outline-secondary"
                                      } rounded-circle p-1`}
                                      style={{ width: "30px", height: "30px", fontSize: "12px" }}
                                      onClick={() => setRatingScore(star)}
                                    >
                                      ★
                                    </button>
                                  ))}
                                  <span className="small fw-bold ms-2 align-self-center">
                                    {ratingScore} Star{ratingScore > 1 ? "s" : ""}
                                  </span>
                                </div>

                                <textarea
                                  className="form-control form-control-sm mb-2"
                                  rows="2"
                                  placeholder="Write your review about advocate..."
                                  value={reviewComment}
                                  onChange={(e) => setReviewComment(e.target.value)}
                                ></textarea>

                                <div className="d-flex gap-2">
                                  <button
                                    type="button"
                                    className="btn btn-warning btn-sm rounded-pill flex-fill fw-bold"
                                    onClick={async () => {
                                      if (!reviewComment.trim()) {
                                        setMessage("Please write a short review comment.");
                                        setTimeout(() => setMessage(""), 3000);
                                        return;
                                      }

                                      await addReview({
                                        advocateId: app.advocateId,
                                        advocateName: app.advocateName,
                                        userId: currentUser?.id || "user",
                                        userName: currentUser?.name || "Client",
                                        rating: ratingScore,
                                        comment: reviewComment,
                                      });

                                      setReviewingApptId(null);
                                      setReviewComment("");
                                      setMessage(`Thank you! Review for ${app.advocateName} submitted successfully.`);
                                      setTimeout(() => setMessage(""), 4000);
                                    }}
                                  >
                                    Submit Review
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm rounded-pill"
                                    onClick={() => {
                                      setReviewingApptId(null);
                                      setReviewComment("");
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-outline-warning text-dark btn-sm rounded-pill w-100 fw-bold mb-2 shadow-sm"
                                onClick={() => {
                                  setReviewingApptId(app.id);
                                  setRatingScore(5);
                                  setReviewComment("");
                                }}
                              >
                                <i className="bi bi-star-fill text-warning me-1"></i>
                                Rate & Review Advocate
                              </button>
                            )}
                          </div>
                        )}

                        {/* EMERGENCY SOS BUTTON */}
                        {(app.status || "").toLowerCase() !== "rejected" && (
                          <div className="mt-3">
                            <button
                              className="btn btn-danger rounded-pill fw-bold w-100 shadow-sm"
                              onClick={() => openSOS(app)}
                            >
                              <i className="bi bi-bell-fill me-2"></i>
                              Emergency SOS
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div className="row g-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 p-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="fw-bold mb-1">
                        <i className="bi bi-person-circle me-2 text-primary"></i>
                        My Profile
                      </h4>
                      <p className="text-muted small mb-0">
                        Your account information
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="btn btn-outline-dark btn-sm rounded-pill"
                    >
                      Edit Profile
                    </Link>
                  </div>
                </div>
                <div className="card-body p-4">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="text-muted small">Name</label>
                      <div className="fw-semibold">{currentUser?.name || "Not provided"}</div>
                    </div>
                    <div className="col-md-4">
                      <label className="text-muted small">Email</label>
                      <div className="fw-semibold">{currentUser?.email || "Not provided"}</div>
                    </div>
                    <div className="col-md-4">
                      <label className="text-muted small">Phone</label>
                      <div className="fw-semibold">{currentUser?.phone || "Not provided"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SOS MODAL */}
      {showSOS && selectedCase && (
        <SOSModal
          caseData={selectedCase}
          onClose={closeSOS}
        />
      )}

      {/* CONTACT ADMIN MODAL */}
      <ContactAdminModal
        show={showContactAdminModal}
        onClose={() => setShowContactAdminModal(false)}
        currentUser={currentUser}
        role="user"
      />

    </div>
  );
}

export default UserDashboard;