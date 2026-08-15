import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto border-top border-secondary">
      <div className="container">
        <div className="row g-4">
          
          <div className="col-lg-4 col-md-6">
            <h5 className="fw-bold d-flex align-items-center text-danger mb-3">
              <i className="bi bi-shield-lock-fill me-2"></i> LegalAssist
            </h5>
            <p className="text-white-50 small mb-3">
              AI-Powered Advocate Appointment & Case Management System. Connecting clients with verified legal advocates across India through a secure, transparent, and centralized platform.
            </p>
            <div className="d-flex gap-3">
              <span className="badge bg-secondary p-2"><i className="bi bi-shield-check text-success me-1"></i> Bar Council Verified</span>
              <span className="badge bg-secondary p-2"><i className="bi bi-lock-fill text-danger me-1"></i> SSL Encrypted</span>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-white mb-3">Quick Links</h6>
            <ul className="list-unstyled small text-white-50">
              <li className="mb-2"><Link to="/" className="text-white-50 text-decoration-none">Home</Link></li>
              <li className="mb-2"><Link to="/advocates" className="text-white-50 text-decoration-none">Find Advocates</Link></li>
              <li className="mb-2"><Link to="/book-appointment" className="text-white-50 text-decoration-none">Book Consultation</Link></li>
              <li className="mb-2"><Link to="/about" className="text-white-50 text-decoration-none">About Us</Link></li>
              <li className="mb-2"><Link to="/contact" className="text-white-50 text-decoration-none">Contact & Support</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-white mb-3">Legal Specializations</h6>
            <ul className="list-unstyled small text-white-50">
              <li className="mb-2">Criminal & Bail Defense</li>
              <li className="mb-2">Corporate & Startup Compliance</li>
              <li className="mb-2">Family & Matrimonial Disputes</li>
              <li className="mb-2">Cyber Law & Data Protection</li>
              <li className="mb-2">Civil Litigations & Writ Petitions</li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-danger mb-3">
              <i className="bi bi-telephone-outbound-fill me-2"></i> Emergency Helplines
            </h6>
            <div className="bg-secondary bg-opacity-25 p-3 rounded-3 text-white-50 small mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span>National Police SOS:</span>
                <strong className="text-white">112</strong>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Legal Aid Helpline:</span>
                <strong className="text-white">15100</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Women Helpline:</span>
                <strong className="text-white">1091</strong>
              </div>
            </div>
            <small className="text-white-50 d-block">
              For urgent legal intervention, click the Emergency SOS button on top.
            </small>
          </div>

        </div>

        <hr className="my-4 border-secondary" />

        <div className="row align-items-center small text-white-50">
          <div className="col-md-6 text-center text-md-start">
            © 2026 LegalAssist System. All rights reserved.
          </div>
          <div className="col-md-6 text-center text-md-end mt-2 mt-md-0">
            <span className="me-3">Privacy Policy</span>
            <span className="me-3">Terms of Consultation</span>
            <span>Advocate Verification Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}