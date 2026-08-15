import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";

function Advocates() {
  const { advocates, getAdvocateRating } = useData();

  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");

  const verifiedAdvocates = useMemo(() => {
    return advocates.filter(
      (advocate) =>
        advocate.status === "verified" || advocate.verified === true
    );
  }, [advocates]);

  const specializations = useMemo(() => {
    return [
      ...new Set(
        verifiedAdvocates
          .map((advocate) => advocate.specialization)
          .filter(Boolean)
      ),
    ];
  }, [verifiedAdvocates]);

  const filteredAdvocates = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return verifiedAdvocates.filter((advocate) => {
      const matchesSearch =
        !searchValue ||
        advocate.name?.toLowerCase().includes(searchValue) ||
        advocate.specialization?.toLowerCase().includes(searchValue) ||
        advocate.location?.toLowerCase().includes(searchValue);

      const matchesSpecialization =
        !specialization ||
        advocate.specialization === specialization;

      return matchesSearch && matchesSpecialization;
    });
  }, [verifiedAdvocates, search, specialization]);

  return (
    <div className="bg-light min-vh-100">
      {/* HEADER */}
      <section className="bg-dark text-white py-5">
        <div className="container">
          <span className="badge bg-danger text-white rounded-pill px-3 py-2 mb-3">
            <i className="bi bi-person-badge me-2"></i>
            Verified Advocates
          </span>

          <h1 className="fw-bold mb-2">
            Find the Right Advocate
          </h1>

          <p className="text-white-50 mb-0">
            Browse verified advocates and choose a legal professional
            based on your requirements.
          </p>
        </div>
      </section>

      {/* SEARCH */}
      <section className="py-4">
        <div className="container">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">

              <div className="row g-3">

                <div className="col-lg-7">
                  <label className="form-label fw-semibold">
                    Search Advocate
                  </label>

                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <i className="bi bi-search"></i>
                    </span>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by name, specialization or location"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-lg-5">
                  <label className="form-label fw-semibold">
                    Specialization
                  </label>

                  <select
                    className="form-select"
                    value={specialization}
                    onChange={(e) =>
                      setSpecialization(e.target.value)
                    }
                  >
                    <option value="">
                      All Specializations
                    </option>

                    {specializations.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ADVOCATE LIST */}
      <section className="pb-5">
        <div className="container">

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-1">
                Available Advocates
              </h4>

              <p className="text-muted small mb-0">
                {filteredAdvocates.length} verified advocate
                {filteredAdvocates.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {(search || specialization) && (
              <button
                className="btn btn-outline-secondary btn-sm rounded-pill"
                onClick={() => {
                  setSearch("");
                  setSpecialization("");
                }}
              >
                <i className="bi bi-x-circle me-1"></i>
                Clear Filters
              </button>
            )}
          </div>

          {filteredAdvocates.length === 0 ? (

            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">

                <i className="bi bi-person-x display-4 text-muted"></i>

                <h4 className="fw-bold mt-3">
                  No Verified Advocates Found
                </h4>

                <p className="text-muted mb-0">
                  {verifiedAdvocates.length === 0
                    ? "No advocates have been verified by the administrator yet."
                    : "Try changing your search or specialization filter."}
                </p>

              </div>
            </div>

          ) : (

            <div className="row g-4">

              {filteredAdvocates.map((advocate) => (

                <div
                  className="col-md-6 col-xl-4"
                  key={advocate.id}
                >

                  <div className="card border-0 shadow-sm h-100">

                    <div className="card-body p-4">

                      <div className="d-flex justify-content-between align-items-start mb-3">

                        <div className="d-flex align-items-center">

                          <div
                            className="rounded-circle bg-dark text-warning d-flex align-items-center justify-content-center fw-bold me-3"
                            style={{
                              width: "55px",
                              height: "55px",
                              fontSize: "20px",
                            }}
                          >
                            {advocate.name
                              ?.charAt(0)
                              ?.toUpperCase() || "A"}
                          </div>

                          <div>
                            <h5 className="fw-bold mb-1">
                              {advocate.name}
                            </h5>

                            <div className="d-flex align-items-center gap-2">
                              <span className="badge bg-success-subtle text-success">
                                <i className="bi bi-patch-check-fill me-1"></i>
                                Verified
                              </span>
                              {(() => {
                                const { avgRating, count } = getAdvocateRating(advocate.id);
                                return (
                                  <span className="badge bg-danger text-white rounded-pill px-2">
                                    ★ {avgRating} ({count})
                                  </span>
                                );
                              })()}
                            </div>
                          </div>

                        </div>

                      </div>

                      <div className="mb-3">

                        <div className="mb-2">
                          <i className="bi bi-briefcase me-2 text-primary"></i>
                          <span className="text-muted">
                            Specialization:
                          </span>{" "}
                          <strong>
                            {advocate.specialization ||
                              "Not specified"}
                          </strong>
                        </div>

                        <div className="mb-2">
                          <i className="bi bi-award me-2 text-warning"></i>
                          <span className="text-muted">
                            Experience:
                          </span>{" "}
                          <strong>
                            {advocate.experience ?? 0} years
                          </strong>
                        </div>

                        {advocate.location && (
                          <div className="mb-2">
                            <i className="bi bi-geo-alt me-2 text-danger"></i>
                            <span className="text-muted">
                              Location:
                            </span>{" "}
                            <strong>
                              {advocate.location}
                            </strong>
                          </div>
                        )}

                        {advocate.fees !== undefined &&
                          advocate.fees !== null && (
                            <div className="mb-2">
                              <i className="bi bi-currency-rupee me-2 text-success"></i>
                              <span className="text-muted">
                                Consultation Fee:
                              </span>{" "}
                              <strong>
                                ₹{Number(advocate.fees).toLocaleString()}
                              </strong>
                            </div>
                          )}

                      </div>

                      {advocate.bio && (
                        <p className="text-muted small mb-4">
                          {advocate.bio.length > 120
                            ? `${advocate.bio.substring(0, 120)}...`
                            : advocate.bio}
                        </p>
                      )}

                      <div className="d-flex gap-2 mt-auto">

                        <Link
                          to={`/advocate/${advocate.id}`}
                          className="btn btn-outline-dark rounded-pill flex-grow-1"
                        >
                          View Profile
                        </Link>

                        <Link
                          to={`/book-appointment?advocateId=${encodeURIComponent(
                            advocate.id
                          )}`}
                          className="btn btn-dark rounded-pill flex-grow-1"
                        >
                          Book Appointment
                        </Link>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>
      </section>
    </div>
  );
}

export default Advocates;