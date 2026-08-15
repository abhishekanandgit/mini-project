import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-light min-vh-100">

      {/* HERO SECTION */}
      <section
        className="text-white py-5 position-relative shadow"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.45)), url('/saul.jpeg')`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          minHeight: "560px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container py-5">
          <div className="row align-items-center justify-content-center">

            <div className="col-lg-10 text-center">

              <span className="badge bg-danger text-white rounded-pill px-3 py-2 mb-3 shadow-lg fw-bold fs-6">
                <i className="bi bi-shield-check me-2"></i>
                LegalAssist
              </span>

              <h1
                className="display-4 fw-bold mb-3 text-white lh-sm"
                style={{ textShadow: "0 3px 12px rgba(0, 0, 0, 0.9)" }}
              >
                LegalAssist: <span className="text-danger">AI-Powered Advocate Appointment and Case Management System</span>
              </h1>

              <p
                className="lead text-white fw-medium mb-4 mx-auto"
                style={{ maxWidth: "820px", textShadow: "0 2px 8px rgba(0, 0, 0, 0.9)" }}
              >
                LegalAssist is an AI-powered platform that helps users
                understand basic legal terms, manage advocate appointments, and
                track their legal cases in real-time.
              </p>

              <div className="d-flex justify-content-center flex-wrap gap-3">

                <Link
                  to="/register"
                  className="btn btn-danger text-white btn-lg rounded-pill px-4 fw-bold shadow-sm"
                >
                  <i className="bi bi-person-plus me-2"></i>
                  Get Started
                </Link>

                <Link
                  to="/login"
                  className="btn btn-outline-light btn-lg rounded-pill px-4"
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login
                </Link>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-5">
        <div className="container">

          <div className="text-center mb-5">

            <span className="text-danger fw-bold text-uppercase small">
              LegalAssist
            </span>

            <h2 className="fw-bold mt-2">
              What You Can Do
            </h2>

            <p className="text-muted">
              Access important LegalAssist features from your account.
            </p>

          </div>

          <div className="row g-4 justify-content-center">

            {/* AI ASSISTANT */}
            <div className="col-md-6 col-lg-4">

              <div className="card border-0 shadow-sm h-100">

                <div className="card-body p-4 text-center">

                  <div
                    className="bg-dark text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "65px",
                      height: "65px",
                    }}
                  >
                    <i className="bi bi-robot fs-3"></i>
                  </div>

                  <h5 className="fw-bold">
                    AI Legal Assistant
                  </h5>

                  <p className="text-muted small mb-0">
                    Get basic information about legal terms, procedures,
                    rights and rules through the AI Legal Assistant.
                  </p>

                </div>

              </div>

            </div>

            {/* CASE MANAGEMENT */}
            <div className="col-md-6 col-lg-4">

              <div className="card border-0 shadow-sm h-100">

                <div className="card-body p-4 text-center">

                  <div
                    className="bg-danger-subtle text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "65px",
                      height: "65px",
                    }}
                  >
                    <i className="bi bi-folder-check fs-3"></i>
                  </div>

                  <h5 className="fw-bold">
                    Case Management
                  </h5>

                  <p className="text-muted small mb-0">
                    Track your legal case progress and view updates
                    from your consulting advocate.
                  </p>

                </div>

              </div>

            </div>

            {/* APPOINTMENTS */}
            <div className="col-md-6 col-lg-4">

              <div className="card border-0 shadow-sm h-100">

                <div className="card-body p-4 text-center">

                  <div
                    className="bg-danger-subtle text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "65px",
                      height: "65px",
                    }}
                  >
                    <i className="bi bi-calendar-check fs-3"></i>
                  </div>

                  <h5 className="fw-bold">
                    Appointment Management
                  </h5>

                  <p className="text-muted small mb-0">
                    Manage consultation requests and keep track of
                    your appointment status.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-5 bg-white">

        <div className="container">

          <div className="text-center mb-5">

            <span className="text-danger fw-bold text-uppercase small">
              Simple Process
            </span>

            <h2 className="fw-bold mt-2">
              How LegalAssist Works
            </h2>

          </div>

          <div className="row g-4 justify-content-center">

            <div className="col-md-4 text-center">

              <div
                className="rounded-circle bg-dark text-danger d-inline-flex align-items-center justify-content-center fw-bold fs-4 mb-3"
                style={{
                  width: "60px",
                  height: "60px",
                }}
              >
                1
              </div>

              <h5 className="fw-bold">
                Create an Account
              </h5>

              <p className="text-muted small">
                Register as a user and create your LegalAssist account.
              </p>

            </div>

            <div className="col-md-4 text-center">

              <div
                className="rounded-circle bg-dark text-danger d-inline-flex align-items-center justify-content-center fw-bold fs-4 mb-3"
                style={{
                  width: "60px",
                  height: "60px",
                }}
              >
                2
              </div>

              <h5 className="fw-bold">
                Use Legal Services
              </h5>

              <p className="text-muted small">
                From your dashboard, access advocates, appointments,
                cases and other available features.
              </p>

            </div>

            <div className="col-md-4 text-center">

              <div
                className="rounded-circle bg-dark text-danger d-inline-flex align-items-center justify-content-center fw-bold fs-4 mb-3"
                style={{
                  width: "60px",
                  height: "60px",
                }}
              >
                3
              </div>

              <h5 className="fw-bold">
                Track Your Case
              </h5>

              <p className="text-muted small">
                Monitor your case progress and stay connected with
                your consulting advocate.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="py-5">

        <div className="container">

          <div className="bg-dark text-white rounded-4 p-4 p-md-5 text-center">

            <h2 className="fw-bold mb-3">
              Ready to Get Started?
            </h2>

            <p className="text-white-50 mb-4">
              Create your LegalAssist account and access your
              personalized dashboard.
            </p>

            <Link
              to="/register"
              className="btn btn-danger text-white rounded-pill px-4 fw-bold shadow-sm"
            >
              Create Account
              <i className="bi bi-arrow-right ms-2"></i>
            </Link>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-dark text-white py-4">

        <div className="container">

          <div className="row align-items-center">

            <div className="col-md-6">

              <h5 className="fw-bold mb-1">
                <i className="bi bi-shield-check text-danger me-2"></i>
                LegalAssist
              </h5>

              <p className="text-white-50 small mb-0">
                AI-powered advocate appointment and case management
                system.
              </p>

            </div>

            <div className="col-md-6 text-md-end mt-3 mt-md-0">

              <Link
                to="/contact"
                className="text-white text-decoration-none"
              >
                Contact
              </Link>

            </div>

          </div>

          <hr className="border-secondary my-3" />

          <p className="text-center text-white-50 small mb-0">
            © {new Date().getFullYear()} LegalAssist. All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Home;