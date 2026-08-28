import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const DataContext = createContext();

const ADVOCATES_KEY = "legalassist_advocates_v2";
const APPOINTMENTS_KEY = "legalassist_appointments_v2";
const CASES_KEY = "legalassist_cases_v2";
const SOS_KEY = "legalassist_sos_v2";
const REVIEWS_KEY = "legalassist_reviews_v2";
const TICKETS_KEY = "legalassist_support_tickets_v2";

const DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const ACTIVE_APPOINTMENT_STATUSES = [
  "pending",
  "Pending",
  "accepted",
  "Accepted",
  "confirmed",
  "Confirmed",
];

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
  const defaultAvailability = createDefaultAvailability();

  if (!availability || typeof availability !== "object") {
    return defaultAvailability;
  }

  DAYS.forEach((day) => {
    if (Array.isArray(availability[day])) {
      defaultAvailability[day] = availability[day]
        .filter(
          (slot) =>
            slot &&
            typeof slot.start === "string" &&
            typeof slot.end === "string"
        )
        .map((slot) => ({
          start: slot.start,
          end: slot.end,
        }));
    }
  });

  return defaultAvailability;
};

const getDayKeyFromDate = (dateString) => {
  if (!dateString) return null;

  const [year, month, day] = dateString.split("-").map(Number);

  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day);

  return DAYS[date.getDay()];
};

const timeToMinutes = (time) => {
  if (!time) return 0;

  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

const isTimeInsideAvailability = (availability, date, time) => {
  const dayKey = getDayKeyFromDate(date);

  if (!dayKey) return false;

  const dayAvailability = availability?.[dayKey] || [];

  const selectedMinutes = timeToMinutes(time);

  return dayAvailability.some((slot) => {
    const startMinutes = timeToMinutes(slot.start);
    const endMinutes = timeToMinutes(slot.end);

    return selectedMinutes >= startMinutes && selectedMinutes < endMinutes;
  });
};

export const DataProvider = ({ children }) => {
  const { users, updateUserById } = useAuth();

  const [advocates, setAdvocates] = useState(() => {
    try {
      const saved = localStorage.getItem(ADVOCATES_KEY);
      const parsed = saved ? JSON.parse(saved) : [];

      return Array.isArray(parsed)
        ? parsed.map((advocate) => ({
            ...advocate,
            availability: normalizeAvailability(advocate.availability),
          }))
        : [];
    } catch (error) {
      console.error("Error loading advocates:", error);
      return [];
    }
  });

  // Sync advocates list with advocate users in AuthContext
  useEffect(() => {
    if (!users || !Array.isArray(users)) return;

    const advocateUsers = users.filter((u) => u.role === "advocate");

    setAdvocates((prevAdvocates) => {
      let updated = false;
      const nextAdvocates = [...prevAdvocates];

      advocateUsers.forEach((user) => {
        const index = nextAdvocates.findIndex(
          (a) => String(a.id) === String(user.id) || a.email === user.email
        );

        if (index === -1) {
          nextAdvocates.push({
            ...user,
            availability: normalizeAvailability(user.availability),
          });
          updated = true;
        } else {
          const existing = nextAdvocates[index];
          if (
            existing.status !== user.status ||
            existing.verified !== user.verified ||
            existing.name !== user.name ||
            existing.specialization !== user.specialization ||
            existing.experience !== user.experience ||
            existing.fees !== user.fees
          ) {
            nextAdvocates[index] = {
              ...existing,
              ...user,
              availability: normalizeAvailability(
                existing.availability || user.availability
              ),
            };
            updated = true;
          }
        }
      });

      return updated ? nextAdvocates : prevAdvocates;
    });
  }, [users]);

  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem(APPOINTMENTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error loading appointments:", error);
      return [];
    }
  });

  const [cases, setCases] = useState(() => {
    try {
      const saved = localStorage.getItem(CASES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error loading cases:", error);
      return [];
    }
  });

  const [sosAlerts, setSosAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem(SOS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error loading SOS:", error);
      return [];
    }
  });

  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  });

  const [supportTickets, setSupportTickets] = useState(() => {
    try {
      const saved = localStorage.getItem(TICKETS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  });

  // Fetch DB data on mount
  useEffect(() => {
    const loadAllBackendData = () => {
      fetch("/api/advocates")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data)) setAdvocates(data);
        })
        .catch(() => {});

      fetch("/api/appointments")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setAppointments((prev) => {
              const backendMap = new Map(data.map((item) => [String(item.id), item]));
              const merged = prev.map((localItem) => {
                const remote = backendMap.get(String(localItem.id));
                if (!remote) return localItem;
                return {
                  ...remote,
                  rejectionReason: remote.rejectionReason || localItem.rejectionReason || "",
                  status: remote.status || localItem.status,
                };
              });

              data.forEach((remoteItem) => {
                if (!merged.some((m) => String(m.id) === String(remoteItem.id))) {
                  merged.push(remoteItem);
                }
              });

              return merged;
            });
          }
        })
        .catch(() => {});

      fetch("/api/cases")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data)) setCases(data);
        })
        .catch(() => {});

      fetch("/api/sos")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data)) setSosAlerts(data);
        })
        .catch(() => {});

      fetch("/api/reviews")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data)) setReviews(data);
        })
        .catch(() => {});

      fetch("/api/support-tickets")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data)) setSupportTickets(data);
        })
        .catch(() => {});
    };

    loadAllBackendData();
    const retryTimer = setTimeout(loadAllBackendData, 1200);
    return () => clearTimeout(retryTimer);
  }, []);

  // --------------------------------------------------
  // SAVE DATA CACHE
  // --------------------------------------------------

  useEffect(() => {
    localStorage.setItem(ADVOCATES_KEY, JSON.stringify(advocates));
  }, [advocates]);

  useEffect(() => {
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(CASES_KEY, JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem(SOS_KEY, JSON.stringify(sosAlerts));
  }, [sosAlerts]);

  useEffect(() => {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(TICKETS_KEY, JSON.stringify(supportTickets));
  }, [supportTickets]);

  // --------------------------------------------------
  // ADVOCATE FUNCTIONS
  // --------------------------------------------------

  const addAdvocate = (advocateData) => {
    const newAdvocate = {
      ...advocateData,
      availability: normalizeAvailability(advocateData.availability),
    };

    setAdvocates((prev) => [...prev.filter((a) => a.id !== newAdvocate.id), newAdvocate]);
    return newAdvocate;
  };

  const verifyAdvocate = (advocateId, status = "verified") => {
    setAdvocates((prev) =>
      prev.map((advocate) =>
        String(advocate.id) === String(advocateId)
          ? {
              ...advocate,
              status,
              verified: status === "verified",
            }
          : advocate
      )
    );
  };

  const removeAdvocate = (advocateId) => {
    setAdvocates((prev) => prev.filter((a) => String(a.id) !== String(advocateId)));
  };

  const updateAdvocateProfile = (advocateId, updatedData) => {
    setAdvocates((prev) =>
      prev.map((advocate) =>
        String(advocate.id) === String(advocateId)
          ? {
              ...advocate,
              ...updatedData,
              availability: normalizeAvailability(
                updatedData.availability ?? advocate.availability
              ),
            }
          : advocate
      )
    );
  };

  // --------------------------------------------------
  // AVAILABILITY FUNCTIONS
  // --------------------------------------------------

  const updateAdvocateAvailability = async (advocateId, availability) => {
    const normalizedAvailability = normalizeAvailability(availability);

    setAdvocates((prev) =>
      prev.map((advocate) =>
        String(advocate.id) === String(advocateId) || advocate.email === advocateId
          ? {
              ...advocate,
              availability: normalizedAvailability,
            }
          : advocate
      )
    );

    if (typeof updateUserById === "function") {
      updateUserById(advocateId, { availability: normalizedAvailability });
    }

    try {
      await fetch(`/api/advocates/${advocateId}/availability`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability: normalizedAvailability }),
      });
    } catch (err) {
      console.log("Backend availability update offline fallback");
    }

    return {
      success: true,
      availability: normalizedAvailability,
    };
  };

  const getAdvocateAvailability = (advocateId) => {
    const advocate = advocates.find(
      (item) => String(item.id) === String(advocateId) || item.email === advocateId
    );

    return normalizeAvailability(advocate?.availability);
  };

  const getAvailableTimeSlots = (advocateId, date) => {
    const availability = getAdvocateAvailability(advocateId);
    const dayKey = getDayKeyFromDate(date);

    if (!dayKey) return [];

    const dayAvailability = availability[dayKey] || [];

    const slots = [];

    dayAvailability.forEach((period) => {
      let current = timeToMinutes(period.start);
      const end = timeToMinutes(period.end);

      while (current < end) {
        const hours = Math.floor(current / 60);
        const minutes = current % 60;

        const formattedTime = `${String(hours).padStart(2, "0")}:${String(
          minutes
        ).padStart(2, "0")}`;

        slots.push(formattedTime);

        current += 60;
      }
    });

    return slots;
  };

  // --------------------------------------------------
  // APPOINTMENT FUNCTIONS
  // --------------------------------------------------

  const isAppointmentSlotAvailable = (
    advocateId,
    date,
    time,
    excludeAppointmentId = null
  ) => {
    const hasAvailability = isTimeInsideAvailability(
      getAdvocateAvailability(advocateId),
      date,
      time
    );

    if (!hasAvailability) {
      return false;
    }

    const alreadyBooked = appointments.some((appointment) => {
      if (
        excludeAppointmentId &&
        String(appointment.id) === String(excludeAppointmentId)
      ) {
        return false;
      }

      const sameAdvocate =
        String(appointment.advocateId) === String(advocateId);

      const sameDate = appointment.date === date;
      const sameTime = appointment.time === time;

      const activeStatus = ACTIVE_APPOINTMENT_STATUSES.includes(
        appointment.status
      );

      return sameAdvocate && sameDate && sameTime && activeStatus;
    });

    return !alreadyBooked;
  };

  const bookAppointment = async (appointmentData) => {
    // Check advocate availability
    const withinAvailability = isTimeInsideAvailability(
      getAdvocateAvailability(appointmentData.advocateId),
      appointmentData.date,
      appointmentData.time
    );

    if (!withinAvailability) {
      return {
        success: false,
        message: "This advocate is not available at the selected time.",
      };
    }

    // Check duplicate appointment
    const alreadyBooked = appointments.some((appointment) => {
      const sameAdvocate =
        String(appointment.advocateId) ===
        String(appointmentData.advocateId);

      const sameDate = appointment.date === appointmentData.date;
      const sameTime = appointment.time === appointmentData.time;

      const activeStatus = ACTIVE_APPOINTMENT_STATUSES.includes(
        appointment.status
      );

      return sameAdvocate && sameDate && sameTime && activeStatus;
    });

    if (alreadyBooked) {
      return {
        success: false,
        message:
          "This time slot has already been booked. Please select another time.",
      };
    }

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setAppointments((prev) => [...prev, data.appointment]);
        return { success: true, appointment: data.appointment };
      } else if (data && data.message) {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.log("Backend booking offline fallback");
    }

    const newAppointment = {
      ...appointmentData,
      id: `appointment-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}`,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [...prev, newAppointment]);

    return {
      success: true,
      appointment: newAppointment,
    };
  };

  const updateAppointmentStatus = async (appointmentId, status, rejectionReason = "") => {
    const finalReason = rejectionReason || (status.toLowerCase() === "rejected" ? "Advocate is unavailable at the requested date and time." : "");

    let targetApp = null;
    setAppointments((prev) =>
      prev.map((appointment) => {
        if (String(appointment.id) === String(appointmentId)) {
          targetApp = {
            ...appointment,
            status,
            rejectionReason: finalReason,
            updatedAt: new Date().toISOString(),
          };
          return targetApp;
        }
        return appointment;
      })
    );

    try {
      await fetch(`/api/appointments/${appointmentId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          rejectionReason: finalReason,
          appointmentData: targetApp,
        }),
      });
    } catch (err) {
      console.log("Backend update appointment status fallback");
    }
  };

  const deleteAppointment = async (appointmentId) => {
    setAppointments((prev) => prev.filter((a) => String(a.id) !== String(appointmentId)));

    try {
      await fetch(`/api/appointments/${appointmentId}`, { method: "DELETE" });
    } catch (err) {
      console.log("Backend delete appointment fallback");
    }
  };

  const uploadAppointmentDocument = async (appointmentId, document) => {
    const docItem = {
      ...document,
      id: document.id || `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };

    setAppointments((prev) =>
      prev.map((app) =>
        String(app.id) === String(appointmentId)
          ? {
              ...app,
              documents: [...(app.documents || []), docItem],
            }
          : app
      )
    );

    try {
      await fetch(`/api/appointments/${appointmentId}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(docItem),
      });
    } catch (err) {
      console.log("Backend upload appointment document fallback");
    }
  };

  const getAdvocateAppointments = (advocateId) => {
    return appointments.filter(
      (appointment) =>
        String(appointment.advocateId) === String(advocateId)
    );
  };

  // --------------------------------------------------
  // CASE FUNCTIONS
  // --------------------------------------------------

  const createCase = async (caseData) => {
    let newCase = {
      ...caseData,
      id: `case-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(caseData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        newCase = data.case;
      }
    } catch (err) {
      console.log("Backend create case fallback");
    }

    setCases((prev) => [...prev, newCase]);
    return newCase;
  };

  const updateCaseStage = async (caseId, stage) => {
    setCases((prev) =>
      prev.map((caseItem) =>
        String(caseItem.id) === String(caseId)
          ? {
              ...caseItem,
              stage,
              updatedAt: new Date().toISOString(),
            }
          : caseItem
      )
    );

    try {
      await fetch(`/api/cases/${caseId}/stage`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });
    } catch (err) {
      console.log("Backend update case stage fallback");
    }
  };

  const updateCaseStageNote = async (caseId, stage, note, author = "Advocate", setAsCurrentStage = false) => {
    setCases((prev) =>
      prev.map((caseItem) => {
        if (String(caseItem.id) === String(caseId)) {
          const updatedNotes = {
            ...(caseItem.stageNotes || {}),
            [stage]: {
              note: note ? note.trim() : "",
              updatedAt: new Date().toISOString(),
              author: author || "Advocate",
            },
          };
          return {
            ...caseItem,
            stageNotes: updatedNotes,
            ...(setAsCurrentStage ? { stage } : {}),
            updatedAt: new Date().toISOString(),
          };
        }
        return caseItem;
      })
    );

    try {
      await fetch(`/api/cases/${caseId}/stage-note`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage, note, author, setAsCurrentStage }),
      });
    } catch (err) {
      console.log("Backend update case stage note fallback");
    }
  };


  const uploadCaseDocument = async (caseId, document) => {
    const docItem = {
      ...document,
      id: document.id || `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };

    setCases((prev) =>
      prev.map((caseItem) =>
        String(caseItem.id) === String(caseId)
          ? {
              ...caseItem,
              documents: [...(caseItem.documents || []), docItem],
            }
          : caseItem
      )
    );

    try {
      await fetch(`/api/cases/${caseId}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(docItem),
      });
    } catch (err) {
      console.log("Backend upload case document fallback");
    }
  };

  // --------------------------------------------------
  // SOS FUNCTIONS
  // --------------------------------------------------

  const triggerEmergencySOS = async (sosData) => {
    let newSOS = {
      ...sosData,
      id: `sos-${Date.now()}`,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sosData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        newSOS = data.sos;
      }
    } catch (err) {
      console.log("Backend trigger SOS fallback");
    }

    setSosAlerts((prev) => [...prev, newSOS]);
    return newSOS;
  };

  const resolveSOS = async (sosId) => {
    setSosAlerts((prev) =>
      prev.map((sos) =>
        String(sos.id) === String(sosId)
          ? {
              ...sos,
              status: "resolved",
              resolvedAt: new Date().toISOString(),
            }
          : sos
      )
    );

    try {
      await fetch(`/api/sos/${sosId}/resolve`, { method: "PUT" });
    } catch (err) {
      console.log("Backend resolve SOS fallback");
    }
  };

  // --------------------------------------------------
  // REVIEWS & RATING FUNCTIONS
  // --------------------------------------------------

  const addReview = async (reviewData) => {
    let newReview = {
      id: `review-${Date.now()}`,
      advocateId: reviewData.advocateId,
      advocateName: reviewData.advocateName || "Advocate",
      userId: reviewData.userId || "user",
      userName: reviewData.userName || "Client",
      rating: Number(reviewData.rating) || 5,
      comment: reviewData.comment?.trim() || "",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        newReview = data.review;
      }
    } catch (err) {
      console.log("Backend review fallback");
    }

    setReviews((prev) => [newReview, ...prev]);
    return newReview;
  };

  const deleteReview = async (reviewId) => {
    setReviews((prev) => prev.filter((r) => String(r.id) !== String(reviewId)));

    try {
      await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
    } catch (err) {
      console.log("Backend delete review fallback");
    }
  };

  const getAdvocateRating = (advocateId) => {
    const advocateReviews = reviews.filter(
      (r) => String(r.advocateId) === String(advocateId)
    );

    if (advocateReviews.length === 0) {
      return { avgRating: "5.0", count: 0, reviews: [] };
    }

    const sum = advocateReviews.reduce((acc, curr) => acc + (Number(curr.rating) || 5), 0);
    const avg = (sum / advocateReviews.length).toFixed(1);

    return {
      avgRating: avg,
      count: advocateReviews.length,
      reviews: advocateReviews,
    };
  };

  // --------------------------------------------------
  // SUPPORT TICKETS (CONTACT ADMIN)
  // --------------------------------------------------
  const createSupportTicket = async (ticketData) => {
    const newTicket = {
      id: `ticket-${Date.now()}`,
      senderId: ticketData.senderId || "user",
      senderName: ticketData.senderName || "User",
      senderEmail: ticketData.senderEmail || "",
      senderRole: ticketData.senderRole || "user",
      category: ticketData.category || "General Issue",
      subject: ticketData.subject ? ticketData.subject.trim() : "Issue Report",
      message: ticketData.message ? ticketData.message.trim() : "",
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    setSupportTickets((prev) => [newTicket, ...prev]);

    try {
      await fetch("/api/support-tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket),
      });
    } catch (err) {
      console.log("Offline support ticket creation:", err);
    }

    return { success: true, ticket: newTicket };
  };

  const updateSupportTicketStatus = async (id, newStatus) => {
    setSupportTickets((prev) =>
      prev.map((t) => (String(t.id) === String(id) ? { ...t, status: newStatus } : t))
    );

    try {
      await fetch(`/api/support-tickets/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.log("Offline status update:", err);
    }
  };

  const deleteSupportTicket = async (id) => {
    setSupportTickets((prev) => prev.filter((t) => String(t.id) !== String(id)));

    try {
      await fetch(`/api/support-tickets/${id}`, { method: "DELETE" });
    } catch (err) {
      console.log("Offline ticket deletion:", err);
    }
  };

  // --------------------------------------------------
  // CONTEXT VALUE
  // --------------------------------------------------

  const value = {
    advocates,
    appointments,
    cases,
    sosAlerts,
    reviews,

    addAdvocate,
    verifyAdvocate,
    removeAdvocate,
    updateAdvocateProfile,

    updateAdvocateAvailability,
    getAdvocateAvailability,
    getAvailableTimeSlots,

    bookAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    uploadAppointmentDocument,
    isAppointmentSlotAvailable,
    getAdvocateAppointments,

    createCase,
    updateCaseStage,
    updateCaseStageNote,
    uploadCaseDocument,

    triggerEmergencySOS,
    resolveSOS,

    addReview,
    deleteReview,
    getAdvocateRating,

    supportTickets,
    createSupportTicket,
    updateSupportTicketStatus,
    deleteSupportTicket,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useData must be used inside DataProvider");
  }

  return context;
};

export default DataContext;