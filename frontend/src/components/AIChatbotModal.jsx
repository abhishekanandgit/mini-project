import { useState, useEffect, useRef } from "react";
import { useData } from "../context/DataContext";
import { useNavigate } from "react-router-dom";

export default function AIChatbotModal({ isOpen, onClose }) {
  const { LEGAL_TERMS, advocates } = useData();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am your AI Legal Assistant. I can help explain Indian legal terms (FIR, Bail, Affidavit, Writ), explain your basic legal rights, and guide you on consultation procedures. How may I assist you today?"
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg = { sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery("");
    setIsTyping(true);

    setTimeout(() => {
      let aiReply = getAIResponse(textToSend, LEGAL_TERMS, advocates);
      setMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
      setIsTyping(false);
    }, 600);
  };

  const getAIResponse = (query, terms, advs) => {
    const q = query.toLowerCase();

    for (let termObj of terms) {
      if (q.includes(termObj.term.toLowerCase().split(" ")[0]) || q.includes(termObj.term.toLowerCase())) {
        return `📖 **Legal Definition: ${termObj.term}**\n\n${termObj.definition}\n\n💡 **Key Context:** ${termObj.details}\n\nWould you like to consult a verified advocate for further advice on this matter?`;
      }
    }

    if (q.includes("bail") || q.includes("arrest")) {
      return "🚨 **Bail & Arrest Legal Guidance:** Under Criminal Procedure Code / BNSS, every arrested person has the right to know the grounds of arrest, the right to consult a lawyer, and the right to inform a family member. For non-bailable offences, anticipatory bail can be filed in Sessions Court or High Court. Use our Emergency SOS button if you or someone you know faces immediate detention!";
    }

    if (q.includes("fir") || q.includes("police")) {
      return "⚖️ **Filing an FIR:** A First Information Report (FIR) must be registered by police for cognizable offences. If police refuse to register an FIR, you can approach the Superintendent of Police (SP) or file a private complaint before the Judicial Magistrate under Section 156(3) CrPC / Section 175 BNSS.";
    }

    if (q.includes("fee") || q.includes("cost") || q.includes("price")) {
      return "💳 **Consultation Fees:** Advocates on LegalAssist set transparent consultation fees ranging from ₹1,500 to ₹3,500 per session based on experience and specialization. You can filter advocates by fee range on the Advocates page!";
    }

    if (q.includes("book") || q.includes("consult") || q.includes("advocate")) {
      return "📅 **Booking an Appointment:** You can browse verified advocates by specialization (Criminal, Corporate, Family, Cyber Law), select a convenient date and time slot, and upload initial case documents securely. Click below to view top advocates.";
    }

    if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
      return "Greetings! Feel free to ask me any legal questions or select a common legal term from the quick buttons below.";
    }

    return `Thank you for your question. While I am an AI trained on common Indian legal procedures, complex legal issues require professional evaluation. I recommend booking a consultation with one of our ${advs.length} verified advocates on LegalAssist for tailored legal representation.`;
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", zIndex: 1060 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "16px" }}>
          
          <div className="modal-header bg-dark text-white rounded-top-4 py-3">
            <div className="d-flex align-items-center">
              <div
                className="bg-warning text-dark rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                style={{ width: "42px", height: "42px" }}
              >
                <i className="bi bi-robot fs-4"></i>
              </div>
              <div>
                <h5 className="modal-title mb-0 fw-bold d-flex align-items-center">
                  LegalAssist AI Legal Support
                  <span className="badge bg-success ms-2 fs-6">Live AI</span>
                </h5>
                <small className="text-white-50">Instant legal term explanations & basic guidance</small>
              </div>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body p-4">
            
            <div className="mb-3">
              <small className="text-muted fw-bold d-block mb-2">QUICK LEGAL TERM GLOSSARY:</small>
              <div className="d-flex flex-wrap gap-2">
                {LEGAL_TERMS.map((t, idx) => (
                  <button
                    key={idx}
                    className="btn btn-outline-secondary btn-sm rounded-pill"
                    onClick={() => handleSend(`Explain ${t.term}`)}
                  >
                    <i className="bi bi-book me-1"></i> {t.term.split("(")[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="chat-window mb-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={m.sender === "ai" ? "chat-bubble-ai" : "chat-bubble-user"}
                >
                  <div className="d-flex align-items-center mb-1">
                    <strong className="me-2 fs-7">
                      {m.sender === "ai" ? "🤖 Legal AI Assistant" : "👤 You"}
                    </strong>
                  </div>
                  <div style={{ whiteSpace: "pre-line", fontSize: "0.95rem" }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="chat-bubble-ai text-muted fst-italic">
                  <i className="bi bi-three-dots me-2"></i>AI is searching legal database...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="alert alert-light border d-flex justify-content-between align-items-center py-2 px-3 mb-3">
              <small className="text-muted">
                <i className="bi bi-shield-check text-primary me-1"></i> Need official court representation?
              </small>
              <button
                className="btn btn-gold btn-sm rounded-pill px-3"
                onClick={() => {
                  onClose();
                  navigate("/advocates");
                }}
              >
                Find & Book Advocate <i className="bi bi-arrow-right ms-1"></i>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-lg fs-6"
                  placeholder="Ask any legal question e.g. What is Bail? How to file an FIR?"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                />
                <button className="btn btn-dark px-4" type="submit">
                  <i className="bi bi-send-fill me-1"></i> Ask AI
                </button>
              </div>
            </form>

          </div>

        </div>
      </div>
    </div>
  );
}
