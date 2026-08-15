import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="py-5 bg-slate min-vh-100">
      <div className="container">
        
        <div className="max-w-3xl mx-auto text-center mb-5">
          <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-2">About LegalAssist</span>
          <h2 className="fw-bold display-6 text-dark">Bridging the Gap Between Clients & Legal Experts</h2>
          <p className="text-muted lead">
            LegalAssist is an AI-powered advocate appointment scheduling, case tracking, and legal guidance platform designed to bring transparency, efficiency, and emergency support to legal consultations.
          </p>
        </div>

        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card legal-card h-100 p-4 text-center">
              <div className="bg-primary-subtle text-primary rounded-circle p-3 d-inline-flex mx-auto mb-3" style={{ width: "64px", height: "64px" }}>
                <i className="bi bi-shield-check fs-3"></i>
              </div>
              <h5 className="fw-bold">100% Bar Verified</h5>
              <p className="text-muted small mb-0">
                Every advocate listed on LegalAssist undergoes administrator license verification to ensure legitimate legal representation.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card legal-card h-100 p-4 text-center">
              <div className="bg-warning-subtle text-warning rounded-circle p-3 d-inline-flex mx-auto mb-3" style={{ width: "64px", height: "64px" }}>
                <i className="bi bi-robot fs-3"></i>
              </div>
              <h5 className="fw-bold">24/7 AI Legal Support</h5>
              <p className="text-muted small mb-0">
                Our AI legal assistant helps users decode legal terms, understand court procedures, and know fundamental rights prior to booking.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card legal-card h-100 p-4 text-center">
              <div className="bg-danger-subtle text-danger rounded-circle p-3 d-inline-flex mx-auto mb-3" style={{ width: "64px", height: "64px" }}>
                <i className="bi bi-exclamation-triangle fs-3"></i>
              </div>
              <h5 className="fw-bold">Urgent Emergency SOS</h5>
              <p className="text-muted small mb-0">
                When facing sudden police detention or legal threat, users can trigger an instant high-priority alert to their advocate.
              </p>
            </div>
          </div>
        </div>

        <div className="card legal-card p-4 p-md-5 text-center bg-dark text-white">
          <h3 className="fw-bold mb-3">Ready to Consult a Legal Specialist?</h3>
          <p className="text-white-50 mb-4 max-w-xl mx-auto">
            Browse verified advocates by specialization, view transparent consultation fees, and schedule an appointment in minutes.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/advocates" className="btn btn-gold btn-lg px-4 rounded-pill">
              Browse Advocates
            </Link>
            <Link to="/book-appointment" className="btn btn-outline-light btn-lg px-4 rounded-pill">
              Book Appointment
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}