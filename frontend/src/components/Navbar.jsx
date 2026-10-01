import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardPath = () => {
    if (currentUser?.role === "admin") {
      return "/admin-dashboard";
    }

    if (currentUser?.role === "advocate") {
      return "/advocate-dashboard";
    }

    return "/user-dashboard";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">

        {/* LOGO */}
        <Link
          className="navbar-brand fw-bold"
          to="/"
        >
          <i className="bi bi-shield-check text-danger me-2"></i>
          LegalAssist
        </Link>

        {/* MOBILE MENU BUTTON */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#legalAssistNavbar"
          aria-controls="legalAssistNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* NAVIGATION */}
        <div
          className="collapse navbar-collapse"
          id="legalAssistNavbar"
        >
          <ul className="navbar-nav ms-auto align-items-lg-center">

            {/* HOME */}
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/"
              >
                Home
              </Link>
            </li>

            {/* CONTACT (Not shown for Admin) */}
            {currentUser?.role !== "admin" && (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/contact"
                >
                  Contact
                </Link>
              </li>
            )}

            {/* LOGGED-IN USER DASHBOARD */}
            {currentUser && (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to={getDashboardPath()}
                >
                  Dashboard
                </Link>
              </li>
            )}

            {/* NOT LOGGED IN */}
            {!currentUser ? (
              <>
                <li className="nav-item ms-lg-2">
                  <Link
                    className="btn btn-outline-light rounded-pill px-3"
                    to="/login"
                  >
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Login
                  </Link>
                </li>

                <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                  <Link
                    className="btn btn-danger text-white rounded-pill px-3 fw-bold shadow-sm"
                    to="/register"
                  >
                    <i className="bi bi-person-plus me-1"></i>
                    Register
                  </Link>
                </li>
              </>
            ) : (
              /* LOGGED-IN ACCOUNT */
              <li className="nav-item dropdown ms-lg-3">

                <button
                  className="btn btn-outline-light rounded-pill dropdown-toggle px-3"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-2"></i>
                  {currentUser.name || "Account"}
                </button>

                <ul className="dropdown-menu dropdown-menu-end">

                  {/* USER EMAIL */}
                  <li>
                    <span className="dropdown-item-text small text-muted">
                      {currentUser.email}
                    </span>
                  </li>

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  {/* DASHBOARD */}
                  <li>
                    <Link
                      className="dropdown-item"
                      to={getDashboardPath()}
                    >
                      <i className="bi bi-speedometer2 me-2"></i>
                      Dashboard
                    </Link>
                  </li>

                  {/* LOGOUT */}
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </li>

                </ul>

              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;