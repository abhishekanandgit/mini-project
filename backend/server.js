require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { readDB, writeDB } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection with Placeholder & Key Detection
const MONGODB_URI = process.env.MONGODB_URL || process.env.MONGODB_URI;

if (MONGODB_URI && !MONGODB_URI.includes("<username>")) {
  console.log("📡 Attempting to connect to MongoDB Atlas...");
  mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("✅ MongoDB Atlas Connected Successfully! (Database: legalassist)"))
    .catch((err) => console.log("⚠️ MongoDB Connection Warning:", err.message, "- Falling back to local persistent DB engine"));
} else {
  console.log("ℹ️ MongoDB URI contains placeholder. Running on persistent local DB engine.");
}

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const createDefaultAvailability = () => ({
  sunday: [],
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
});

const normalizeAvailability = (availability) => {
  const def = createDefaultAvailability();
  if (!availability || typeof availability !== "object") return def;
  DAYS.forEach((day) => {
    if (Array.isArray(availability[day])) {
      def[day] = availability[day]
        .filter((s) => s && typeof s.start === "string" && typeof s.end === "string")
        .map((s) => ({ start: s.start, end: s.end }));
    }
  });
  return def;
};

// --------------------------------------------------
// AUTH ROUTES
// --------------------------------------------------

// Register
app.post("/api/auth/register", (req, res) => {
  const { name, email, phone, password, role, barId, specialization, experience, fees, qualifications } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  const db = readDB();
  const cleanEmail = email.trim().toLowerCase();

  const exists = db.users.some((u) => u.email && u.email.toLowerCase() === cleanEmail);
  if (exists) {
    return res.status(400).json({ success: false, message: "An account with this email already exists." });
  }

  const newUser = {
    id: `${role}-${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    phone: phone ? phone.trim() : "",
    password,
    role,
    status: role === "advocate" ? "pending" : "active",
    verified: role === "advocate" ? false : true,
    createdAt: new Date().toISOString(),
  };

  if (role === "advocate") {
    newUser.barId = barId ? barId.trim() : "";
    newUser.specialization = specialization ? specialization.trim() : "";
    newUser.experience = Number(experience) || 0;
    newUser.fees = Number(fees) || 0;
    newUser.qualifications = qualifications ? qualifications.trim() : "";
    newUser.bio = "";
    newUser.location = "";
    newUser.availability = createDefaultAvailability();
  }

  db.users.push(newUser);
  writeDB(db);

  return res.json({ success: true, user: newUser });
});

// Login
app.post("/api/auth/login", (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ success: false, message: "Email, password, and role are required." });
  }

  const db = readDB();
  const cleanEmail = email.trim().toLowerCase();
  const user = db.users.find((u) => u.email && u.email.toLowerCase() === cleanEmail && u.password === password && u.role === role);

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid email, password, or role." });
  }

  if (user.role === "advocate") {
    if (user.status === "pending") {
      return res.status(403).json({ success: false, message: "Your advocate account is waiting for admin approval." });
    }
    if (user.status === "rejected") {
      return res.status(403).json({ success: false, message: "Your advocate registration has been rejected." });
    }
    if (user.status !== "verified") {
      return res.status(403).json({ success: false, message: "Your advocate account is not verified yet." });
    }
  }

  return res.json({ success: true, user });
});

// Get Users
app.get("/api/users", (req, res) => {
  const db = readDB();
  return res.json(db.users || []);
});

// Approve Advocate
app.put("/api/users/:id/approve", (req, res) => {
  const { id } = req.params;
  const db = readDB();

  let approvedUser = null;
  db.users = db.users.map((u) => {
    if (String(u.id) === String(id) && u.role === "advocate") {
      approvedUser = { ...u, status: "verified", verified: true };
      return approvedUser;
    }
    return u;
  });

  if (!approvedUser) {
    return res.status(404).json({ success: false, message: "Advocate not found." });
  }

  writeDB(db);
  return res.json({ success: true, user: approvedUser });
});

// Reject Advocate
app.put("/api/users/:id/reject", (req, res) => {
  const { id } = req.params;
  const db = readDB();

  let rejectedUser = null;
  db.users = db.users.map((u) => {
    if (String(u.id) === String(id) && u.role === "advocate") {
      rejectedUser = { ...u, status: "rejected", verified: false };
      return rejectedUser;
    }
    return u;
  });

  if (!rejectedUser) {
    return res.status(404).json({ success: false, message: "Advocate not found." });
  }

  writeDB(db);
  return res.json({ success: true, user: rejectedUser });
});

// Update Profile
app.put("/api/users/:id/profile", (req, res) => {
  const { id } = req.params;
  const db = readDB();

  let updatedUser = null;
  db.users = db.users.map((u) => {
    if (String(u.id) === String(id)) {
      updatedUser = { ...u, ...req.body };
      return updatedUser;
    }
    return u;
  });

  if (!updatedUser) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  writeDB(db);
  return res.json({ success: true, user: updatedUser });
});

// --------------------------------------------------
// ADVOCATES & AVAILABILITY ROUTES
// --------------------------------------------------

// Get Advocates
app.get("/api/advocates", (req, res) => {
  const db = readDB();
  const advocates = db.users
    .filter((u) => u.role === "advocate")
    .map((adv) => ({
      ...adv,
      availability: normalizeAvailability(adv.availability),
    }));

  return res.json(advocates);
});

// Save Availability
app.put("/api/advocates/:id/availability", (req, res) => {
  const { id } = req.params;
  const { availability } = req.body;
  const db = readDB();

  const normalized = normalizeAvailability(availability);
  let updated = false;

  db.users = db.users.map((u) => {
    if (String(u.id) === String(id) && u.role === "advocate") {
      updated = true;
      return { ...u, availability: normalized };
    }
    return u;
  });

  if (!updated) {
    return res.status(404).json({ success: false, message: "Advocate not found." });
  }

  writeDB(db);
  return res.json({ success: true, availability: normalized });
});

// --------------------------------------------------
// APPOINTMENT ROUTES
// --------------------------------------------------

// Get Appointments
app.get("/api/appointments", (req, res) => {
  const db = readDB();
  return res.json(db.appointments || []);
});

// Book Appointment (Slot locking in DB)
app.post("/api/appointments", (req, res) => {
  const { advocateId, advocateName, advocateEmail, userId, userName, userEmail, userPhone, date, time, reason, consultationType } = req.body;

  if (!advocateId || !userId || !date || !time) {
    return res.status(400).json({ success: false, message: "Advocate, user, date, and time are required." });
  }

  const db = readDB();

  // Check duplicate booked slot in DB
  const alreadyBooked = db.appointments.some((app) => {
    const sameAdvocate = String(app.advocateId) === String(advocateId);
    const sameDate = app.date === date;
    const sameTime = app.time === time;
    const activeStatus = ["pending", "Pending", "accepted", "Accepted", "confirmed", "Confirmed"].includes(app.status);
    return sameAdvocate && sameDate && sameTime && activeStatus;
  });

  if (alreadyBooked) {
    return res.status(400).json({ success: false, message: "This time slot has already been booked. Please choose another time." });
  }

  const newAppointment = {
    id: `appointment-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    advocateId: String(advocateId),
    advocateName: advocateName || "Advocate",
    advocateEmail: advocateEmail || "",
    userId: String(userId),
    userName: userName || "User",
    userEmail: userEmail || "",
    userPhone: userPhone || "",
    date,
    time,
    reason: reason ? reason.trim() : "",
    consultationType: consultationType || "Online Consultation",
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  db.appointments.push(newAppointment);
  writeDB(db);

  return res.json({ success: true, appointment: newAppointment });
});

// Update Appointment Status
app.put("/api/appointments/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, rejectionReason, appointmentData } = req.body;
  const db = readDB();

  let updatedApp = null;
  const existingIdx = db.appointments.findIndex((app) => String(app.id) === String(id));
  const finalRejectionReason = rejectionReason ? rejectionReason.trim() : "Advocate is unavailable at the requested date and time.";

  if (existingIdx >= 0) {
    updatedApp = {
      ...db.appointments[existingIdx],
      status,
      rejectionReason: finalRejectionReason,
      updatedAt: new Date().toISOString(),
    };
    db.appointments[existingIdx] = updatedApp;
  } else {
    updatedApp = {
      ...(appointmentData || {}),
      id,
      status,
      rejectionReason: finalRejectionReason,
      updatedAt: new Date().toISOString(),
    };
    db.appointments.push(updatedApp);
  }

  writeDB(db);
  return res.json({ success: true, appointment: updatedApp });
});
// Delete Appointment
app.delete("/api/appointments/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();

  if (Array.isArray(db.appointments)) {
    db.appointments = db.appointments.filter((app) => String(app.id) !== String(id));
    writeDB(db);
  }

  return res.json({ success: true, message: "Appointment deleted successfully." });
});

// Upload Document to Appointment
app.post("/api/appointments/:id/documents", (req, res) => {
  const { id } = req.params;
  const document = req.body;
  const db = readDB();

  let updatedApp = null;
  db.appointments = db.appointments.map((app) => {
    if (String(app.id) === String(id)) {
      const docItem = {
        ...document,
        id: document.id || `doc-${Date.now()}`,
        uploadedAt: new Date().toISOString(),
      };
      const docs = Array.isArray(app.documents) ? [...app.documents, docItem] : [docItem];
      updatedApp = { ...app, documents: docs, updatedAt: new Date().toISOString() };
      return updatedApp;
    }
    return app;
  });

  if (!updatedApp) {
    return res.status(404).json({ success: false, message: "Appointment not found." });
  }

  writeDB(db);
  return res.json({ success: true, appointment: updatedApp });
});

// --------------------------------------------------
// CASE ROUTES
// --------------------------------------------------

// Get Cases
app.get("/api/cases", (req, res) => {
  const db = readDB();
  return res.json(db.cases || []);
});

// Create Case
app.post("/api/cases", (req, res) => {
  const db = readDB();
  const newCase = {
    ...req.body,
    id: `case-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  db.cases.push(newCase);
  writeDB(db);

  return res.json({ success: true, case: newCase });
});

// Upload/Share Document to Case
app.post("/api/cases/:id/documents", (req, res) => {
  const { id } = req.params;
  const document = req.body;
  const db = readDB();

  let updatedCase = null;
  db.cases = db.cases.map((c) => {
    if (String(c.id) === String(id)) {
      const docItem = {
        ...document,
        id: document.id || `doc-${Date.now()}`,
        uploadedAt: new Date().toISOString(),
      };
      const docs = Array.isArray(c.documents) ? [...c.documents, docItem] : [docItem];
      updatedCase = { ...c, documents: docs, updatedAt: new Date().toISOString() };
      return updatedCase;
    }
    return c;
  });

  if (!updatedCase) {
    return res.status(404).json({ success: false, message: "Case not found." });
  }

  writeDB(db);
  return res.json({ success: true, case: updatedCase });
});

// Update Case Stage
app.put("/api/cases/:id/stage", (req, res) => {
  const { id } = req.params;
  const { stage } = req.body;
  const db = readDB();

  let updatedCase = null;
  db.cases = db.cases.map((c) => {
    if (String(c.id) === String(id)) {
      updatedCase = { ...c, stage, updatedAt: new Date().toISOString() };
      return updatedCase;
    }
    return c;
  });

  if (!updatedCase) {
    return res.status(404).json({ success: false, message: "Case not found." });
  }

  writeDB(db);
  return res.json({ success: true, case: updatedCase });
});

// --------------------------------------------------
// SOS ROUTES
// --------------------------------------------------

app.get("/api/sos", (req, res) => {
  const db = readDB();
  return res.json(db.sosAlerts || []);
});

app.post("/api/sos", (req, res) => {
  const db = readDB();
  const newSOS = {
    ...req.body,
    id: `sos-${Date.now()}`,
    status: "active",
    createdAt: new Date().toISOString(),
  };

  db.sosAlerts.push(newSOS);
  writeDB(db);

  return res.json({ success: true, sos: newSOS });
});

// --------------------------------------------------
// REVIEWS & RATING ROUTES
// --------------------------------------------------

app.get("/api/reviews", (req, res) => {
  const db = readDB();
  return res.json(db.reviews || []);
});

app.post("/api/reviews", (req, res) => {
  const db = readDB();
  const { advocateId, advocateName, userId, userName, rating, comment } = req.body;

  if (!advocateId || !rating) {
    return res.status(400).json({ success: false, message: "Advocate ID and rating are required." });
  }

  const newReview = {
    id: `review-${Date.now()}`,
    advocateId,
    advocateName: advocateName || "Advocate",
    userId: userId || "anonymous",
    userName: userName || "Client",
    rating: Number(rating) || 5,
    comment: comment?.trim() || "",
    createdAt: new Date().toISOString(),
  };

  if (!Array.isArray(db.reviews)) {
    db.reviews = [];
  }

  db.reviews.unshift(newReview);
  writeDB(db);

  return res.json({ success: true, review: newReview });
});

app.delete("/api/reviews/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();

  if (Array.isArray(db.reviews)) {
    db.reviews = db.reviews.filter((r) => String(r.id) !== String(id));
    writeDB(db);
  }

  return res.json({ success: true, message: "Review deleted successfully." });
});

app.listen(PORT, () => {
  console.log(`✅ LegalAssist Backend DB Server listening on http://localhost:${PORT}`);
});
