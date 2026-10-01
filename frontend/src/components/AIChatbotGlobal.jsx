import React, { useState, useEffect } from "react";
import AIChatbotModal from "./AIChatbotModal";

export default function AIChatbotGlobal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-ai-chatbot", handleOpen);
    return () => window.removeEventListener("open-ai-chatbot", handleOpen);
  }, []);

  return (
    <AIChatbotModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
  );
}
