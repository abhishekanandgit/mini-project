/**
 * LegalAssist AI Legal Service
 * Service layer providing structured response generation, safety rule filters,
 * and backend AI API integration with local knowledge fallback.
 */

import { KNOWLEDGE_BASE, SUGGESTED_QUESTIONS, GENERAL_SAFETY_DISCLAIMER } from "../data/legalKnowledge";

/**
 * Normalizes text for keyword matching with simple typo tolerance
 */
const normalizeQuery = (query) => {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .trim();
};

/**
 * Safety Rules & Specific Query Filters (Enforcing Rules 1-12)
 */
const checkSafetyRules = (rawQuery) => {
  const q = rawQuery.toLowerCase();

  // Rule 4: Outcome Prediction ("Can I win my case?")
  if (
    q.includes("win my case") ||
    q.includes("will i win") ||
    q.includes("guarantee win") ||
    q.includes("chance of winning") ||
    q.includes("predict outcome")
  ) {
    return {
      isIntercepted: true,
      title: "Legal Case Outcome Guidance",
      simpleExplanation: "The outcome of a legal case depends on specific factual circumstances, documentary evidence, witness testimonies, applicable statutes (BNS/BNSS/BSA), and the court's assessment. An AI system cannot predict court judgments or guarantee case results.",
      keyPoints: [
        "No Guaranteed Outcomes: No legal assistant or lawyer can ethically guarantee a 100% court victory.",
        "Role of Evidence: Judges evaluate cases strictly based on admissible evidence presented under the Bharatiya Sakshya Adhiniyam (BSA), 2023.",
        "Precedents & Facts: Similar legal precedents help guide court arguments, but every case has unique facts.",
        "Advocate Evaluation: A licensed advocate must inspect your case papers, cross-examination points, and police charge sheets to assess strengths and risks."
      ],
      example: "In property or contractual disputes, winning depends on clear title deeds, registered agreements, and timely filing within the limitation period.",
      whatYouCanDo: [
        "Gather all original documents, receipts, notices, and correspondence.",
        "Consult a verified advocate on LegalAssist to evaluate your case merit.",
        "Avoid relying on outcome predictions from unofficial sources."
      ],
      important: "Consult a qualified advocate to review your case documents and develop a sound legal strategy."
    };
  }

  // Rule 11: Emergency / Immediate Danger Advisory
  if (
    q.includes("emergency") ||
    q.includes("someone attacking") ||
    q.includes("immediate help") ||
    q.includes("life threat") ||
    q.includes("being assaulted") ||
    q.includes("suicide")
  ) {
    return {
      isIntercepted: true,
      title: "🚨 Emergency Immediate Assistance Advisory",
      simpleExplanation: "If you or someone you know is in immediate physical danger, experiencing violent threats, or requiring urgent medical or police help, please contact official emergency authorities immediately.",
      keyPoints: [
        "National Emergency Helpline: Dial 112 (All-in-one emergency in India).",
        "Police Assistance: Dial 100 or visit the nearest police station.",
        "Women Emergency Helpline: Dial 181 / Cyber Fraud Helpline: Dial 1930.",
        "LegalAssist Emergency SOS: Use our platform's 'Emergency SOS' feature to alert your advocate or emergency contact instantly."
      ],
      example: "In any situation involving physical assault, stalking, or domestic violence emergency, contacting 112 or local police is the primary emergency step.",
      whatYouCanDo: [
        "Call 112 or 100 immediately.",
        "Move to a safe public location or police station.",
        "Activate the Emergency SOS button inside your LegalAssist User Dashboard."
      ],
      important: "Do not wait for online text responses in physical emergency situations. Call emergency services right away."
    };
  }

  // Exact Section Guessing Filter
  if (
    (q.includes("exact section") || q.includes("which section applies") || q.includes("section number")) &&
    !q.includes("fir") && !q.includes("bail")
  ) {
    return {
      isIntercepted: true,
      title: "Statutory Section Identification",
      simpleExplanation: "Determining the exact legal section (under Bharatiya Nyaya Sanhita - BNS or specialized Acts) requires precise facts, date of occurrence (whether before or after July 1, 2024), and specific elements of the alleged offence.",
      keyPoints: [
        "BNS vs IPC Transition: Offences committed on or after July 1, 2024 fall under BNS, 2023; prior offences follow IPC, 1860.",
        "Elements of Crime: Sections depend on specific criminal intent (mens rea) and overt action (actus reus).",
        "Charge Sheet Role: Police or legal counsel finalize exact section numbers during FIR registration or court charge framing."
      ],
      example: "Theft is covered under BNS Section 303, while Cheating is covered under BNS Section 318. The exact subsection depends on the monetary value and circumstances.",
      whatYouCanDo: [
        "Provide your lawyer with detailed facts: date, location, loss, and evidence.",
        "Consult a verified advocate on LegalAssist to correctly identify statutory sections for your complaint or defence."
      ],
      important: "Avoid filing legal documents with assumed section numbers without legal verification."
    };
  }

  return { isIntercepted: false };
};

/**
 * Searches local knowledge base for matching legal concepts
 */
const findLocalKnowledge = (query) => {
  const norm = normalizeQuery(query);
  const words = norm.split(" ").filter((w) => w.length > 2);

  let bestMatch = null;
  let highestScore = 0;

  for (let item of KNOWLEDGE_BASE) {
    let score = 0;

    for (let kw of item.keywords) {
      const kwNorm = normalizeQuery(kw);

      if (norm.includes(kwNorm)) {
        score += 10;
      }

      for (let word of words) {
        if (kwNorm.includes(word)) {
          score += 3;
        }
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && highestScore >= 3) {
    return bestMatch;
  }

  return null;
};

/**
 * Creates default fallback response formatted in the mandatory 5 sections
 */
const createGenericResponse = (query) => {
  return {
    title: `General Legal Awareness Guidance: "${query.substring(0, 30)}${query.length > 30 ? "..." : ""}"`,
    simpleExplanation: `LegalAssist AI provides general information on Indian legal principles, civil and criminal procedures, rights during police interactions, and dispute resolution frameworks under current Indian laws (BNS, BNSS, BSA).`,
    keyPoints: [
      "Indian Criminal Law: Governed primarily by Bharatiya Nyaya Sanhita (BNS), 2023 and Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023.",
      "Civil & Consumer Disputes: Governed by the Code of Civil Procedure (CPC), Indian Contract Act, and Consumer Protection Act, 2019.",
      "Evidence & Documentation: Electronic records, transaction IDs, screenshots, and written notices serve as crucial evidence under Bharatiya Sakshya Adhiniyam (BSA), 2023.",
      "Right to Counsel: Every citizen has the right to legal representation under Article 22 of the Constitution of India."
    ],
    example: "For instance, whether dealing with a property disagreement, employment contract, online financial fraud, or police notice, following formal legal procedure and preserving documentary evidence is essential.",
    whatYouCanDo: [
      "Write down a clear timeline of events and list available evidence (bills, screenshots, notices).",
      "Try asking specific questions like 'What is an FIR?', 'What is Bail?', or 'What is a Legal Notice?'.",
      "Connect with a verified advocate on LegalAssist for case-specific legal representation."
    ],
    important: "This general response is for legal awareness only. Consult a licensed advocate for advice on your specific matter."
  };
};

/**
 * Primary Service Function: Sends query to backend AI API or falls back to local knowledge base
 */
export const queryLegalAI = async (userQuery) => {
  const trimmed = userQuery.trim();
  if (!trimmed) return null;

  // 1. Check Safety Interception Rules first
  const safetyResult = checkSafetyRules(trimmed);
  if (safetyResult.isIntercepted) {
    return formatAIResponseObj(safetyResult);
  }

  // 2. Attempt Backend AI completion API (/api/ai/chat)
  try {
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: trimmed })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.mode === "ai_live" && data.response) {
        return data.response;
      }
    }
  } catch (err) {
    console.log("Backend AI API offline or unconfigured, using local Indian legal knowledge engine");
  }

  // 3. Fallback to Local Knowledge Base Engine
  const localMatch = findLocalKnowledge(trimmed);

  if (localMatch) {
    return formatAIResponseObj(localMatch);
  }

  // 4. Default Generic Response
  const generic = createGenericResponse(trimmed);
  return formatAIResponseObj(generic);
};

/**
 * Formats a raw legal data object into structured, concise, simple response string
 */
export const formatAIResponseObj = (data) => {
  const titleStr = data.title ? `### ⚖️ **${data.title}**\n\n` : "";
  const explanationStr = `${data.simpleExplanation}\n\n`;

  let pointsStr = "";
  if (Array.isArray(data.keyPoints) && data.keyPoints.length > 0) {
    pointsStr = `📌 **Key Details & Penalties:**\n` + data.keyPoints.map((pt) => `• ${pt}`).join("\n") + "\n\n";
  }

  let actionStr = "";
  if (Array.isArray(data.whatYouCanDo) && data.whatYouCanDo.length > 0) {
    actionStr = `💡 **Next Steps:**\n` + data.whatYouCanDo.map((act) => `• ${act}`).join("\n") + "\n\n";
  }

  const importantStr = `⚠️ *Note:* ${data.important || GENERAL_SAFETY_DISCLAIMER}`;

  return {
    rawObj: data,
    formattedText: `${titleStr}${explanationStr}${pointsStr}${actionStr}${importantStr}`
  };
};
