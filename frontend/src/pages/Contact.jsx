import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Contact() {
  const { currentUser } = useAuth();

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitted(true);
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
                    className="btn btn-gold w-100 rounded-pill py-2"
                  >
                    Send Message to Support
                  </button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-check-circle-fill display-3 text-success d-block mb-3"></i>

                  <h4 className="fw-bold">
                    Message Sent Successfully!
                  </h4>

                  <p className="text-muted">
                    Our support team will respond to your inquiry within 24
                    hours.
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