import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { queryLegalAI } from "../services/legalAI";
import { SUGGESTED_QUESTIONS, GENERAL_SAFETY_DISCLAIMER } from "../data/legalKnowledge";

export default function LegalChatbot({ compact = false }) {
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      sender: "ai",
      text: "Hello! I’m the LegalAssist AI Legal Awareness Assistant. I can help you understand basic Indian laws and legal procedures in simple language. What would you like to know?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (customQuery = null) => {
    const textToSend = (customQuery || inputQuery).trim();
    if (!textToSend) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customQuery) setInputQuery("");
    setIsTyping(true);

    try {
      const response = await queryLegalAI(textToSend);
      
      const aiMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: response.formattedText,
        rawObj: response.rawObj,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "ai",
          text: "I am currently unable to process your request. Please try selecting one of the suggested legal terms or consult a verified advocate.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome-1",
        sender: "ai",
        text: "Hello! I’m the LegalAssist AI Legal Awareness Assistant. I can help you understand basic Indian laws and legal procedures in simple language. What would you like to know?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  };

  return (
    <div className={`card border-0 shadow-sm rounded-4 overflow-hidden ${compact ? "" : "h-100"}`}>
      
      {/* CHAT HEADER */}
      <div className="card-header bg-dark text-white p-3 p-md-4 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <div
            className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center shadow-sm"
            style={{ width: "45px", height: "45px", fontSize: "1.4rem" }}
          >
            <i className="bi bi-robot"></i>
          </div>
          <div>
            <h5 className="fw-bold mb-0 text-white d-flex align-items-center gap-2">
              LegalAssist AI Legal Assistant
              <span className="badge bg-success-subtle text-success fs-7 rounded-pill border border-success-subtle px-2 py-1">
                ● Live AI Awareness
              </span>
            </h5>
            <small className="text-white-50">Indian Law (BNS, BNSS, BSA) & Legal Guidance</small>
          </div>
        </div>

        <button
          className="btn btn-outline-light btn-sm rounded-pill"
          onClick={handleClearChat}
          title="Clear conversation history"
        >
          <i className="bi bi-eraser me-1"></i> Clear Chat
        </button>
      </div>

      {/* CHAT BODY */}
      <div className="card-body p-3 p-md-4 bg-light" style={{ minHeight: compact ? "380px" : "480px", maxHeight: "600px", overflowY: "auto" }}>
        
        {/* SUGGESTED QUESTIONS */}
        <div className="mb-4">
          <small className="text-muted fw-bold d-block mb-2 text-uppercase fs-7">
            <i className="bi bi-lightbulb text-warning me-1"></i> Suggested Legal Questions:
          </small>
          <div className="d-flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.slice(0, 6).map((q, idx) => (
              <button
                key={idx}
                type="button"
                className="btn btn-white btn-sm border rounded-pill shadow-xs text-dark hover-shadow"
                style={{ fontSize: "0.85rem", backgroundColor: "#fff" }}
                onClick={() => handleSend(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* MESSAGES LIST */}
        <div className="d-flex flex-column gap-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`d-flex ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"}`}
            >
              <div
                className={`p-3 rounded-4 shadow-xs ${
                  msg.sender === "user"
                    ? "bg-dark text-white rounded-bottom-end-0"
                    : "bg-white text-dark border rounded-bottom-start-0"
                }`}
                style={{ maxWidth: "85%", minWidth: "260px" }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2 pb-1 border-bottom border-secondary-subtle">
                  <small className={`fw-bold ${msg.sender === "user" ? "text-warning" : "text-primary"}`}>
                    {msg.sender === "user" ? "👤 You" : "🤖 LegalAssist AI Assistant"}
                  </small>
                  <small className="text-muted fs-7">{msg.timestamp}</small>
                </div>

                <div className="chat-message-content" style={{ whiteSpace: "pre-line", fontSize: "0.93rem" }}>
                  {msg.text}
                </div>

                {msg.sender === "ai" && (
                  <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center">
                    <small className="text-muted fs-7">
                      <i className="bi bi-shield-check text-success me-1"></i> General Legal Awareness
                    </small>
                    <Link
                      to="/advocates"
                      className="btn btn-link btn-sm text-decoration-none p-0 fw-bold fs-7 text-primary"
                    >
                      Find Advocate <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* TYPING INDICATOR */}
          {isTyping && (
            <div className="d-flex justify-content-start">
              <div className="bg-white border text-muted p-3 rounded-4 rounded-bottom-start-0 shadow-xs">
                <div className="d-flex align-items-center gap-2">
                  <div className="spinner-border spinner-border-sm text-warning" role="status"></div>
                  <small className="fw-semibold">AI is analyzing Indian legal provisions (BNS/BNSS/BSA)...</small>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* CHAT FOOTER & INPUT */}
      <div className="card-footer bg-white p-3 border-top">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <div className="input-group">
            <input
              type="text"
              className="form-control form-control-lg fs-6 rounded-start-pill border-end-0 ps-3"
              placeholder="Ask a question (e.g. What is an FIR? What are my rights during arrest?)"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isTyping}
            />
            <button
              type="submit"
              className="btn btn-dark px-4 rounded-end-pill fw-bold"
              disabled={isTyping || !inputQuery.trim()}
            >
              <i className="bi bi-send-fill me-1"></i> Send
            </button>
          </div>
        </form>

        {/* MANDATORY LEGAL DISCLAIMER */}
        <div className="mt-2 text-center">
          <small className="text-muted" style={{ fontSize: "0.75rem", lineHeight: "1.2" }}>
            <i className="bi bi-info-circle me-1"></i>
            {GENERAL_SAFETY_DISCLAIMER}
          </small>
        </div>
      </div>

    </div>
  );
}
