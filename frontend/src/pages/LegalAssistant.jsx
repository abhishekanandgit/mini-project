import React, { useState } from "react";
import { Link } from "react-router-dom";
import LegalChatbot from "../components/LegalChatbot";
import { LEGAL_TOPICS } from "../data/legalKnowledge";

export default function LegalAssistant() {
  const [selectedTopic, setSelectedTopic] = useState(null);

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        
        {/* HEADER HERO */}
        <div className="bg-dark text-white rounded-4 p-4 p-md-5 mb-4 shadow-sm position-relative overflow-hidden">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3">
                <i className="bi bi-robot me-1"></i> AI-Powered Legal Literacy & Awareness
              </span>
              <h1 className="fw-bold text-white mb-2">
                LegalAssist AI Legal Assistant
              </h1>
              <p className="text-white-50 lead fs-6 mb-4">
                Understand basic legal concepts, constitutional rights, court procedures, and criminal laws (BNS, BNSS, BSA) in simple, everyday language.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <span className="badge bg-secondary-subtle text-light border me-2">
                  <i className="bi bi-check-circle me-1"></i> Indian Law Focused
                </span>
                <span className="badge bg-secondary-subtle text-light border me-2">
                  <i className="bi bi-shield-check me-1"></i> BNS & BNSS Provisions
                </span>
                <span className="badge bg-secondary-subtle text-light border">
                  <i className="bi bi-mortarboard me-1"></i> Educational Guidance
                </span>
              </div>
            </div>
            <div className="col-lg-4 text-center mt-4 mt-lg-0 d-none d-lg-block">
              <div className="bg-dark border border-secondary rounded-circle d-inline-flex align-items-center justify-content-center p-4 shadow">
                <i className="bi bi-robot display-1 text-warning"></i>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="row g-4">
          
          {/* SIDEBAR LEGAL TOPICS */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3 d-flex align-items-center">
                  <i className="bi bi-book-half text-warning me-2 fs-4"></i>
                  Legal Awareness Topics
                </h5>
                <p className="text-muted small mb-4">
                  Select a category to learn about common legal provisions under Indian statutes.
                </p>

                <div className="d-flex flex-column gap-2">
                  {LEGAL_TOPICS.map((topic) => (
                    <button
                      key={topic.id}
                      className={`btn text-start p-3 rounded-3 border d-flex align-items-start gap-3 transition-all ${
                        selectedTopic?.id === topic.id ? "btn-dark text-white border-dark" : "btn-white text-dark bg-white hover-light"
                      }`}
                      onClick={() => setSelectedTopic(topic)}
                    >
                      <i className={`bi ${topic.icon} fs-4 ${selectedTopic?.id === topic.id ? "text-warning" : "text-primary"}`}></i>
                      <div>
                        <strong className="d-block mb-1 fs-6">{topic.title}</strong>
                        <small className={selectedTopic?.id === topic.id ? "text-white-50" : "text-muted"}>
                          {topic.description}
                        </small>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* NEED ADVOCATE CALLOUT */}
            <div className="card border-0 shadow-sm rounded-4 bg-primary text-white p-4">
              <div className="card-body p-0">
                <h5 className="fw-bold mb-2">Need Official Case Advice?</h5>
                <p className="small text-white-50 mb-3">
                  AI provides general legal awareness. For specific case evaluation, legal notice drafting, or court filings, consult a verified advocate.
                </p>
                <Link to="/advocates" className="btn btn-warning text-dark rounded-pill fw-bold btn-sm w-100">
                  <i className="bi bi-person-badge me-1"></i> Find Verified Advocate
                </Link>
              </div>
            </div>
          </div>

          {/* CHATBOT MAIN CONTAINER */}
          <div className="col-lg-8">
            <LegalChatbot />
          </div>

        </div>

      </div>
    </div>
  );
}
