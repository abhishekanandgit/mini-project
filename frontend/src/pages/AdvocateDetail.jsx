import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";

function AdvocateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { advocates, getAdvocateRating, addReview } = useData();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const advocate = advocates.find(
    (item) => String(item.id) === String(id)
  );

  const { avgRating, count: reviewCount, reviews: advocateReviews } = getAdvocateRating(id);

  if (!advocate) {
    return (
      <div className="bg-light min-vh-100 py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-7">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center py-5">

                  <i className="bi bi-person-x display-3 text-muted"></i>

                  <h3 className="fw-bold mt-3">
                    Advocate Not Found
                  </h3>

                  <p className="text-muted">
                    The requested advocate profile could not be found.
                  </p>

                  <button
                    className="btn btn-dark rounded-pill px-4"
                    onClick={() => navigate("/advocates")}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Advocates
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isVerified =
    advocate.status === "verified" ||
    advocate.verified === true;

  return (
    <div className="bg-light min-vh-100 py-5">

      <div className="container">

        {/* BACK */}
        <div className="mb-4">
          <Link
            to="/advocates"
            className="text-decoration-none text-dark"
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Advocates
          </Link>
        </div>

        <div className="row g-4">

          {/* PROFILE */}
          <div className="col-lg-8">

            <div className="card border-0 shadow-sm">

              <div className="card-body p-4 p-md-5">

                <div className="d-flex flex-column flex-md-row align-items-md-center mb-4">

                  <div
                    className="rounded-circle bg-dark text-danger d-flex align-items-center justify-content-center fw-bold mb-3 mb-md-0 me-md-4"
                    style={{
                      width: "90px",
                      height: "90px",
                      fontSize: "32px",
                    }}
                  >
                    {advocate.name
                      ?.charAt(0)
                      ?.toUpperCase() || "A"}
                  </div>

                  <div>

                    <div className="d-flex align-items-center flex-wrap gap-2">

                      <h2 className="fw-bold mb-1">
                        {advocate.name}
                      </h2>

                      {isVerified && (
                        <span className="badge bg-success-subtle text-success">
                          <i className="bi bi-patch-check-fill me-1"></i>
                          Verified
                        </span>
                      )}

                    </div>

                    <p className="text-muted mb-1">
                      {advocate.specialization ||
                        "Legal Professional"}
                    </p>

                    {advocate.location && (
                      <small className="text-muted">
                        <i className="bi bi-geo-alt me-1"></i>
                        {advocate.location}
                      </small>
                    )}

                  </div>

                </div>

                <hr />

                {/* BASIC INFORMATION */}
                <div className="row g-4 py-3">

                  <div className="col-md-4">

                    <div className="text-muted small mb-1">
                      Experience
                    </div>

                    <div className="fw-bold">
                      <i className="bi bi-award me-2 text-warning"></i>
                      {advocate.experience ?? 0} years
                    </div>

                  </div>

                  <div className="col-md-4">

                    <div className="text-muted small mb-1">
                      Cases Handled
                    </div>

                    <div className="fw-bold">
                      <i className="bi bi-folder-check me-2 text-primary"></i>
                      {advocate.casesHandled ?? 0}
                    </div>

                  </div>

                  <div className="col-md-4">

                    <div className="text-muted small mb-1">
                      Rating & Reviews
                    </div>

                    <div className="fw-bold text-danger">
                      <i className="bi bi-star-fill me-1 text-warning"></i>
                      {avgRating} <span className="text-muted fw-normal small">({reviewCount} reviews)</span>
                    </div>

                  </div>

                </div>

                {/* SPECIALIZATION */}
                <div className="mt-4">

                  <h5 className="fw-bold">
                    Specialization
                  </h5>

                  <p className="text-muted">
                    {advocate.specialization ||
                      "Not specified"}
                  </p>

                </div>

                {/* QUALIFICATIONS */}
                <div className="mt-4">

                  <h5 className="fw-bold">
                    Qualifications
                  </h5>

                  <p className="text-muted">
                    {advocate.qualifications ||
                      "Not provided"}
                  </p>

                </div>

                {/* BAR ID */}
                <div className="mt-4">

                  <h5 className="fw-bold">
                    Bar Council ID
                  </h5>

                  <p className="text-muted mb-0">
                    {advocate.barId ||
                      "Not provided"}
                  </p>

                </div>

                {/* BIO */}
                <div className="mt-4">

                  <h5 className="fw-bold">
                    About the Advocate
                  </h5>

                  <p className="text-muted mb-0">
                    {advocate.bio ||
                      "No biography has been added by this advocate yet."}
                  </p>

                </div>

                {/* WEEKLY AVAILABILITY */}
                <div className="mt-4 pt-3 border-top">
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-clock-history me-2 text-primary"></i>
                    Weekly Appointment Availability
                  </h5>

                  <div className="row g-2">
                    {[
                      { key: "monday", label: "Monday" },
                      { key: "tuesday", label: "Tuesday" },
                      { key: "wednesday", label: "Wednesday" },
                      { key: "thursday", label: "Thursday" },
                      { key: "friday", label: "Friday" },
                      { key: "saturday", label: "Saturday" },
                      { key: "sunday", label: "Sunday" },
                    ].map((day) => {
                      const slots = advocate.availability?.[day.key] || [];

                      return (
                        <div key={day.key} className="col-12 col-sm-6">
                          <div className="border rounded p-2 d-flex justify-content-between align-items-center bg-white">
                            <span className="fw-semibold small">{day.label}</span>
                            {slots.length === 0 ? (
                              <span className="badge bg-light text-muted border">Unavailable</span>
                            ) : (
                              <div className="d-flex flex-column text-end">
                                {slots.map((slot, i) => (
                                  <span key={i} className="badge bg-primary-subtle text-primary small mb-1">
                                    {slot.start} - {slot.end}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CLIENT REVIEWS & FEEDBACK SECTION */}
                <div className="mt-4 pt-3 border-top">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">
                      <i className="bi bi-star-fill text-warning me-2"></i>
                      Client Ratings & Reviews ({reviewCount})
                    </h5>
                    <span className="badge bg-danger text-white rounded-pill px-3 py-2 fs-6 shadow-sm">
                      ★ {avgRating} / 5.0
                    </span>
                  </div>

                  {/* FEEDBACK SUBMISSION FORM */}
                  <div className="bg-light p-3 p-md-4 rounded-4 border mb-4">
                    <h6 className="fw-bold mb-2">
                      <i className="bi bi-pencil-square me-2 text-danger"></i>
                      Leave a Rating & Feedback
                    </h6>

                    {feedbackMsg && (
                      <div className="alert alert-success py-2 px-3 small rounded-3 mb-3">
                        {feedbackMsg}
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted d-block mb-1">
                        Select Rating (1 to 5 Stars):
                      </label>
                      <div className="d-flex gap-2 align-items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`btn btn-sm ${
                              rating >= star ? "btn-warning text-dark" : "btn-outline-secondary"
                            } rounded-circle p-2 d-inline-flex align-items-center justify-content-center`}
                            style={{ width: "36px", height: "36px" }}
                            onClick={() => setRating(star)}
                          >
                            <i className="bi bi-star-fill"></i>
                          </button>
                        ))}
                        <span className="fw-bold ms-2 text-warning fs-5">
                          {rating} Star{rating > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted mb-1">
                        Your Feedback / Experience:
                      </label>
                      <textarea
                        className="form-control form-control-sm"
                        rows="3"
                        placeholder="Write your honest review about this advocate's consultation and legal assistance..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                    </div>

                    <button
                      type="button"
                      disabled={submitting}
                      className="btn btn-danger btn-sm rounded-pill px-4 fw-bold shadow-sm"
                      onClick={async () => {
                        if (!comment.trim()) {
                          setFeedbackMsg("Please type a short feedback comment before submitting.");
                          setTimeout(() => setFeedbackMsg(""), 3000);
                          return;
                        }

                        setSubmitting(true);
                        await addReview({
                          advocateId: advocate.id,
                          advocateName: advocate.name,
                          userId: currentUser?.id || "user",
                          userName: currentUser?.name || "Client",
                          rating,
                          comment,
                        });

                        setComment("");
                        setFeedbackMsg("Thank you! Your rating and feedback have been published successfully.");
                        setSubmitting(false);
                        setTimeout(() => setFeedbackMsg(""), 4000);
                      }}
                    >
                      <i className="bi bi-send-fill me-1"></i>
                      Submit Review
                    </button>
                  </div>

                  {/* REVIEWS LIST */}
                  {advocateReviews.length === 0 ? (
                    <p className="text-muted small mb-0 fst-italic">
                      No client reviews yet. Be the first to leave a feedback rating for this advocate!
                    </p>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {advocateReviews.map((rev) => (
                        <div key={rev.id} className="p-3 bg-white rounded-3 border shadow-sm">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <strong className="text-dark small">
                              <i className="bi bi-person-circle text-secondary me-1"></i>
                              {rev.userName || "Client"}
                            </strong>
                            <span className="badge bg-warning text-dark rounded-pill px-2">
                              {"★".repeat(rev.rating || 5)} ({rev.rating}/5)
                            </span>
                          </div>
                          <p className="mb-1 text-muted small">{rev.comment}</p>
                          <small className="text-muted opacity-75" style={{ fontSize: "10px" }}>
                            Submitted on {new Date(rev.createdAt || Date.now()).toLocaleDateString()}
                          </small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>

          {/* BOOKING CARD */}
          <div className="col-lg-4">

            <div className="card border-0 shadow-sm">

              <div className="card-body p-4">

                <h5 className="fw-bold mb-4">
                  Consultation
                </h5>

                <div className="mb-4">

                  <div className="text-muted small mb-1">
                    Consultation Fee
                  </div>

                  <div className="fs-3 fw-bold">
                    {advocate.fees !== undefined &&
                    advocate.fees !== null
                      ? `₹${Number(
                          advocate.fees
                        ).toLocaleString()}`
                      : "Not specified"}
                  </div>

                </div>

                {advocate.email && (
                  <div className="mb-3">

                    <div className="text-muted small mb-1">
                      Email
                    </div>

                    <div className="fw-semibold text-break">
                      <i className="bi bi-envelope me-2"></i>
                      {advocate.email}
                    </div>

                  </div>
                )}

                {advocate.phone && (
                  <div className="mb-4">

                    <div className="text-muted small mb-1">
                      Phone
                    </div>

                    <div className="fw-semibold">
                      <i className="bi bi-telephone me-2"></i>
                      {advocate.phone}
                    </div>

                  </div>
                )}

                {isVerified ? (

                  <Link
                    to={`/book-appointment?advocateId=${encodeURIComponent(
                      advocate.id
                    )}`}
                    className="btn btn-dark w-100 rounded-pill py-2"
                  >
                    <i className="bi bi-calendar-check me-2"></i>
                    Book Appointment
                  </Link>

                ) : (

                  <button
                    className="btn btn-secondary w-100 rounded-pill py-2"
                    disabled
                  >
                    Advocate Not Verified
                  </button>

                )}

              </div>

            </div>

            <div className="card border-0 shadow-sm mt-4">

              <div className="card-body p-4">

                <h6 className="fw-bold">
                  <i className="bi bi-info-circle me-2 text-primary"></i>
                  Important
                </h6>

                <p className="text-muted small mb-0">
                  LegalAssist provides a platform to connect users
                  with advocates. Consultation decisions and legal
                  advice are provided by the advocate.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdvocateDetail;