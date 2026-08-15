import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const result = await login(
        formData.email.trim(),
        formData.password,
        formData.role
      );

      if (!result?.success) {
        setError(result?.message || "Invalid login details.");
        return;
      }

      const user = result.user;

      const from = location.state?.from;

      if (from?.pathname) {
        navigate(
          `${from.pathname}${from.search || ""}${from.hash || ""}`,
          { replace: true }
        );
        return;
      }

      if (user.role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else if (user.role === "advocate") {
        navigate("/advocate-dashboard", { replace: true });
      } else {
        navigate("/user-dashboard", { replace: true });
      }
    } catch (err) {
      setError(
        err?.message || "Something went wrong while logging in."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">

          <div className="col-md-8 col-lg-5">

            <div className="card border-0 shadow-sm">

              <div className="card-body p-4 p-md-5">

                <div className="text-center mb-4">

                  <div
                    className="rounded-circle bg-dark text-warning d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "70px",
                      height: "70px",
                    }}
                  >
                    <i className="bi bi-shield-lock fs-2"></i>
                  </div>

                  <h2 className="fw-bold mb-2">
                    Welcome Back
                  </h2>

                  <p className="text-muted mb-0">
                    Login to your LegalAssist account
                  </p>

                </div>

                {error && (
                  <div
                    className="alert alert-danger small"
                    role="alert"
                  >
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  {/* ROLE */}
                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Login As
                    </label>

                    <select
                      name="role"
                      className="form-select"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="user">
                        User
                      </option>

                      <option value="advocate">
                        Advocate
                      </option>

                      <option value="admin">
                        Admin
                      </option>
                    </select>

                  </div>

                  {/* EMAIL */}
                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Email Address
                    </label>

                    <div className="input-group">

                      <span className="input-group-text bg-white">
                        <i className="bi bi-envelope"></i>
                      </span>

                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                      />

                    </div>

                  </div>

                  {/* PASSWORD */}
                  <div className="mb-4">

                    <label className="form-label fw-semibold">
                      Password
                    </label>

                    <div className="input-group">

                      <span className="input-group-text bg-white">
                        <i className="bi bi-lock"></i>
                      </span>

                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                      />

                    </div>

                  </div>

                  {/* LOGIN */}
                  <button
                    type="submit"
                    className="btn btn-dark w-100 rounded-pill py-2 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>

                        Logging in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Login
                      </>
                    )}
                  </button>

                </form>

                <div className="text-center mt-4">

                  <p className="text-muted mb-2">
                    Don't have an account?
                  </p>

                  <Link
                    to="/register"
                    className="btn btn-outline-dark rounded-pill px-4"
                  >
                    Create Account
                  </Link>

                </div>

              </div>

            </div>

            <div className="text-center mt-3">

              <Link
                to="/"
                className="text-decoration-none text-muted small"
              >
                <i className="bi bi-arrow-left me-1"></i>
                Back to Home
              </Link>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;