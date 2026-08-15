import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addAdvocate } = useData();

  const [role, setRole] = useState("user");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",

    barId: "",
    specialization: "",
    experience: "",
    fees: "",
    qualifications: "",
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

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!formData.password.trim()) {
      setError("Please enter a password.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (role === "advocate") {
      if (!formData.barId.trim()) {
        setError("Please enter your Bar Council ID.");
        return;
      }

      if (!formData.specialization.trim()) {
        setError("Please select your specialization.");
        return;
      }

      if (formData.experience === "") {
        setError("Please enter your experience.");
        return;
      }

      if (formData.fees === "") {
        setError("Please enter your consultation fee.");
        return;
      }

      if (!formData.qualifications.trim()) {
        setError("Please enter your qualifications.");
        return;
      }
    }

    setLoading(true);

    const userData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      password: formData.password,
      role,
    };

    if (role === "advocate") {
      userData.barId = formData.barId.trim();
      userData.specialization = formData.specialization.trim();
      userData.experience = Number(formData.experience);
      userData.fees = Number(formData.fees);
      userData.qualifications = formData.qualifications.trim();
      userData.casesHandled = 0;
      userData.rating = 0;
      userData.bio = "";
      userData.avatar = "";
      userData.location = "";
    }

    const result = register(userData);

    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }

    if (role === "advocate") {
      addAdvocate(result.user);

      navigate("/advocate-dashboard");
    } else {
      navigate("/user-dashboard");
    }

    setLoading(false);
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center py-5"
      style={{
        background: "#f8f9fa",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-md-9">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-body p-4 p-md-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-2">
                    Create Your Account
                  </h2>

                  <p className="text-muted mb-0">
                    Register with LegalAssist
                  </p>
                </div>

                {/* Role Selection */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Register As
                  </label>

                  <div className="row g-3">
                    <div className="col-6">
                      <button
                        type="button"
                        className={`btn w-100 py-3 rounded-3 ${
                          role === "user"
                            ? "btn-dark"
                            : "btn-outline-dark"
                        }`}
                        onClick={() =>
                          handleRoleChange("user")
                        }
                      >
                        User
                      </button>
                    </div>

                    <div className="col-6">
                      <button
                        type="button"
                        className={`btn w-100 py-3 rounded-3 ${
                          role === "advocate"
                            ? "btn-dark"
                            : "btn-outline-dark"
                        }`}
                        onClick={() =>
                          handleRoleChange("advocate")
                        }
                      >
                        Advocate
                      </button>
                    </div>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div
                    className="alert alert-danger rounded-3"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit}>
                  {/* Name */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control form-control-lg rounded-3"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control form-control-lg rounded-3"
                      placeholder="Enter your email address"
                    />
                  </div>

                  {/* Phone */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-control form-control-lg rounded-3"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Password
                    </label>

                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-control form-control-lg rounded-3"
                      placeholder="Create a password"
                    />
                  </div>

                  {/* Advocate Fields */}
                  {role === "advocate" && (
                    <>
                      <hr className="my-4" />

                      <h5 className="fw-bold mb-3">
                        Advocate Information
                      </h5>

                      {/* Bar ID */}
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Bar Council ID
                        </label>

                        <input
                          type="text"
                          name="barId"
                          value={formData.barId}
                          onChange={handleChange}
                          className="form-control form-control-lg rounded-3"
                          placeholder="Enter your Bar Council ID"
                        />
                      </div>

                      {/* Specialization */}
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Specialization
                        </label>

                        <select
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          className="form-select form-select-lg rounded-3"
                        >
                          <option value="" disabled>
                            Select specialization
                          </option>

                          <option value="Criminal Law">
                            Criminal Law
                          </option>

                          <option value="Civil Law">
                            Civil Law
                          </option>

                          <option value="Family Law">
                            Family Law
                          </option>

                          <option value="Corporate Law">
                            Corporate Law
                          </option>

                          <option value="Property Law">
                            Property Law
                          </option>

                          <option value="Consumer Law">
                            Consumer Law
                          </option>

                          <option value="Cyber Law">
                            Cyber Law
                          </option>

                          <option value="Intellectual Property">
                            Intellectual Property
                          </option>

                          <option value="Constitutional Law">
                            Constitutional Law
                          </option>

                          <option value="Labour Law">
                            Labour Law
                          </option>
                        </select>
                      </div>

                      {/* Experience */}
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Years of Experience
                        </label>

                        <input
                          type="number"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          className="form-control form-control-lg rounded-3"
                          placeholder="Enter years of experience"
                          min="0"
                        />
                      </div>

                      {/* Fees */}
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Consultation Fee
                        </label>

                        <input
                          type="number"
                          name="fees"
                          value={formData.fees}
                          onChange={handleChange}
                          className="form-control form-control-lg rounded-3"
                          placeholder="Enter consultation fee"
                          min="0"
                        />
                      </div>

                      {/* Qualifications */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold">
                          Qualifications
                        </label>

                        <textarea
                          name="qualifications"
                          value={formData.qualifications}
                          onChange={handleChange}
                          className="form-control rounded-3"
                          rows="3"
                          placeholder="Enter your legal qualifications"
                        />
                      </div>

                      <div className="alert alert-warning rounded-3">
                        <strong>Important:</strong>{" "}
                        Advocate registrations require admin
                        approval before the account can be used
                        to log in.
                      </div>
                    </>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    className="btn btn-dark btn-lg w-100 rounded-pill mt-3"
                    disabled={loading}
                  >
                    {loading
                      ? "Creating Account..."
                      : "Create Account"}
                  </button>
                </form>

                {/* Login */}
                <div className="text-center mt-4">
                  <span className="text-muted">
                    Already have an account?{" "}
                  </span>

                  <button
                    type="button"
                    className="btn btn-link text-dark fw-semibold text-decoration-none p-0"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;