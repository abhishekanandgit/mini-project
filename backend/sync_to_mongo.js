require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URL || process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ ERROR: MONGODB_URL is not set in backend/.env file.");
  process.exit(1);
}

// Schemas
const userSchema = new mongoose.Schema({ id: { type: String, unique: true } }, { strict: false });
const appointmentSchema = new mongoose.Schema({ id: { type: String, unique: true } }, { strict: false });
const caseSchema = new mongoose.Schema({ id: { type: String, unique: true } }, { strict: false });
const sosSchema = new mongoose.Schema({ id: { type: String, unique: true } }, { strict: false });

const reviewSchema = new mongoose.Schema({ id: { type: String, unique: true } }, { strict: false });

const User = mongoose.model("User", userSchema);
const Appointment = mongoose.model("Appointment", appointmentSchema);
const Case = mongoose.model("Case", caseSchema);
const SOS = mongoose.model("SOS", sosSchema);
const Review = mongoose.model("Review", reviewSchema);

async function syncToMongoDB() {
  console.log("🔄 Starting Local DB JSON -> MongoDB Atlas Migration Sync...\n");
  console.log(`📡 Connecting to MongoDB Atlas: ${MONGODB_URI.replace(/:([^@]+)@/, ":****@")}...`);

  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log("✅ Successfully connected to MongoDB Atlas!\n");

    const jsonPath = path.join(__dirname, "legalassist_db.json");
    if (!fs.existsSync(jsonPath)) {
      console.error("❌ ERROR: legalassist_db.json file not found.");
      process.exit(1);
    }

    const rawData = fs.readFileSync(jsonPath, "utf-8");
    const localDb = JSON.parse(rawData);

    // 1. Sync Users
    const users = localDb.users || [];
    console.log(`📦 Syncing ${users.length} Users...`);
    for (const user of users) {
      await User.updateOne({ id: user.id }, { $set: user }, { upsert: true });
      console.log(`   - Synced User: ${user.name || user.email} (${user.role})`);
    }

    // 2. Sync Appointments
    const appointments = localDb.appointments || [];
    console.log(`\n📅 Syncing ${appointments.length} Appointments...`);
    for (const appt of appointments) {
      await Appointment.updateOne({ id: appt.id }, { $set: appt }, { upsert: true });
      console.log(`   - Synced Appointment: ${appt.id} (${appt.date} @ ${appt.time})`);
    }

    // 3. Sync Cases
    const cases = localDb.cases || [];
    console.log(`\n⚖️ Syncing ${cases.length} Cases...`);
    for (const c of cases) {
      await Case.updateOne({ id: c.id }, { $set: c }, { upsert: true });
      console.log(`   - Synced Case: ${c.id}`);
    }

    // 4. Sync SOS Alerts
    const sosAlerts = localDb.sosAlerts || localDb.sos_alerts || [];
    console.log(`\n🚨 Syncing ${sosAlerts.length} SOS Alerts...`);
    for (const sos of sosAlerts) {
      await SOS.updateOne({ id: sos.id }, { $set: sos }, { upsert: true });
      console.log(`   - Synced SOS: ${sos.id}`);
    }

    // 5. Sync Reviews
    const reviews = localDb.reviews || [];
    console.log(`\n⭐ Syncing ${reviews.length} Reviews...`);
    for (const rev of reviews) {
      await Review.updateOne({ id: rev.id }, { $set: rev }, { upsert: true });
      console.log(`   - Synced Review: ${rev.id} (${rev.rating}★ for ${rev.advocateName})`);
    }

    console.log("\n🎉 SUCCESS: All local JSON data synced to MongoDB Atlas!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ MONGODB SYNC ERROR:", error.message);
    if (error.message.includes("whitelist") || error.message.includes("Could not connect")) {
      console.log("\n💡 IP WHITELIST REQUIRED:");
      console.log("   1. Open MongoDB Atlas Console -> Security -> Network Access");
      console.log("   2. Click 'Add IP Address'");
      console.log("   3. Select 'ALLOW ACCESS FROM ANYWHERE' (0.0.0.0/0)");
      console.log("   4. Re-run: node sync_to_mongo.js");
    }
    process.exit(1);
  }
}

syncToMongoDB();
