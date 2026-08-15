const fs = require("fs");
const path = require("path");

const dbFilePath = path.join(__dirname, "legalassist_db.json");

const defaultData = {
  users: [
    {
      id: "admin-001",
      name: "System Administrator",
      email: "admin@legalassist.com",
      phone: "9999999999",
      password: "admin123",
      role: "admin",
      status: "active",
      verified: true,
      createdAt: "2026-01-01T00:00:00.000Z",
    },
  ],
  availability: [],
  appointments: [],
  cases: [],
  sosAlerts: [],
};

// Ensure database file exists
if (!fs.existsSync(dbFilePath)) {
  fs.writeFileSync(dbFilePath, JSON.stringify(defaultData, null, 2), "utf-8");
}

const readDB = () => {
  try {
    const raw = fs.readFileSync(dbFilePath, "utf-8");
    const parsed = JSON.parse(raw);

    // Ensure admin user always exists
    if (!parsed.users || !Array.isArray(parsed.users)) {
      parsed.users = defaultData.users;
    } else {
      const adminExists = parsed.users.some((u) => u.role === "admin");
      if (!adminExists) {
        parsed.users.unshift(defaultData.users[0]);
      }
    }

    if (!Array.isArray(parsed.availability)) parsed.availability = [];
    if (!Array.isArray(parsed.appointments)) parsed.appointments = [];
    if (!Array.isArray(parsed.cases)) parsed.cases = [];
    if (!Array.isArray(parsed.sosAlerts)) parsed.sosAlerts = [];
    if (!Array.isArray(parsed.reviews)) parsed.reviews = [];

    return parsed;
  } catch (error) {
    console.error("Error reading DB file:", error);
    return defaultData;
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing DB file:", error);
  }
};

module.exports = {
  readDB,
  writeDB,
};
