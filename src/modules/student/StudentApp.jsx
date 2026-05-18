import { useState, useCallback } from "react";
import { F } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import Sidebar from "../../components/layout/Sidebar";
import PageWrap from "../../components/layout/PageWrap";
import StudentOverview      from "./StudentOverview";
import StudentProfile       from "./StudentProfile";
import StudentAttendance    from "./StudentAttendance";
import StudentAssignments   from "./StudentAssignments";
import StudentNotifications from "./StudentNotifications";

export default function StudentApp({ user, students, assignments, setStudents, setAssignments, onLogout }) {
  const { theme, isDark } = useTheme();
  const [view, setView]   = useState("overview");

  const studentData   = students.find(s => s.id === user.data.id) || user.data;
  const myAssignments = assignments.filter(a => a.branch === studentData.branch);
  const unreadCount   = (studentData.notifications || []).filter(n => !n.read).length;

  const navItems = [
    { id: "overview",      icon: "📊", label: "Overview"       },
    { id: "profile",       icon: "👤", label: "My Profile"     },
    { id: "attendance",    icon: "📋", label: "Attendance"     },
    { id: "assignments",   icon: "📝", label: "Assignments"    },
    { id: "notifications", icon: "🔔", label: "Notifications", badge: unreadCount || null },
  ];

  const updateStudent = useCallback((updater) => {
    setStudents(prev => prev.map(s => s.id === studentData.id ? updater(s) : s));
  }, [studentData.id, setStudents]);

  // ── Pending screen ──
  if (studentData.status === "pending") {
    return (
      <>
        <Sidebar items={navItems} active={view} onNav={setView} user={{ ...user, role: "Student" }} onLogout={onLogout} />
        <PageWrap>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: theme.TX1, marginBottom: 8, fontFamily: F }}>
              Profile Pending Approval
            </div>
            <div style={{ fontSize: 14, color: theme.TX2, maxWidth: 400, lineHeight: 1.7, marginBottom: 24, fontFamily: F }}>
              Your academic profile has been submitted and is awaiting review by your assigned teacher.
            </div>
            <div style={{
              background: theme.CRD,
              border: `1px solid ${theme.BD}`,
              borderRadius: 12,
              padding: 20,
              maxWidth: 400,
              width: "100%",
              textAlign: "left",
              boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: theme.TX1, marginBottom: 12, fontFamily: F }}>
                Profile Summary
              </div>
              {[["Name", studentData.name], ["Email", studentData.email], ["Branch", studentData.branch], ["University", studentData.university]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${theme.BD}`, fontSize: 13, fontFamily: F }}>
                  <span style={{ color: theme.TX2 }}>{k}</span>
                  <span style={{ color: theme.TX1, fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </PageWrap>
      </>
    );
  }

  return (
    <>
      <Sidebar
        items={navItems}
        active={view}
        onNav={setView}
        user={{ ...user, role: `${studentData.branch} · Sem ${studentData.semester}` }}
        onLogout={onLogout}
      />
      <PageWrap>
        {view === "overview"      && <StudentOverview      student={studentData} assignments={myAssignments} />}
        {view === "profile"       && <StudentProfile       student={studentData} />}
        {view === "attendance"    && <StudentAttendance    student={studentData} />}
        {view === "assignments"   && <StudentAssignments   student={studentData} assignments={myAssignments} setAssignments={setAssignments} />}
        {view === "notifications" && <StudentNotifications student={studentData} updateStudent={updateStudent} />}
      </PageWrap>
    </>
  );
}