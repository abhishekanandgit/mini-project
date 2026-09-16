import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import AIChatbotGlobal from "./components/AIChatbotGlobal";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdvocateDashboard from "./pages/AdvocateDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Advocates from "./pages/Advocates";
import AdvocateDetail from "./pages/AdvocateDetail";
import BookAppointment from "./pages/BookAppointment";
import Contact from "./pages/Contact";
import AdvocateAvailability from "./pages/AdvocateAvailability";
import LegalAssistant from "./pages/LegalAssistant";

import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Navbar />
          <AIChatbotGlobal />

          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/advocates" element={<Advocates />} />
            <Route
              path="/advocate/:id"
              element={<AdvocateDetail />}
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="/ai-legal-assistant" element={<LegalAssistant />} />

            {/* Appointment */}
            <Route
              path="/book-appointment"
              element={<BookAppointment />}
            />
            <Route
  path="/advocate-availability"
  element={<AdvocateAvailability />}
/>

            {/* Dashboards */}
            <Route
              path="/user-dashboard"
              element={<UserDashboard />}
            />

            <Route
              path="/advocate-dashboard"
              element={<AdvocateDashboard />}
            />

            <Route
              path="/admin-dashboard"
              element={<AdminDashboard />}
            />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;