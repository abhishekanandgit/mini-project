import React, { useState } from "react";

export const CASE_STAGES = [
  "Filed",
  "Consultation",
  "Investigation",
  "Hearing",
  "Judgment",
  "Completed",
  "Closed",
];

const STAGE_PRESETS = {
  Filed: "Case plaint officially filed in court. Registry allocation in progress.",
  Consultation: "Client legal strategy meeting completed. Relevant documents reviewed.",
  Investigation: "Evidence gathered, witness statements prepared, and investigation completed.",
  Hearing: "Arguments presented in court today. Next hearing date assigned.",
  Judgment: "Judgment & final verdict delivered by Hon'ble Court. Order copy recorded.",
  Completed: "Decree passed and legal relief successfully granted to client.",
  Closed: "Legal proceedings concluded and case file officially archived.",
};

const STAGE_DESCRIPTIONS = {
  Filed: "Initial stage where formal legal petition / complaint is lodged with court registry.",
  Consultation: "In-depth case discussion, legal advisory, and evidence collection phase.",
  Investigation: "Verification of facts, police/private investigation, document audit, and discovery.",
  Hearing: "Court proceedings, witness examinations, cross-examinations, and oral arguments.",
  Judgment: "Pronouncement of judicial verdict, court decree, and ruling on legal remedies.",
  Completed: "Execution of judgment order, compliance verification, and post-trial settlements.",
  Closed: "Final disposition of case, return of records, and administrative closure.",
};

export function CaseStageTimeline({
  currentStage = "Consultation",
  stageNotes = {},
  onStageChange = null,
  onSaveStageNote = null,
  isAdvocate = false,
  caseTitle = "",
}) {
  const normalizedStage = (currentStage || "Consultation").trim();
  const currentIndex = CASE_STAGES.findIndex(
    (s) => s.toLowerCase() === normalizedStage.toLowerCase()
  );
  const activeIdx = currentIndex >= 0 ? currentIndex : 1;

  const [selectedStage, setSelectedStage] = useState(null);
  const [noteInput, setNoteInput] = useState("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  const handleStageClick = (stage) => {
    setSelectedStage(stage);
    const existing = stageNotes?.[stage]?.note || "";
    setNoteInput(existing || STAGE_PRESETS[stage] || "");
    setSaveSuccessMsg("");
  };

  const closeModal = () => {
    setSelectedStage(null);
    setNoteInput("");
    setSaveSuccessMsg("");
  };

  const handleSave = (setAsCurrent = false) => {
    if (!selectedStage) return;

    if (onSaveStageNote) {
      onSaveStageNote(selectedStage, noteInput, setAsCurrent);
    } else if (onStageChange && setAsCurrent) {
      onStageChange(selectedStage);
    }

    setSaveSuccessMsg(`Note for stage "${selectedStage}" saved successfully!`);
    setTimeout(() => {
      setSaveSuccessMsg("");
    }, 2500);
  };

  return (
    <div className="py-3 px-2 my-3 bg-light rounded-4 border shadow-sm">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-2 px-2">
        <div>
          <small className="fw-bold text-dark">
            <i className="bi bi-diagram-3-fill text-primary me-1"></i>
            Case Stage Timeline:
          </small>
          <small className="text-muted ms-2 d-none d-sm-inline" style={{ fontSize: "11px" }}>
            (Click any stage icon to view updates)
          </small>
        </div>
        <span className="badge bg-danger text-white px-2 py-1">
          Current: {CASE_STAGES[activeIdx]}
        </span>
      </div>

      {/* Timeline Bar */}
      <div className="position-relative px-3 py-2">
        {/* Background Connecting Line */}
        <div
          className="position-absolute top-50 start-0 w-100 bg-secondary-subtle"
          style={{ height: "4px", zIndex: 1, transform: "translateY(-50%)" }}
        ></div>

        {/* Active Progress Line */}
        <div
          className="position-absolute top-50 start-0 bg-success"
          style={{
            height: "4px",
            width: `${(activeIdx / (CASE_STAGES.length - 1)) * 100}%`,
            zIndex: 2,
            transform: "translateY(-50%)",
            transition: "width 0.4s ease",
          }}
        ></div>

        {/* Timeline Nodes */}
        <div className="d-flex justify-content-between align-items-center position-relative" style={{ zIndex: 3 }}>
          {CASE_STAGES.map((stage, index) => {
            const isPassed = index < activeIdx;
            const isActive = index === activeIdx;
            const hasNote = Boolean(stageNotes?.[stage]?.note?.trim());

            return (
              <div
                key={stage}
                className="d-flex flex-column align-items-center position-relative"
                style={{ cursor: "pointer" }}
                onClick={() => handleStageClick(stage)}
                title={`Click to view/update notes for "${stage}"`}
              >
                {/* Note Indicator Badge */}
                {hasNote && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle p-1 bg-warning border border-light rounded-circle"
                    style={{ zIndex: 4, width: "10px", height: "10px" }}
                    title="Notes added for this stage"
                  ></span>
                )}

                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center fw-bold transition-all ${
                    isActive
                      ? "bg-dark text-danger border border-3 border-danger shadow-lg"
                      : isPassed
                      ? "bg-success text-white"
                      : "bg-white text-muted border border-2"
                  }`}
                  style={{
                    width: isActive ? "34px" : "26px",
                    height: isActive ? "34px" : "26px",
                    fontSize: isActive ? "13px" : "11px",
                    boxShadow: isActive ? "0 0 0 4px rgba(220, 53, 69, 0.35)" : "none",
                  }}
                >
                  {isPassed ? <i className="bi bi-check-lg"></i> : index + 1}
                </div>
                <span
                  className={`mt-2 ${
                    isActive
                      ? "fw-bold text-dark"
                      : isPassed
                      ? "fw-semibold text-success"
                      : "text-muted opacity-75"
                  }`}
                  style={{ fontSize: "10px", whiteSpace: "nowrap" }}
                >
                  {stage}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STAGE DETAILS & NOTES MODAL */}
      {selectedStage && (
        <div
          className="modal show d-block fade"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.55)", zIndex: 1055 }}
          onClick={closeModal}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
              {/* Modal Header */}
              <div className="modal-header bg-dark text-white p-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: "32px", height: "32px" }}>
                    {CASE_STAGES.indexOf(selectedStage) + 1}
                  </div>
                  <div>
                    <h5 className="modal-title fw-bold mb-0">
                      Stage Update: {selectedStage}
                    </h5>
                    {caseTitle && (
                      <small className="text-white-50">{caseTitle}</small>
                    )}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span
                    className={`badge ${
                      selectedStage === CASE_STAGES[activeIdx]
                        ? "bg-danger"
                        : CASE_STAGES.indexOf(selectedStage) < activeIdx
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    {selectedStage === CASE_STAGES[activeIdx]
                      ? "Current Active Stage"
                      : CASE_STAGES.indexOf(selectedStage) < activeIdx
                      ? "Completed Stage"
                      : "Upcoming Stage"}
                  </span>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={closeModal}
                  ></button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-4">
                {saveSuccessMsg && (
                  <div className="alert alert-success rounded-3 mb-3 shadow-sm py-2">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {saveSuccessMsg}
                  </div>
                )}

                {/* Stage Info Box */}
                <div className="bg-light p-3 rounded-3 border mb-4">
                  <div className="d-flex align-items-center gap-2 text-primary fw-semibold mb-1">
                    <i className="bi bi-info-circle-fill"></i>
                    <span>What happens during {selectedStage}?</span>
                  </div>
                  <p className="text-muted small mb-0">
                    {STAGE_DESCRIPTIONS[selectedStage] || "Legal stage step in proceeding."}
                  </p>
                </div>

                {/* ADVOCATE WRITING SECTION */}
                {isAdvocate ? (
                  <div className="border-top pt-3">
                    <label className="form-label fw-bold text-dark d-flex justify-content-between align-items-center">
                      <span>
                        <i className="bi bi-pencil-square text-danger me-1"></i>
                        Advocate Notes / Result Update for "{selectedStage}":
                      </span>
                      <small className="text-muted font-monospace" style={{ fontSize: "11px" }}>
                        Visible to Client
                      </small>
                    </label>

                    {/* Quick Preset Buttons */}
                    <div className="mb-2">
                      <small className="text-muted d-block mb-1">Quick Presets:</small>
                      <div className="d-flex flex-wrap gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary rounded-pill py-0 px-2"
                          style={{ fontSize: "11px" }}
                          onClick={() => setNoteInput(STAGE_PRESETS[selectedStage] || "")}
                        >
                          📋 Default Template
                        </button>
                        {selectedStage === "Judgment" && (
                          <>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-success rounded-pill py-0 px-2"
                              style={{ fontSize: "11px" }}
                              onClick={() => setNoteInput("Judgment pronounced! Favorable verdict delivered in client's favor with full compensation.")}
                            >
                              ⚖️ Verdict Favorable
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary rounded-pill py-0 px-2"
                              style={{ fontSize: "11px" }}
                              onClick={() => setNoteInput("Judgment reserved by High Court. Official order copy awaited next week.")}
                            >
                              📜 Order Reserved
                            </button>
                          </>
                        )}
                        {selectedStage === "Hearing" && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary rounded-pill py-0 px-2"
                            style={{ fontSize: "11px" }}
                            onClick={() => setNoteInput("Hearing concluded before judge today. Final oral arguments completed.")}
                          >
                            🏛️ Hearing Concluded
                          </button>
                        )}
                      </div>
                    </div>

                    <textarea
                      className="form-control rounded-3 mb-3"
                      rows="4"
                      placeholder={`Write a short note for client regarding what happened or result in "${selectedStage}" stage...`}
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                    ></textarea>

                    <div className="d-flex flex-wrap gap-2 justify-content-end">
                      <button
                        type="button"
                        className="btn btn-dark rounded-pill px-4 fw-bold"
                        onClick={() => handleSave(false)}
                      >
                        <i className="bi bi-save me-1"></i>
                        Save Note for {selectedStage}
                      </button>

                      {selectedStage !== CASE_STAGES[activeIdx] && (
                        <button
                          type="button"
                          className="btn btn-danger rounded-pill px-4 fw-bold"
                          onClick={() => handleSave(true)}
                        >
                          <i className="bi bi-arrow-repeat me-1"></i>
                          Save & Set Current Stage
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* CLIENT / USER VIEW SECTION */
                  <div className="border-top pt-3">
                    <h6 className="fw-bold text-dark mb-3">
                      <i className="bi bi-card-text text-primary me-2"></i>
                      Advocate's Update & Notes for {selectedStage}:
                    </h6>

                    {stageNotes?.[selectedStage]?.note ? (
                      <div className="bg-primary-subtle border border-primary-subtle rounded-3 p-4">
                        <p className="fw-semibold text-dark mb-3" style={{ fontSize: "15px", lineHeight: "1.6" }}>
                          "{stageNotes[selectedStage].note}"
                        </p>
                        <div className="d-flex justify-content-between align-items-center pt-2 border-top border-primary-subtle opacity-75 small">
                          <span>
                            <i className="bi bi-person-fill text-primary me-1"></i>
                            Updated by: <strong>{stageNotes[selectedStage].author || "Assigned Advocate"}</strong>
                          </span>
                          <span>
                            <i className="bi bi-clock me-1"></i>
                            {new Date(stageNotes[selectedStage].updatedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-light rounded-3 p-4 text-center border">
                        <i className="bi bi-chat-square-dots text-muted display-6 d-block mb-2"></i>
                        <p className="fw-semibold text-dark mb-1">
                          No notes written for "{selectedStage}" stage yet.
                        </p>
                        <p className="text-muted small mb-0">
                          Your advocate will add updates or judgment details here once this stage progresses.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="modal-footer bg-light p-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={closeModal}
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CaseStageTimeline;
