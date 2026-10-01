import React from "react";
import LegalChatbot from "./LegalChatbot";

export default function AIChatbotModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.65)", zIndex: 1060 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 shadow-lg position-relative" style={{ borderRadius: "20px" }}>
          
          <button
            type="button"
            className="btn-close btn-close-white position-absolute top-0 end-0 m-3 z-3 bg-dark p-2 rounded-circle border"
            style={{ opacity: 0.9 }}
            onClick={onClose}
            aria-label="Close"
          ></button>

          <div className="modal-body p-0">
            <LegalChatbot compact={true} />
          </div>

        </div>
      </div>
    </div>
  );
}
