import React, { useState } from "react";
import { useData } from "../context/DataContext";

const ContactAdminModal = ({ show, onClose, currentUser, role = "user" }) => {
  const { supportTickets, createSupportTicket } = useData();

  const [activeTab, setActiveTab] = useState("new"); // "new" | "history"
  const [category, setCategory] = useState("Site Bug / Technical Issue");
  const [subject, setSubject] = useState("");
  const [messageText, setMessageText] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const myTickets = (supportTickets || []).filter(
    (t) => String(t.senderId) === String(currentUser?.id) || t.senderEmail === currentUser?.email
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!subject.trim()) {
      setError("Please enter a subject line for your message.");
      return;
    }

    if (!messageText.trim()) {
      setError("Please describe your issue or question in detail.");
      return;
    }

    setLoading(true);

    try {
      await createSupportTicket({
        senderId: currentUser?.id || `${role}-${Date.now()}`,
        senderName: currentUser?.name || currentUser?.fullName || "User",
        senderEmail: currentUser?.email || "",
        senderRole: role,
        category,
        subject: subject.trim(),
        message: messageText.trim(),
      });

      setSuccessMsg("Your message has been sent to the System Administrator! We will review it shortly.");
      setSubject("");
      setMessageText("");
      setTimeout(() => {
        setSuccessMsg("");
        setActiveTab("history");
      }, 2000);
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.65)", zIndex: 1065 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
          
          {/* HEADER */}
          <div className="modal-header bg-dark text-white p-3 px-4">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <i className="bi bi-envelope-paper-fill text-warning"></i>
              Contact Administrator & Report Issues
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          {/* NAV TABS */}
          <div className="bg-light border-bottom p-2 px-4 d-flex gap-2">
            <button
              className={`btn btn-sm rounded-pill fw-bold ${
                activeTab === "new" ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => setActiveTab("new")}
            >
              <i className="bi bi-plus-circle me-1"></i> Send New Message
            </button>
            <button
              className={`btn btn-sm rounded-pill fw-bold ${
                activeTab === "history" ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => setActiveTab("history")}
            >
              <i className="bi bi-clock-history me-1"></i> My Sent Messages
              {myTickets.length > 0 && (
                <span className="badge bg-warning text-dark ms-2">
                  {myTickets.length}
                </span>
              )}
            </button>
          </div>

          {/* BODY */}
          <div className="modal-body p-4">
            {activeTab === "new" ? (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="alert alert-danger rounded-3 p-3 mb-3">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}

                {successMsg && (
                  <div className="alert alert-success rounded-3 p-3 mb-3">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {successMsg}
                  </div>
                )}

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Sender Name</label>
                    <input
                      type="text"
                      className="form-control rounded-3 bg-light"
                      value={`${currentUser?.name || "User"} (${role.toUpperCase()})`}
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Issue Category</label>
                    <select
                      className="form-select rounded-3"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Site Bug / Technical Issue">Site Bug / Technical Problem</option>
                      <option value="Account & Verification Help">Account & Verification Help</option>
                      <option value="Appointment & Meeting Issue">Appointment & Meeting Issue</option>
                      <option value="Legal Case Feature Help">Legal Case Feature Help</option>
                      <option value="General Feedback / Inquiry">General Feedback / Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Subject / Title</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="Brief summary of the problem or question"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Detailed Description / Message</label>
                  <textarea
                    className="form-control rounded-3"
                    rows="5"
                    placeholder="Please explain the issue or question in detail so the admin team can help you promptly..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  ></textarea>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4 fw-bold"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-dark rounded-pill px-4 fw-bold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send-fill me-2"></i> Send Message to Admin
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <h6 className="fw-bold mb-3">Your Support Tickets & Sent Messages</h6>
                {myTickets.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-1 d-block mb-2 text-secondary"></i>
                    <p className="mb-0">You haven't sent any support messages yet.</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3 overflow-auto" style={{ maxHeight: "400px" }}>
                    {myTickets.map((ticket) => (
                      <div key={ticket.id} className="card border rounded-3 p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="fw-bold mb-1">{ticket.subject}</h6>
                            <span className="badge bg-light text-dark border me-2">
                              {ticket.category}
                            </span>
                            <small className="text-muted">
                              {new Date(ticket.createdAt).toLocaleString()}
                            </small>
                          </div>
                          <span
                            className={`badge rounded-pill ${
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
                        <p className="mb-0 small text-secondary bg-light p-2 rounded">
                          "{ticket.message}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="modal-footer border-0 bg-light p-3 justify-content-center">
            <button
              type="button"
              className="btn btn-secondary rounded-pill px-4 fw-bold"
              onClick={onClose}
            >
              Close Window
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactAdminModal;
