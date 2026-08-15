import React, { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import CaseStageTimeline from "../components/CaseStageTimeline";

function CaseStatus() {
  const { currentUser } = useAuth();
  const { cases, uploadCaseDocument, triggerEmergencySOS } = useData();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const selectedCaseIdFromURL = queryParams.get("id");

  const userCases = useMemo(() => {
    if (!currentUser) return [];
    return cases.filter(
      (c) =>
        String(c.clientId) === String(currentUser.id) ||
        c.clientEmail === currentUser.email
    );
  }, [cases, currentUser]);

  const [selectedCaseId, setSelectedCaseId] = useState(
    selectedCaseIdFromURL || (userCases[0]?.id || "")
  );

  const activeCase = useMemo(() => {
    return userCases.find((c) => String(c.id) === String(selectedCaseId)) || userCases[0];
  }, [userCases, selectedCaseId]);

  const [message, setMessage] = useState("");

  const handleFileUpload = (caseId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const documentData = {
      id: `document-${Date.now()}`,
      name: file.name,
      type: file.type || "Document",
      size: `${(file.size / 1024).toFixed(1)} KB`,
      uploadedBy: currentUser?.name || "Client",
      uploadedRole: "client",
      uploadedAt: new Date().toISOString(),
    };

    uploadCaseDocument(caseId, documentData);
    setMessage(`Successfully shared file "${file.name}" with your advocate.`);
    setTimeout(() => setMessage(""), 3500);
  };

  const handleSOS = (caseItem) => {
    if (!caseItem) return;
    triggerEmergencySOS({
      caseId: caseItem.id,
      advocateId: caseItem.advocateId,
      advocateName: caseItem.advocateName,
      userId: currentUser?.id,
      userName: currentUser?.name,
      userPhone: currentUser?.phone,
      message: `EMERGENCY ALERT: Client ${currentUser?.name} triggered an SOS alert for Case #${caseItem.id}!`,
    });

    setMessage("🚨 Emergency SOS Alert sent to your advocate and legal helpline!");
    setTimeout(() => setMessage(""), 4500);
  };

  const STAGES = [
    "Consultation",
    "Filing",
    "Hearing",
    "Evidence",
    "Arguments",
    "Verdict",
    "Closed",
  ];

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            <i className="bi bi-folder-check me-2 text-primary"></i>
            Case Status & Document Portal
          </h2>
          <p className="text-muted mb-0">
            Track your real-time case progress and share legal files with your advocate.
          </p>
        </div>

        <Link to="/user-dashboard" className="btn btn-outline-dark rounded-pill">
          <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
        </Link>
      </div>

      {message && (
        <div className="alert alert-success rounded-3 shadow-sm mb-4">
          {message}
        </div>
      )}

      {userCases.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 text-center py-5">
          <div className="card-body">
            <i className="bi bi-folder-x display-3 text-muted"></i>
            <h4 className="fw-bold mt-3">No Active Cases Found</h4>
            <p className="text-muted mb-4">
              Your legal cases will appear here once an advocate creates a case from your appointment.
            </p>
            <Link to="/advocates" className="btn btn-dark rounded-pill">
              Book Advocate Consultation
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {/* CASE SELECTOR SIDEBAR */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-header bg-white p-3 fw-bold border-bottom">
                <i className="bi bi-list-ul me-2"></i>
                My Legal Cases ({userCases.length})
              </div>
              <div className="list-group list-group-flush rounded-bottom-4">
                {userCases.map((c) => {
                  const isSelected = String(c.id) === String(activeCase?.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={`list-group-item list-group-item-action p-3 text-start ${
                        isSelected ? "active bg-dark text-white border-dark" : ""
                      }`}
                      onClick={() => setSelectedCaseId(c.id)}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <strong style={{ fontSize: "14px" }}>{c.title || "Legal Case"}</strong>
                        <span className={`badge ${isSelected ? "bg-warning text-dark" : "bg-primary-subtle text-primary"}`}>
                          {c.stage || "Active"}
                        </span>
                      </div>
                      <small className={isSelected ? "text-light opacity-75" : "text-muted"}>
                        Advocate: {c.advocateName || "Assigned Advocate"}
                      </small>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CASE DETAILS & DOCUMENT UPLOADER */}
          <div className="col-lg-8">
            {activeCase && (
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4 p-md-5">
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                      <span className="badge bg-secondary mb-2">Case ID: #{activeCase.id}</span>
                      <h3 className="fw-bold text-dark mb-1">{activeCase.title || "Legal Case"}</h3>
                      <p className="text-muted mb-0">
                        <i className="bi bi-building me-1"></i> Court: <strong>{activeCase.court || "District Court"}</strong>
                      </p>
                    </div>
                    <button
                      className="btn btn-danger rounded-pill fw-bold shadow-sm"
                      onClick={() => handleSOS(activeCase)}
                    >
                      <i className="bi bi-bell-fill me-1"></i> Emergency SOS
                    </button>
                  </div>

                  {/* REAL-TIME HORIZONTAL CASE STAGE TIMELINE */}
                  <CaseStageTimeline currentStage={activeCase.stage || "Consultation"} />

                  {/* DOCUMENT SHARING SECTION */}
                  <div className="border-top pt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="fw-bold mb-0">
                        <i className="bi bi-file-earmark-arrow-up me-2 text-success"></i>
                        Share Legal Files with Advocate
                      </h5>
                    </div>

                    <div className="bg-light p-3 rounded-4 border mb-4">
                      <label className="form-label small fw-bold text-dark mb-1">
                        Select a file to upload & send directly to {activeCase.advocateName || "your advocate"}:
                      </label>
                      <input
                        type="file"
                        className="form-control rounded-3"
                        onChange={(e) => handleFileUpload(activeCase.id, e)}
                      />
                      <small className="text-muted mt-1 d-block">
                        Supported files: PDF, DOCX, Images, Proof/Evidence documents.
                      </small>
                    </div>

                    <h6 className="fw-bold mb-3">Shared Case Documents ({activeCase.documents?.length || 0})</h6>
                    {!activeCase.documents || activeCase.documents.length === 0 ? (
                      <div className="text-center py-4 bg-light rounded-3 text-muted small">
                        <i className="bi bi-file-earmark-x fs-4 d-block mb-1"></i>
                        No files shared yet. Use the upload box above to share documents with your advocate.
                      </div>
                    ) : (
                      <div className="row g-2">
                        {activeCase.documents.map((doc) => (
                          <div className="col-md-6" key={doc.id || doc.name}>
                            <div className="p-3 border rounded-3 bg-white d-flex align-items-center justify-content-between">
                              <div className="d-flex align-items-center gap-2 overflow-hidden">
                                <i className="bi bi-file-earmark-pdf fs-4 text-danger"></i>
                                <div className="text-truncate">
                                  <strong className="d-block text-truncate small">{doc.name}</strong>
                                  <small className="text-muted" style={{ fontSize: "11px" }}>
                                    {doc.uploadedRole === "client" ? "Uploaded by You" : "Uploaded by Advocate"} • {doc.size || "File"}
                                  </small>
                                </div>
                              </div>
                              <span className="badge bg-light text-dark border">Shared</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CaseStatus;
