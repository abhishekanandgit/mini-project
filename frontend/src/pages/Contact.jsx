import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

export default function Contact() {
  const { currentUser } = useAuth();
  const { createSupportTicket } = useData();

  if (currentUser?.role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    category: "General Support",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    setLoading(true);
    try {
      await createSupportTicket({
        senderId: currentUser?.id || `guest-${Date.now()}`,
        senderName: formData.name.trim(),
        senderEmail: formData.email.trim(),
        senderRole: currentUser?.role || "user",
        category: formData.category,
        subject: `${formData.category}: Message from ${formData.name}`,
        message: formData.message.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      console.log("Error creating support ticket:", err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 bg-slate min-vh-100">
      <div className="container">
        <div className="row g-4 justify-content-center">
          <div className="col-lg-8">
            <div className="card legal-card p-4 p-md-5">
              <div className="text-center mb-4">
                <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-2">
                  Support & Feedback
                </span>

                <h3 className="fw-bold text-dark">
                  Contact LegalAssist Help Desk
                </h3>

                <p className="text-muted small">
                  Have questions regarding advocate verification or technical
                  support?
                </p>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">
                        Your Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">
                        Email Address
                      </label>

                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="name@domain.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      Query Category
                    </label>

                    <select
                      name="category"
                      className="form-select"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option>General Support</option>
                      <option>Advocate Verification Issue</option>
                      <option>Appointment / Booking Help</option>
                      <option>Technical Feedback</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-semibold">
                      Message
                    </label>

                    <textarea
                      name="message"
                      className="form-control"
                      rows="4"
                      placeholder="Describe your query..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-gold w-100 rounded-pill py-2 fw-bold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Sending to Admin...
                      </>
                    ) : (
                      "Send Message to Support"
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-check-circle-fill display-3 text-success d-block mb-3"></i>

                  <h4 className="fw-bold">
                    Message Sent to Admin Successfully!
                  </h4>

                  <p className="text-muted">
                    Your message has been delivered directly to the System Administrator. The admin team will review your query and respond shortly.
                  </p>

                  <button
                    className="btn btn-dark rounded-pill px-4"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData((prev) => ({
                        ...prev,
                        message: "",
                      }));
                    }}
                  >
                    Send Another Inquiry
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}