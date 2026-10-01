/**
 * LegalAssist Indian Legal Knowledge Base
 * Focused on Indian Laws (BNS, BNSS, BSA) & General Legal Awareness
 */

export const SUGGESTED_QUESTIONS = [
  "What is an FIR?",
  "What are my basic rights if I am arrested?",
  "What is bail?",
  "What is a legal notice?",
  "What is cybercrime and how to report it?",
  "What is defamation?",
  "What is domestic violence?",
  "What is the difference between IPC and BNS?",
  "What is the difference between a complaint and an FIR?",
  "How can I file a consumer complaint?"
];

export const LEGAL_TOPICS = [
  {
    id: "criminal_law",
    title: "Criminal Law (BNS & BNSS)",
    icon: "bi-shield-slash-fill",
    description: "FIR, Bail, Arrest rights, Cognizable offences, Police investigation, BNS / BNSS provisions."
  },
  {
    id: "civil_law",
    title: "Civil Law & Disputes",
    icon: "bi-file-earmark-text-fill",
    description: "Civil suits, Property disputes, Money recovery, Injunctions, Contracts & Agreements."
  },
  {
    id: "consumer_law",
    title: "Consumer Rights & Law",
    icon: "bi-cart-check-fill",
    description: "Defective products, Deficient services, Consumer court complaints, Refunds & compensation."
  },
  {
    id: "cyber_law",
    title: "Cyber Law & Online Safety",
    icon: "bi-laptop-fill",
    description: "Online fraud, Identity theft, Cyber harassment, Phishing, Reporting on cybercrime.gov.in (1930)."
  },
  {
    id: "family_law",
    title: "Family & Personal Law",
    icon: "bi-house-heart-fill",
    description: "Marriage, Divorce, Maintenance, Domestic Violence (PWDVA), Child Custody & Guardianship."
  },
  {
    id: "constitutional_rights",
    title: "Constitutional Rights",
    icon: "bi-award-fill",
    description: "Fundamental Rights, Right to Equality, Freedom of Speech, Right to Life & Liberty (Art 21)."
  }
];

export const KNOWLEDGE_BASE = [
  {
    keywords: ["fir", "first information report", "police complaint", "file fir", "zero fir"],
    topic: "Criminal Law",
    title: "First Information Report (FIR)",
    simpleExplanation: "An FIR (First Information Report) is a written document prepared by the police when they receive information about a cognizable offence (a serious crime where police can arrest without a warrant). It marks the official commencement of a police investigation under Section 173 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 (formerly Section 154 CrPC).",
    keyPoints: [
      "BNSS Framework: Governed by Section 173 of BNSS, 2023.",
      "Right to Copy: The informant/complainant is entitled to a free copy of the registered FIR immediately.",
      "Zero FIR: You can lodge a Zero FIR at any police station regardless of jurisdiction; it will later be transferred to the concerned police station.",
      "E-FIR Provision: Information regarding cognizable offences can be sent electronically, provided it is signed within 3 days.",
      "Refusal Remedy: If police refuse to register an FIR, you can send the written complaint to the Superintendent of Police (SP) or file an application before a Judicial Magistrate."
    ],
    example: "If someone's vehicle or property is stolen (theft/robbery), the victim reports the incident to the police station. The police officer writes down the details, registers the FIR, gives a copy to the victim, and begins searching for the offender.",
    whatYouCanDo: [
      "Visit the local police station or submit an e-FIR where available.",
      "State clear facts: date, time, location, persons involved, and description of the event.",
      "Obtain an official stamped copy of the FIR free of cost.",
      "If police refuse, send a registered post letter to the SP or consult a criminal law advocate."
    ],
    important: "An FIR is an informational report, not a final judgment of guilt. For legal guidance on specific criminal matters, consult a qualified advocate."
  },
  {
    keywords: ["arrest", "rights during arrest", "police arrest", "arrested", "handcuff"],
    topic: "Constitutional & Criminal Rights",
    title: "Basic Rights During Police Arrest",
    simpleExplanation: "Under Article 22 of the Constitution of India and Section 35-50 of BNSS, 2023, every arrested individual has fundamental constitutional safeguards to ensure fair treatment, dignity, and prevention of custodial abuse.",
    keyPoints: [
      "Right to Know Grounds: The police must inform you immediately of the exact reason and charges for your arrest.",
      "Right to Consult Advocate: You have the right to consult and be defended by a legal practitioner of your choice (Art 22(1) / Sec 41(D) BNSS).",
      "Right to Inform Family: Police must promptly notify a relative or friend chosen by you regarding your arrest and location.",
      "24-Hour Magistrate Rule: An arrested person must be produced before the nearest Judicial Magistrate within 24 hours of arrest (excluding travel time).",
      "Medical Examination: You have the right to be medically examined by a registered medical practitioner at the time of arrest and custody."
    ],
    example: "If a person is detained by police, the officer must show identification, provide an arrest memo signed by at least one witness, state the grounds of arrest, and allow the person to call their lawyer or family member.",
    whatYouCanDo: [
      "Remain calm and politely ask for the written grounds of arrest and arrest memo.",
      "Exercise your right to inform your family and request to contact your lawyer immediately.",
      "Insist on a medical checkup before being placed in police custody.",
      "Use LegalAssist to contact a verified criminal defence advocate."
    ],
    important: "If there is an immediate safety threat or illegal detention, inform the Judicial Magistrate directly upon production or contact emergency services."
  },
  {
    keywords: ["bail", "anticipatory bail", "bailable", "non bailable", "interim bail"],
    topic: "Criminal Law",
    title: "Bail Provisions & Types in India",
    simpleExplanation: "Bail is the temporary release of an accused person awaiting trial or investigation, upon furnishing a security bond to guarantee their appearance in court. The core principle under Indian jurisprudence is 'Bail is the rule, jail is the exception'.",
    keyPoints: [
      "Bailable Offences: In minor offences (Sec 478 BNSS / Sec 436 CrPC), bail is a matter of right. Police or court must grant bail upon bond.",
      "Non-Bailable Offences: In serious offences (Sec 480 BNSS), granting bail is at the discretion of the Court based on gravity, evidence, and risk of fleeing.",
      "Anticipatory Bail: Under Section 482 BNSS (formerly Sec 438 CrPC), a person anticipating arrest in a non-bailable offence can apply to the Sessions Court or High Court for pre-arrest bail.",
      "Interim & Regular Bail: Regular bail is applied for after arrest; interim bail provides temporary relief pending final hearing."
    ],
    example: "If an individual fears false accusation in a business dispute, their advocate can file an Anticipatory Bail application in the Sessions Court to prevent police arrest while the investigation proceeds.",
    whatYouCanDo: [
      "Identify whether the offence is classified as bailable or non-bailable.",
      "Gather identity proof, address proof, and local sureties.",
      "Engage an advocate to draft and file a bail petition before the competent Magistrate or Sessions Judge."
    ],
    important: "Bail conditions usually require non-interference with witnesses and surrendering passport. Consult a criminal lawyer to handle bail applications."
  },
  {
    keywords: ["bns", "ipc", "crpc", "bsa", "new criminal laws", "bharatiya nyaya sanhita"],
    topic: "General Legal Awareness",
    title: "Indian Criminal Law Reforms: BNS, BNSS, and BSA (2024)",
    simpleExplanation: "On July 1, 2024, India implemented three modern criminal codes that replaced colonial-era statutes to modernize justice delivery, introduce victim-centric provisions, and integrate digital evidence.",
    keyPoints: [
      "Bharatiya Nyaya Sanhita (BNS), 2023: Replaced the Indian Penal Code (IPC), 1860. Defines crimes and penalties.",
      "Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023: Replaced the Code of Criminal Procedure (CrPC), 1973. Governs investigation, arrest, and trial.",
      "Bharatiya Sakshya Adhiniyam (BSA), 2023: Replaced the Indian Evidence Act, 1872. Governs admissibility of electronic and oral evidence.",
      "Digital Evidence & Audio-Video Recording: Search, seizure, and witness statements now emphasize video recording and digital records.",
      "Community Service: Introduced community service as a penal option for minor first-time offences."
    ],
    example: "Offences previously charged under IPC Section 302 (Murder) or IPC Section 420 (Cheating) are now charged under corresponding sections of BNS, 2023, while procedures follow BNSS, 2023.",
    whatYouCanDo: [
      "Ensure legal references use BNS, BNSS, and BSA for incidents post July 1, 2024.",
      "Verify whether an incident occurred prior to July 1, 2024 (where old IPC/CrPC sections may still apply transitionally)."
    ],
    important: "The new criminal codes apply to acts committed on or after July 1, 2024. For transitional legal advice, consult an advocate."
  },
  {
    keywords: ["legal notice", "send legal notice", "reply to legal notice", "notice period"],
    topic: "Civil & Business Law",
    title: "Understanding a Legal Notice",
    simpleExplanation: "A Legal Notice is a formal written communication sent by one party to another warning them of legal action if a grievance, debt, breach of contract, or statutory default is not resolved within a specified timeframe.",
    keyPoints: [
      "Purpose: Serves as an official warning giving the opponent an opportunity to settle out of court.",
      "Mandatory Notice: Required by law in certain matters (e.g., Section 138 Negotiable Instruments Act for cheque bounce, Section 80 CPC for government suits).",
      "Notice Period: Usually provides 15 to 30 days for compliance or reply.",
      "Consequences: Ignoring a legal notice can be used against you in court to demonstrate non-cooperation or willful default."
    ],
    example: "If a tenant fails to pay rent for 6 months despite reminders, the landlord's advocate sends a Legal Notice demanding payment within 15 days, failing which an eviction suit will be filed.",
    whatYouCanDo: [
      "Do not panic upon receiving a notice; note down the delivery date and deadline.",
      "Do not ignore the notice.",
      "Consult a civil advocate promptly to draft an appropriate, legally sound reply addressing every allegation."
    ],
    important: "Admissions made in a legal notice or reply are admissible in court. Always draft or reply through a qualified lawyer."
  },
  {
    keywords: ["cybercrime", "online fraud", "phishing", "financial fraud", "1930", "cyber police"],
    topic: "Cyber Law",
    title: "Cybercrime & Online Financial Fraud",
    simpleExplanation: "Cybercrime refers to illegal acts committed using computers, smartphones, networks, or online banking. In India, it is governed by the Information Technology (IT) Act, 2000 and the Bharatiya Nyaya Sanhita (BNS).",
    keyPoints: [
      "Common Types: UPI phishing, credit/debit card fraud, identity theft, unauthorized access, cyber stalking, online harassment.",
      "National Cyber Helpline: Dial 1930 immediately to report financial fraud within the 'Golden Hour' to freeze stolen funds in bank accounts.",
      "Official Reporting Portal: File reports online at National Cyber Crime Reporting Portal (cybercrime.gov.in).",
      "Evidence Preservation: Screenshots, transaction IDs, bank statements, URLs, and chat logs are crucial evidence."
    ],
    example: "If a fraudster tricks you into sharing an OTP and steals money from your bank account, calling 1930 immediately enables the Cyber Cell to lien-mark the funds before the culprit withdraws it.",
    whatYouCanDo: [
      "Call 1930 immediately for financial cyber fraud.",
      "Log onto cybercrime.gov.in and file a detailed complaint with screenshots and bank transaction reference numbers.",
      "Inform your bank immediately to block affected cards or net banking access."
    ],
    important: "Never share OTPs, UPI PINs, or bank passwords with anyone. For high-value fraud, consult a cyber law advocate."
  },
  {
    keywords: ["defamation", "slander", "libel", "reputation", "bns 356"],
    topic: "Criminal & Civil Law",
    title: "Defamation Laws in India",
    simpleExplanation: "Defamation involves making a false statement about an individual or entity that harms their reputation in the eyes of right-thinking members of society. In India, defamation can be pursued as both a civil wrong (compensation) and a criminal offence (Section 356 BNS / Section 499 IPC).",
    keyPoints: [
      "Libel vs Slander: Libel is written/published defamation; Slander is spoken defamation.",
      "Criminal Defamation: Punishable with imprisonment up to 2 years, fine, or community service under BNS Section 356.",
      "Civil Defamation: Filed in civil court to claim monetary damages for loss of reputation.",
      "Exceptions: Truth spoken for public good, fair review of public performance, and opinions expressed in good faith are valid defences."
    ],
    example: "If a person publishes false accusations on social media alleging an individual committed fraud, without evidence, the affected party can issue a legal notice and file a defamation suit.",
    whatYouCanDo: [
      "Preserve evidence: save screenshots, audio/video recordings, and published posts.",
      "Issue a cease-and-desist Legal Notice demanding retraction and apology.",
      "File a criminal complaint or civil damages suit through a lawyer."
    ],
    important: "True statements published in good faith for public welfare do not constitute defamation under Indian law."
  },
  {
    keywords: ["domestic violence", "pwdva", "husband cruelty", "498a", "maintenance", "women rights"],
    topic: "Family & Women Law",
    title: "Protection Against Domestic Violence (PWDVA)",
    simpleExplanation: "The Protection of Women from Domestic Violence Act (PWDVA), 2005, and BNS Section 85/86 provide comprehensive protection to women experiencing physical, sexual, emotional, verbal, or economic abuse within a shared household.",
    keyPoints: [
      "Scope of Abuse: Covers physical assault, verbal degradation, harassment for dowry, denial of financial resources, and emotional abuse.",
      "Relief Available: Protection Orders (preventing abuser entry), Residence Orders (right to live in shared household), Monetary Relief, and Child Custody.",
      "National Helpline: Emergency helpline 181 (Women Helpline) or 112.",
      "Protection Officers: Every district has designated Protection Officers to assist aggrieved women free of cost."
    ],
    example: "A married woman facing physical threats and economic deprivation by in-laws can approach a Protection Officer or Judicial Magistrate to obtain an immediate protection order and monthly maintenance.",
    whatYouCanDo: [
      "Call 181 or 112 in case of emergency or physical danger.",
      "Contact the district Protection Officer, nearest police station, or Legal Services Authority.",
      "Consult a family law advocate to file a petition under PWDVA or Section 85 BNS."
    ],
    important: "Safety is top priority. In case of immediate physical harm, call 112 or visit the nearest police station immediately."
  },
  {
    keywords: ["consumer", "consumer rights", "defective product", "consumer court", "jagruti"],
    topic: "Consumer Law",
    title: "Consumer Rights & Consumer Disputes Redressal",
    simpleExplanation: "Under the Consumer Protection Act, 2019, any individual who buys goods or hires services for consideration is protected against unfair trade practices, defective products, and deficient services.",
    keyPoints: [
      "3-Tier Forum: District Consumer Commission (up to ₹50 Lakhs), State Commission (₹50 L to ₹2 Crores), National Commission (Above ₹2 Crores).",
      "E-Daakhil Portal: Consumer complaints can be filed online conveniently via edaakhil.nic.in.",
      "E-Commerce Coverage: Online platforms, delivery services, and misleading advertisements are strictly covered.",
      "Remedies: Replacement of goods, full refund with interest, compensation for mental harassment, and legal costs."
    ],
    example: "If a company sells a defective laptop and refuses repair or refund during the warranty period, the buyer can file a complaint in the District Consumer Commission to claim a full refund plus compensation.",
    whatYouCanDo: [
      "Keep purchase tax invoice, warranty card, emails, and complaint ticket records.",
      "Send a formal written complaint / legal notice to the manufacturer/seller.",
      "File an online complaint on National Consumer Helpline (1915 / consumerhelpline.gov.in) or e-Daakhil."
    ],
    important: "Consumer court procedures are user-friendly. However, complex claims benefit from legal representation."
  },
  {
    keywords: ["complaint vs fir", "difference fir complaint", "private complaint", "magistrate complaint"],
    topic: "General Legal Awareness",
    title: "Difference Between a Complaint and an FIR",
    simpleExplanation: "While both initiate legal process, an FIR is lodged directly with the Police for cognizable offences, whereas a Complaint is submitted to a Magistrate regarding cognizable or non-cognizable offences.",
    keyPoints: [
      "Recipients: FIR is submitted to Police (Sec 173 BNSS); Complaint is submitted to Judicial Magistrate (Sec 223 BNSS).",
      "Offence Type: FIR is exclusively for cognizable offences; Complaint covers both cognizable & non-cognizable offences.",
      "Police Investigation: Police can investigate an FIR automatically; in a private Magistrate complaint, the Magistrate orders investigation or examines witnesses first.",
      "Police Refusal: If police refuse an FIR, filing a complaint before the Magistrate under Sec 175(3) BNSS is the legal remedy."
    ],
    example: "If police refuse to lodge an FIR for a property cheating fraud, the aggrieved person files a private complaint before the Judicial Magistrate, who can direct the police to investigate.",
    whatYouCanDo: [
      "First approach the police station for lodging an FIR.",
      "If unsuccessful, file a written complaint to the SP.",
      "If still unheeded, consult a lawyer to file a court complaint under BNSS."
    ],
    important: "A court complaint requires proper legal drafting and evidence attachments."
  }
];

export const GENERAL_SAFETY_DISCLAIMER = 
  "LegalAssist AI provides general legal awareness and information for educational purposes in India. " +
  "It is not a substitute for professional legal advice from a licensed advocate. " +
  "Laws and court procedures are subject to amendments. For specific legal cases, consult a qualified advocate.";
