import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

const AdminDashboard = () => {
  const { users, approveAdvocate, rejectAdvocate, deleteUser } = useAuth();

  const {
    advocates,
    appointments,
    cases,
    reviews,
    verifyAdvocate,
    removeAdvocate,
    deleteReview,
    getAdvocateRating,
    supportTickets,
    updateSupportTicketStatus,
    deleteSupportTicket,
  } = useData();

  const [activeTab, setActiveTab] = useState("overview");
  const [message, setMessage] = useState("");
  const [viewDocModal, setViewDocModal] = useState(null);
  const [ticketFilter, setTicketFilter] = useState("all");

  const pendingTickets = useMemo(() => {
    return (supportTickets || []).filter((t) => (t.status || "").toLowerCase() === "pending");
  }, [supportTickets]);

  const filteredTickets = useMemo(() => {
    const list = supportTickets || [];
    if (ticketFilter === "pending") return list.filter((t) => (t.status || "").toLowerCase() === "pending");
    if (ticketFilter === "advocate") return list.filter((t) => (t.senderRole || "").toLowerCase() === "advocate");
    if (ticketFilter === "user") return list.filter((t) => (t.senderRole || "").toLowerCase() === "user");
    if (ticketFilter === "resolved") return list.filter((t) => (t.status || "").toLowerCase() === "resolved");
    return list;
  }, [supportTickets, ticketFilter]);

  const registeredAdvocates = useMemo(() => {
    return users.filter(
      (user) => user.role === "advocate"
    );
  }, [users]);

  const pendingAdvocates = useMemo(() => {
    return registeredAdvocates.filter(
      (advocate) => advocate.status === "pending"
    );
  }, [registeredAdvocates]);

  const verifiedAdvocates = useMemo(() => {
    return registeredAdvocates.filter(
      (advocate) => advocate.status === "verified"
    );
  }, [registeredAdvocates]);

  const rejectedAdvocates = useMemo(() => {
    return registeredAdvocates.filter(
      (advocate) => advocate.status === "rejected"
    );
  }, [registeredAdvocates]);

  const registeredUsers = useMemo(() => {
    return users.filter(
      (user) => user.role === "user"
    );
  }, [users]);

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleApprove = (advocate) => {
    verifyAdvocate(advocate.id, "verified");
    approveAdvocate(advocate.id);

    showMessage(
      `${advocate.name}'s advocate account has been approved.`
    );
  };

  const handleReject = (advocate) => {
    verifyAdvocate(advocate.id, "rejected");
    rejectAdvocate(advocate.id);

    showMessage(
      `${advocate.name}'s advocate registration has been rejected.`
    );
  };

  const handleRevokeAdvocate = (advocate, reason = "bad user feedback") => {
    if (
      window.confirm(
        `Are you sure you want to revoke approval for Advocate ${advocate.name} due to ${reason}?`
      )
    ) {
      verifyAdvocate(advocate.id, "rejected");
      rejectAdvocate(advocate.id);

      showMessage(
        `Approval revoked for ${advocate.name} due to ${reason}. Account status set to rejected.`
      );
    }
  };

  const handleDeleteAdvocate = (advocate) => {
    if (
      window.confirm(
        `Are you sure you want to permanently remove Advocate ${advocate.name} from LegalAssist?`
      )
    ) {
      deleteUser(advocate.id);
      removeAdvocate(advocate.id);

      showMessage(
        `Advocate ${advocate.name} has been permanently removed from the platform.`
      );
    }
  };

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container">

        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold mb-1">
            Admin Dashboard
          </h2>

          <p className="text-muted mb-0">
            Manage users, advocate registrations and
            platform activity.
          </p>
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
                  activeTab === "pending"
                    ? "btn-dark"
                    : "btn-outline-dark"
                }`}
                onClick={() =>
                  setActiveTab("pending")
                }
              >
                Pending Advocates
                {pendingAdvocates.length > 0 && (
                  <span className="badge bg-warning text-dark ms-2">
                    {pendingAdvocates.length}
                  </span>
                )}
              </button>

              <button
                className={`btn rounded-pill ${
                  activeTab === "advocates"
                    ? "btn-dark"
                    : "btn-outline-dark"
                }`}
                onClick={() =>
                  setActiveTab("advocates")
                }
              >
                Advocates
              </button>

              <button
                className={`btn rounded-pill ${
                  activeTab === "users"
                    ? "btn-dark"
                    : "btn-outline-dark"
                }`}
                onClick={() =>
                  setActiveTab("users")
                }
              >
                Users
              </button>

              <button
                className={`btn rounded-pill ${
                  activeTab === "activity"
                    ? "btn-dark"
                    : "btn-outline-dark"
                }`}
                onClick={() =>
                  setActiveTab("activity")
                }
              >
                Activity
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
                Reviews & Ratings ({reviews?.length || 0})
              </button>

              <button
                className={`btn rounded-pill ${
                  activeTab === "support"
                    ? "btn-dark"
                    : "btn-outline-dark"
                }`}
                onClick={() =>
                  setActiveTab("support")
                }
              >
                <i className="bi bi-headset me-1 text-info"></i>
                Support & Site Issues
                {pendingTickets.length > 0 && (
                  <span className="badge bg-warning text-dark ms-2">
                    {pendingTickets.length}
                  </span>
                )}
              </button>

            </div>
          </div>
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <>
            <div className="row g-4 mb-4">

              <div className="col-md-3">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body">
                    <p className="text-muted mb-1">
                      Registered Users
                    </p>

                    <h3 className="fw-bold mb-0">
                      {registeredUsers.length}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body">
                    <p className="text-muted mb-1">
                      Advocates
                    </p>

                    <h3 className="fw-bold mb-0">
                      {registeredAdvocates.length}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body">
                    <p className="text-muted mb-1">
                      Pending Approval
                    </p>

                    <h3 className="fw-bold mb-0">
                      {pendingAdvocates.length}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body">
                    <p className="text-muted mb-1">
                      Appointments
                    </p>

                    <h3 className="fw-bold mb-0">
                      {appointments.length}
                    </h3>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Summary */}
            <div className="row g-4">

              <div className="col-lg-6">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body p-4">

                    <h4 className="fw-bold mb-4">
                      Advocate Verification
                    </h4>

                    <div className="d-flex justify-content-between border-bottom py-3">
                      <span>
                        Pending
                      </span>

                      <strong>
                        {pendingAdvocates.length}
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between border-bottom py-3">
                      <span>
                        Verified
                      </span>

                      <strong>
                        {verifiedAdvocates.length}
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between py-3">
                      <span>
                        Rejected
                      </span>

                      <strong>
                        {rejectedAdvocates.length}
                      </strong>
                    </div>

                    <button
                      className="btn btn-dark rounded-pill mt-3"
                      onClick={() =>
                        setActiveTab("pending")
                      }
                    >
                      Review Registrations
                    </button>

                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body p-4">

                    <h4 className="fw-bold mb-4">
                      Platform Statistics
                    </h4>

                    <div className="d-flex justify-content-between border-bottom py-3">
                      <span>
                        Users
                      </span>

                      <strong>
                        {registeredUsers.length}
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between border-bottom py-3">
                      <span>
                        Advocates
                      </span>

                      <strong>
                        {registeredAdvocates.length}
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between border-bottom py-3">
                      <span>
                        Appointments
                      </span>

                      <strong>
                        {appointments.length}
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between py-3">
                      <span>
                        Cases
                      </span>

                      <strong>
                        {cases.length}
                      </strong>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </>
        )}

        {/* PENDING ADVOCATES */}
        {activeTab === "pending" && (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1">
                    Pending Advocate Registrations
                  </h4>

                  <p className="text-muted mb-0">
                    Review advocate details before approval.
                  </p>
                </div>

                <span className="badge bg-danger text-white rounded-pill px-3 py-2">
                  {pendingAdvocates.length} Pending
                </span>
              </div>

              {pendingAdvocates.length === 0 ? (
                <div className="text-center py-5">
                  <h5 className="fw-semibold">
                    No pending registrations
                  </h5>

                  <p className="text-muted mb-0">
                    New advocate registrations will appear
                    here.
                  </p>
                </div>
              ) : (
                <div className="row g-4">

                  {pendingAdvocates.map(
                    (advocate) => (
                      <div
                        className="col-lg-6"
                        key={advocate.id}
                      >
                        <div className="card border rounded-4 h-100">
                          <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h5 className="fw-bold mb-1">
                                  {advocate.name}
                                </h5>

                                <span className="badge bg-danger text-white">
                                  Pending
                                </span>
                              </div>
                            </div>

                            <div className="mb-3">

                              <p className="mb-2">
                                <strong>
                                  Email:
                                </strong>{" "}
                                {advocate.email ||
                                  "Not provided"}
                              </p>

                              <p className="mb-2">
                                <strong>
                                  Phone:
                                </strong>{" "}
                                {advocate.phone ||
                                  "Not provided"}
                              </p>

                              <p className="mb-2">
                                <strong>
                                  Bar Council ID:
                                </strong>{" "}
                                {advocate.barId ||
                                  "Not provided"}
                              </p>

                              <p className="mb-2">
                                <strong>
                                  Specialization:
                                </strong>{" "}
                                {advocate.specialization ||
                                  "Not specified"}
                              </p>

                              <p className="mb-2">
                                <strong>
                                  Experience:
                                </strong>{" "}
                                {advocate.experience ?? 0}{" "}
                                years
                              </p>

                              <p className="mb-2">
                                <strong>
                                  Consultation Fee:
                                </strong>{" "}
                                ₹
                                {advocate.fees ?? 0}
                              </p>

                              <p className="mb-2">
                                <strong>
                                  Qualifications:
                                </strong>{" "}
                                {advocate.qualifications ||
                                  "Not provided"}
                              </p>

                              {/* Verification Documents Section */}
                              <div className="bg-light p-3 rounded-3 mt-3 border">
                                <small className="text-muted d-block fw-bold mb-2">
                                  <i className="bi bi-file-earmark-check-fill text-primary me-1"></i>
                                  Verification Certificates & Documents:
                                </small>

                                <div className="d-flex flex-column gap-2">
                                  {/* 1. ID Proof */}
                                  <div className="d-flex align-items-center justify-content-between bg-white p-2 rounded border">
                                    <small className="fw-semibold text-dark">
                                      1. Govt ID Proof:
                                    </small>
                                    {advocate.idProofDoc ? (
                                      <button
                                        type="button"
                                        className="btn btn-outline-primary btn-sm rounded-pill py-0 px-2 fw-bold"
                                        onClick={() => setViewDocModal({
                                          title: "Government ID Proof (Aadhaar / Passport / Voter ID)",
                                          doc: advocate.idProofDoc,
                                          advocateName: advocate.name,
                                          advocateObj: advocate
                                        })}
                                      >
                                        <i className="bi bi-eye-fill me-1"></i>
                                        View ID Proof
                                      </button>
                                    ) : (
                                      <span className="badge bg-secondary">Not Uploaded</span>
                                    )}
                                  </div>

                                  {/* 2. State Bar Council Card */}
                                  <div className="d-flex align-items-center justify-content-between bg-white p-2 rounded border">
                                    <small className="fw-semibold text-dark">
                                      2. Bar Council ID Card:
                                    </small>
                                    {advocate.barCouncilDoc ? (
                                      <button
                                        type="button"
                                        className="btn btn-outline-primary btn-sm rounded-pill py-0 px-2 fw-bold"
                                        onClick={() => setViewDocModal({
                                          title: "State Bar Council Identity Card / Certificate",
                                          doc: advocate.barCouncilDoc,
                                          advocateName: advocate.name,
                                          advocateObj: advocate
                                        })}
                                      >
                                        <i className="bi bi-eye-fill me-1"></i>
                                        View Bar ID Card
                                      </button>
                                    ) : (
                                      <span className="badge bg-secondary">Not Uploaded</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                            </div>

                            <hr />

                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-success rounded-pill flex-fill"
                                onClick={() =>
                                  handleApprove(
                                    advocate
                                  )
                                }
                              >
                                Approve
                              </button>

                              <button
                                className="btn btn-outline-danger rounded-pill flex-fill"
                                onClick={() =>
                                  handleReject(
                                    advocate
                                  )
                                }
                              >
                                Reject
                              </button>
                            </div>

                          </div>
                        </div>
                      </div>
                    )
                  )}

                </div>
              )}

            </div>
          </div>
        )}

        {/* ADVOCATES */}
        {activeTab === "advocates" && (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1">
                    Registered Advocates
                  </h4>

                  <p className="text-muted mb-0">
                    All advocate accounts registered on
                    LegalAssist.
                  </p>
                </div>
              </div>

              {registeredAdvocates.length === 0 ? (
                <div className="text-center py-5">
                  <h5 className="fw-semibold">
                    No advocates registered
                  </h5>

                  <p className="text-muted mb-0">
                    Advocate registrations will appear here.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email & Contact</th>
                        <th>Specialization</th>
                        <th>Experience</th>
                        <th>User Rating & Feedback</th>
                        <th>Status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {registeredAdvocates.map(
                        (advocate) => {
                          const ratingStats = getAdvocateRating(advocate.id);
                          const badReviews = ratingStats.reviews.filter(
                            (r) => Number(r.rating) <= 2
                          );

                          return (
                            <tr key={advocate.id}>
                              <td>
                                <div>
                                  <strong>{advocate.name}</strong>
                                  {advocate.barId && (
                                    <div className="small text-muted">
                                      Bar ID: {advocate.barId}
                                    </div>
                                  )}
                                </div>
                              </td>

                              <td>
                                <div>{advocate.email}</div>
                                {advocate.phone && (
                                  <div className="small text-muted">
                                    {advocate.phone}
                                  </div>
                                )}
                              </td>

                              <td>
                                {advocate.specialization || "Not specified"}
                              </td>

                              <td>
                                {advocate.experience ?? 0} years
                              </td>

                              <td>
                                <div className="d-flex align-items-center flex-wrap gap-1">
                                  <span className="badge bg-warning text-dark rounded-pill px-2">
                                    ★ {ratingStats.avgRating} ({ratingStats.count})
                                  </span>
                                  {badReviews.length > 0 && (
                                    <span className="badge bg-danger text-white rounded-pill px-2" title={`${badReviews.length} bad review(s) submitted`}>
                                      <i className="bi bi-exclamation-triangle-fill me-1"></i>
                                      {badReviews.length} Bad Review{badReviews.length > 1 ? "s" : ""}
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td>
                                <span
                                  className={`badge ${
                                    advocate.status === "verified"
                                      ? "bg-success"
                                      : advocate.status === "rejected"
                                      ? "bg-danger"
                                      : "bg-warning text-dark"
                                  }`}
                                >
                                  {advocate.status}
                                </span>
                              </td>

                              <td className="text-end">
                                <div className="d-flex gap-2 justify-content-end">
                                  {advocate.status === "verified" && (
                                    <>
                                      <button
                                        type="button"
                                        className="btn btn-outline-warning btn-sm rounded-pill"
                                        title="Revoke advocate approval (e.g. after bad reviews)"
                                        onClick={() =>
                                          handleRevokeAdvocate(
                                            advocate,
                                            badReviews.length > 0
                                              ? "bad user reviews"
                                              : "admin review"
                                          )
                                        }
                                      >
                                        <i className="bi bi-person-x-fill me-1"></i>
                                        Revoke Approval
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-outline-danger btn-sm rounded-pill"
                                        title="Permanently remove advocate account"
                                        onClick={() => handleDeleteAdvocate(advocate)}
                                      >
                                        <i className="bi bi-trash me-1"></i>
                                        Remove
                                      </button>
                                    </>
                                  )}

                                  {advocate.status === "pending" && (
                                    <>
                                      <button
                                        type="button"
                                        className="btn btn-success btn-sm rounded-pill"
                                        onClick={() => handleApprove(advocate)}
                                      >
                                        Approve
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-outline-danger btn-sm rounded-pill"
                                        onClick={() => handleReject(advocate)}
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}

                                  {advocate.status === "rejected" && (
                                    <>
                                      <button
                                        type="button"
                                        className="btn btn-outline-success btn-sm rounded-pill"
                                        onClick={() => handleApprove(advocate)}
                                      >
                                        Re-Approve
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-outline-danger btn-sm rounded-pill"
                                        onClick={() => handleDeleteAdvocate(advocate)}
                                      >
                                        Delete
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          </div>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">

              <h4 className="fw-bold mb-1">
                Registered Users
              </h4>

              <p className="text-muted mb-4">
                Users who have created accounts on
                LegalAssist.
              </p>

              {registeredUsers.length === 0 ? (
                <div className="text-center py-5">
                  <h5 className="fw-semibold">
                    No users registered
                  </h5>

                  <p className="text-muted mb-0">
                    User registrations will appear here.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Registered</th>
                      </tr>
                    </thead>

                    <tbody>
                      {registeredUsers.map(
                        (user) => (
                          <tr key={user.id}>
                            <td>
                              <strong>
                                {user.name}
                              </strong>
                            </td>

                            <td>
                              {user.email}
                            </td>

                            <td>
                              {user.phone ||
                                "Not provided"}
                            </td>

                            <td>
                              <span className="badge bg-success">
                                {user.status ||
                                  "active"}
                              </span>
                            </td>

                            <td>
                              {user.createdAt
                                ? new Date(
                                    user.createdAt
                                  ).toLocaleDateString()
                                : "—"}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ACTIVITY */}
        {activeTab === "activity" && (
          <div className="row g-4">

            <div className="col-lg-6">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">

                  <h4 className="fw-bold mb-4">
                    Appointments
                  </h4>

                  {appointments.length === 0 ? (
                    <p className="text-muted mb-0">
                      No appointments have been created yet.
                    </p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table align-middle">
                        <thead>
                          <tr>
                            <th>User</th>
                            <th>Advocate</th>
                            <th>Status</th>
                          </tr>
                        </thead>

                        <tbody>
                          {appointments.map(
                            (appointment) => (
                              <tr
                                key={appointment.id}
                              >
                                <td>
                                  {appointment.userName ||
                                    appointment.clientName ||
                                    "—"}
                                </td>

                                <td>
                                  {appointment.advocateName ||
                                    "—"}
                                </td>

                                <td>
                                  <span className="badge bg-secondary">
                                    {appointment.status ||
                                      "pending"}
                                  </span>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">

                  <h4 className="fw-bold mb-4">
                    Cases
                  </h4>

                  {cases.length === 0 ? (
                    <p className="text-muted mb-0">
                      No cases have been created yet.
                    </p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table align-middle">
                        <thead>
                          <tr>
                            <th>Case</th>
                            <th>Client</th>
                            <th>Stage</th>
                          </tr>
                        </thead>

                        <tbody>
                          {cases.map((caseItem) => (
                            <tr key={caseItem.id}>
                              <td>
                                {caseItem.title ||
                                  "Untitled Case"}
                              </td>

                              <td>
                                {caseItem.clientName ||
                                  "—"}
                              </td>

                              <td>
                                <span className="badge bg-dark">
                                  {caseItem.stage ||
                                    "Filed"}
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
            </div>

            <div className="col-12">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">

                  <h4 className="fw-bold mb-3">
                    Advocate Directory Data
                  </h4>

                  <p className="text-muted mb-0">
                    {advocates.length} advocate profile
                    {advocates.length === 1
                      ? ""
                      : "s"} currently stored in the
                    advocate directory.
                  </p>

                </div>
              </div>
            </div>

          </div>
        )}

        {/* REVIEWS & RATINGS TAB */}
        {activeTab === "reviews" && (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1">
                    Client Ratings & Feedback Moderation
                  </h4>

                  <p className="text-muted mb-0">
                    Monitor client ratings and manage feedback reviews across advocates.
                  </p>
                </div>

                <span className="badge bg-danger text-white rounded-pill px-3 py-2 fs-6">
                  {reviews?.length || 0} Total Reviews
                </span>
              </div>

              {!reviews || reviews.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-star display-3 text-muted"></i>
                  <h5 className="fw-semibold mt-3">
                    No client reviews submitted yet
                  </h5>

                  <p className="text-muted mb-0">
                    Client feedback and ratings will appear here once submitted on advocate profiles.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Client Name</th>
                        <th>Advocate</th>
                        <th>Rating</th>
                        <th>Feedback Comment</th>
                        <th>Date</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {reviews.map((rev) => {
                        const targetAdv = registeredAdvocates.find(
                          (a) =>
                            String(a.id) === String(rev.advocateId) ||
                            a.name?.toLowerCase() === rev.advocateName?.toLowerCase()
                        );
                        const isBadReview = Number(rev.rating) <= 2;

                        return (
                          <tr key={rev.id}>
                            <td>
                              <strong>{rev.userName || "Client"}</strong>
                            </td>

                            <td>
                              <div>
                                <span className="badge bg-secondary">
                                  {rev.advocateName || "Advocate"}
                                </span>
                                {targetAdv && (
                                  <div className="mt-1">
                                    <span
                                      className={`badge ${
                                        targetAdv.status === "verified"
                                          ? "bg-success"
                                          : targetAdv.status === "rejected"
                                          ? "bg-danger"
                                          : "bg-warning text-dark"
                                      }`}
                                      style={{ fontSize: "0.7rem" }}
                                    >
                                      {targetAdv.status}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>

                            <td>
                              <span
                                className={`badge ${
                                  isBadReview
                                    ? "bg-danger text-white"
                                    : "bg-warning text-dark"
                                } rounded-pill px-2`}
                              >
                                ★ {rev.rating || 5} / 5
                              </span>
                            </td>

                            <td style={{ maxWidth: "300px" }}>
                              <p className="mb-0 small text-dark">
                                {rev.comment || "(No comment)"}
                              </p>
                            </td>

                            <td className="small text-muted">
                              {new Date(
                                rev.createdAt || Date.now()
                              ).toLocaleDateString()}
                            </td>

                            <td className="text-end">
                              <div className="d-flex gap-2 justify-content-end">
                                {targetAdv && targetAdv.status === "verified" && (
                                  <button
                                    type="button"
                                    className="btn btn-outline-warning btn-sm rounded-pill"
                                    title="Revoke this advocate's approval due to bad review"
                                    onClick={() =>
                                      handleRevokeAdvocate(
                                        targetAdv,
                                        `bad review ("${rev.comment || 'Low rating'}")`
                                      )
                                    }
                                  >
                                    <i className="bi bi-person-x-fill me-1"></i>
                                    Revoke Advocate
                                  </button>
                                )}

                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm rounded-pill"
                                  onClick={() => {
                                    deleteReview(rev.id);
                                    showMessage("Client review deleted successfully.");
                                  }}
                                >
                                  <i className="bi bi-trash me-1"></i>
                                  Delete Review
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          </div>
        )}

        {/* SUPPORT & SITE ISSUES TAB */}
        {activeTab === "support" && (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                  <h4 className="fw-bold mb-1">
                    <i className="bi bi-headset text-warning me-2"></i>
                    Support & Site Issues Reported
                  </h4>
                  <p className="text-muted mb-0">
                    Messages & technical issues submitted by Advocates and Users.
                  </p>
                </div>

                <div className="d-flex gap-2 align-items-center">
                  <span className="badge bg-warning text-dark rounded-pill px-3 py-2">
                    {pendingTickets.length} Pending Issues
                  </span>
                </div>
              </div>

              {/* Filters */}
              <div className="d-flex gap-2 mb-4 flex-wrap bg-light p-2 rounded-3 border">
                <button
                  className={`btn btn-sm rounded-pill ${ticketFilter === "all" ? "btn-dark" : "btn-outline-dark"}`}
                  onClick={() => setTicketFilter("all")}
                >
                  All Messages ({supportTickets?.length || 0})
                </button>
                <button
                  className={`btn btn-sm rounded-pill ${ticketFilter === "pending" ? "btn-dark" : "btn-outline-dark"}`}
                  onClick={() => setTicketFilter("pending")}
                >
                  Pending ({pendingTickets.length})
                </button>
                <button
                  className={`btn btn-sm rounded-pill ${ticketFilter === "advocate" ? "btn-dark" : "btn-outline-dark"}`}
                  onClick={() => setTicketFilter("advocate")}
                >
                  From Advocates ({(supportTickets || []).filter(t => t.senderRole === 'advocate').length})
                </button>
                <button
                  className={`btn btn-sm rounded-pill ${ticketFilter === "user" ? "btn-dark" : "btn-outline-dark"}`}
                  onClick={() => setTicketFilter("user")}
                >
                  From Users ({(supportTickets || []).filter(t => t.senderRole === 'user').length})
                </button>
                <button
                  className={`btn btn-sm rounded-pill ${ticketFilter === "resolved" ? "btn-dark" : "btn-outline-dark"}`}
                  onClick={() => setTicketFilter("resolved")}
                >
                  Resolved ({(supportTickets || []).filter(t => t.status === 'Resolved').length})
                </button>
              </div>

              {filteredTickets.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox fs-1 d-block mb-2 text-muted"></i>
                  <h5 className="fw-semibold">No messages found</h5>
                  <p className="text-muted mb-0">No support tickets match the selected filter.</p>
                </div>
              ) : (
                <div className="row g-4">
                  {filteredTickets.map((ticket) => (
                    <div className="col-lg-6" key={ticket.id}>
                      <div className="card border rounded-4 h-100 shadow-sm">
                        <div className="card-body p-4">

                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <span className={`badge mb-2 me-2 ${ticket.senderRole === "advocate" ? "bg-primary" : "bg-dark"}`}>
                                <i className={`bi ${ticket.senderRole === "advocate" ? "bi-award-fill" : "bi-person-fill"} me-1`}></i>
                                {ticket.senderRole === "advocate" ? "Advocate" : "User / Client"}
                              </span>
                              <span className="badge bg-light text-dark border">
                                {ticket.category || "General"}
                              </span>
                              <h5 className="fw-bold mb-1 mt-2">{ticket.subject}</h5>
                            </div>
                            <span
                              className={`badge rounded-pill px-3 py-2 ${
                                ticket.status === "Resolved"
                                  ? "bg-success"
                                  : ticket.status === "In Progress"
                                  ? "bg-info text-dark"
                                  : "bg-warning text-dark"
                              }`}
                            >
                              {ticket.status || "Pending"}
                            </span>
                          </div>

                          <div className="bg-light p-3 rounded-3 mb-3 border">
                            <p className="mb-0 small text-dark font-monospace" style={{ whiteSpace: "pre-wrap" }}>
                              "{ticket.message}"
                            </p>
                          </div>

                          <div className="small text-muted mb-3 d-flex flex-column gap-1">
                            <div><strong>Sender:</strong> {ticket.senderName} ({ticket.senderEmail || "No Email"})</div>
                            <div><strong>Submitted:</strong> {new Date(ticket.createdAt).toLocaleString()}</div>
                          </div>

                          <hr />

                          <div className="d-flex gap-2 flex-wrap">
                            {ticket.status !== "Resolved" && (
                              <button
                                className="btn btn-success btn-sm rounded-pill fw-bold flex-fill"
                                onClick={() => {
                                  updateSupportTicketStatus(ticket.id, "Resolved");
                                  showMessage(`Ticket marked as Resolved.`);
                                }}
                              >
                                <i className="bi bi-check-circle-fill me-1"></i>
                                Mark Resolved
                              </button>
                            )}

                            {ticket.status !== "In Progress" && ticket.status !== "Resolved" && (
                              <button
                                className="btn btn-outline-info btn-sm rounded-pill fw-bold text-dark flex-fill"
                                onClick={() => {
                                  updateSupportTicketStatus(ticket.id, "In Progress");
                                  showMessage(`Ticket status set to In Progress.`);
                                }}
                              >
                                Mark In Progress
                              </button>
                            )}

                            <button
                              className="btn btn-outline-danger btn-sm rounded-pill fw-bold"
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete this message?")) {
                                  deleteSupportTicket(ticket.id);
                                  showMessage("Ticket deleted.");
                                }
                              }}
                            >
                              <i className="bi bi-trash me-1"></i> Delete
                            </button>
                          </div>

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

      </div>

        {/* DOCUMENT PREVIEW MODAL */}
        {viewDocModal && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.65)", zIndex: 1065 }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
                <div className="modal-header bg-dark text-white p-3 px-4">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-shield-check text-warning me-2"></i>
                    {viewDocModal.title}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setViewDocModal(null)}
                  ></button>
                </div>
                <div className="modal-body p-4 text-center">
                  <p className="text-muted mb-3">
                    Uploaded by <strong>{viewDocModal.advocateName}</strong> (File: {viewDocModal.doc?.name || "Document"})
                  </p>

                  <div className="bg-light p-3 rounded-3 border mb-4 text-center overflow-auto" style={{ maxHeight: "450px" }}>
                    {viewDocModal.doc?.type?.includes("image") || viewDocModal.doc?.data?.startsWith("data:image") ? (
                      <img
                        src={viewDocModal.doc.data}
                        alt={viewDocModal.title}
                        className="img-fluid rounded shadow-sm border"
                        style={{ maxHeight: "400px", objectFit: "contain" }}
                      />
                    ) : viewDocModal.doc?.type?.includes("pdf") || viewDocModal.doc?.data?.startsWith("data:application/pdf") ? (
                      <iframe
                        src={viewDocModal.doc.data}
                        title={viewDocModal.title}
                        width="100%"
                        height="400px"
                        className="rounded border"
                      ></iframe>
                    ) : (
                      <div className="py-5">
                        <i className="bi bi-file-earmark-text display-1 text-secondary mb-3 d-block"></i>
                        <h6 className="fw-bold">{viewDocModal.doc?.name || "Certificate File"}</h6>
                        <p className="text-muted small">File format: {viewDocModal.doc?.type || "Binary document"}</p>
                      </div>
                    )}
                  </div>

                  <div className="d-flex justify-content-center gap-3">
                    <a
                      href={viewDocModal.doc?.data}
                      download={viewDocModal.doc?.name || "Advocate-Verification-Document"}
                      className="btn btn-outline-dark rounded-pill fw-bold px-4"
                    >
                      <i className="bi bi-download me-2"></i>
                      Download Document
                    </a>

                    {viewDocModal.advocateObj && (
                      <button
                        type="button"
                        className="btn btn-success rounded-pill fw-bold px-4"
                        onClick={() => {
                          handleApprove(viewDocModal.advocateObj);
                          setViewDocModal(null);
                        }}
                      >
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Approve Advocate Account
                      </button>
                    )}
                  </div>
                </div>
                <div className="modal-footer border-0 bg-light p-3 justify-content-center">
                  <button
                    type="button"
                    className="btn btn-secondary rounded-pill px-4 fw-bold"
                    onClick={() => setViewDocModal(null)}
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

    </div>
  );
};

export default AdminDashboard;