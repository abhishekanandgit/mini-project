import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

function SOSModal({ caseData, onClose }) {
  const { currentUser } = useAuth();

  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSendSOS = () => {
    if (!caseData?.advocateId) {
      alert("No advocate is assigned to this case.");
      return;
    }

    if (!message.trim()) {
      alert("Please enter a short emergency message.");
      return;
    }

    const existingAlerts =
      JSON.parse(localStorage.getItem("legalassist_sos_alerts")) || [];

    const sosAlert = {
      id: Date.now().toString(),

      userId: currentUser?.id,
      userName: currentUser?.name,
      userEmail: currentUser?.email,

      advocateId: caseData.advocateId,
      advocateName: caseData.advocateName,

      caseId: caseData.id,
      caseTitle: caseData.title,

      message: message.trim(),

      status: "unread",

      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "legalassist_sos_alerts",
      JSON.stringify([...existingAlerts, sosAlert])
    );

    setSent(true);
  };

  return (
    <div
      className="modal d-block"
      style={{
        backgroundColor: "rgba(0,0,0,0.65)",
        zIndex: 9999,
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4">

          {!sent ? (
            <>
              <div className="modal-header bg-danger text-white border-0">
                <div>
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Emergency SOS
                  </h5>

                  <small>
                    Send an urgent alert directly to your consulting advocate.
                  </small>
                </div>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={onClose}
                ></button>
              </div>

              <div className="modal-body p-4">

                <div className="alert alert-danger">
                  <strong>Important:</strong>

                  <p className="mb-0 mt-1 small">
                    This alert will be sent directly to the advocate handling
                    your case.
                  </p>
                </div>

                <div className="card bg-light border-0 mb-3">
                  <div className="card-body">

                    <div className="mb-2">
                      <small className="text-muted">
                        Active Case
                      </small>

                      <div className="fw-bold">
                        {caseData?.title || "Case"}
                      </div>
                    </div>

                    <div>
                      <small className="text-muted">
                        Consulting Advocate
                      </small>

                      <div className="fw-bold">
                        {caseData?.advocateName || "Assigned Advocate"}
                      </div>
                    </div>

                  </div>
                </div>

                <label className="form-label fw-semibold">
                  Emergency Message
                </label>

                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Describe your urgent situation..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>

                <small className="text-muted">
                  Your advocate will receive this message along with your
                  case details.
                </small>

              </div>

              <div className="modal-footer border-0 p-4">

                <button
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-danger rounded-pill px-4 fw-bold"
                  onClick={handleSendSOS}
                >
                  <i className="bi bi-bell-fill me-2"></i>
                  Send Emergency SOS
                </button>

              </div>
            </>
          ) : (
            <div className="text-center p-5">

              <div
                className="bg-success-subtle text-success rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center"
                style={{
                  width: "80px",
                  height: "80px",
                }}
              >
                <i className="bi bi-check-lg fs-1"></i>
              </div>

              <h3 className="fw-bold">
                SOS Sent Successfully
              </h3>

              <p className="text-muted">
                Your emergency alert has been sent directly to{" "}
                <strong>{caseData?.advocateName}</strong>.
              </p>

              <button
                className="btn btn-dark rounded-pill px-5"
                onClick={onClose}
              >
                Close
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default SOSModal;