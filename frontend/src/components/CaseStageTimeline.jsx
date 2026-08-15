import React from "react";

export const CASE_STAGES = [
  "Filed",
  "Consultation",
  "Investigation",
  "Hearing",
  "Judgment",
  "Completed",
  "Closed",
];

export function CaseStageTimeline({ currentStage = "Consultation", onStageChange = null, isAdvocate = false }) {
  const normalizedStage = (currentStage || "Consultation").trim();
  const currentIndex = CASE_STAGES.findIndex(
    (s) => s.toLowerCase() === normalizedStage.toLowerCase()
  );
  const activeIdx = currentIndex >= 0 ? currentIndex : 1;

  return (
    <div className="py-3 px-1 my-2 bg-light rounded-4 border">
      <div className="d-flex justify-content-between align-items-center mb-2 px-2">
        <small className="fw-bold text-dark">
          <i className="bi bi-diagram-3-fill text-primary me-1"></i>
          Case Stage Timeline:
        </small>
        <span className="badge bg-danger text-white">
          Current: {CASE_STAGES[activeIdx]}
        </span>
      </div>

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

            return (
              <div
                key={stage}
                className="d-flex flex-column align-items-center"
                style={{ cursor: isAdvocate ? "pointer" : "default" }}
                onClick={() => isAdvocate && onStageChange && onStageChange(stage)}
                title={isAdvocate ? `Click to set stage to ${stage}` : stage}
              >
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center fw-bold transition-all ${
                    isActive
                      ? "bg-dark text-danger border border-3 border-danger shadow-lg"
                      : isPassed
                      ? "bg-success text-white"
                      : "bg-white text-muted border border-2"
                  }`}
                  style={{
                    width: isActive ? "32px" : "24px",
                    height: isActive ? "32px" : "24px",
                    fontSize: isActive ? "12px" : "10px",
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
    </div>
  );
}

export default CaseStageTimeline;
