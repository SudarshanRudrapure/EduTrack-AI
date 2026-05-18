import { useState, useCallback, useEffect } from "react";
import { INIT_STUDENTS, INIT_TEACHERS, INIT_ASSIGNMENTS } from "./constants/data";
import { getStudents, getTeachers, getAssignments } from "./services/spService";
import LoginPage   from "./modules/auth/LoginPage";
import AdminApp    from "./modules/admin/AdminApp";
import TeacherApp  from "./modules/teacher/TeacherApp";
import StudentApp  from "./modules/student/StudentApp";
import ChatButton  from "./components/chat/ChatButton";
import ChatPanel   from "./components/chat/ChatPanel";
import { useTheme } from "./context/ThemeContext";
import { BLU, F } from "./constants/theme";

export default function App() {
  const { theme, isDark } = useTheme();

  const [students,    setStudentsRaw]    = useState(INIT_STUDENTS);
  const [teachers,    setTeachersRaw]    = useState(INIT_TEACHERS);
  const [assignments, setAssignmentsRaw] = useState(INIT_ASSIGNMENTS);
  const [user,        setUser]           = useState(null);
  const [chatOpen,    setChatOpen]       = useState(false);
  const [spLoaded,    setSpLoaded]       = useState(false);

  // ── Load data from SharePoint on app start ──────────────────────
  useEffect(() => {
    const loadFromSP = async () => {
      try {
        const [spStudents, spTeachers, spAssignments] = await Promise.all([
          getStudents(),
          getTeachers(),
          getAssignments(),
        ]);
        if (spStudents.length    > 0) setStudentsRaw(spStudents);
        if (spTeachers.length    > 0) setTeachersRaw(spTeachers);
        if (spAssignments.length > 0) setAssignmentsRaw(spAssignments);
        setSpLoaded(true);
        console.log("✅ Loaded from SharePoint");
      } catch (err) {
        console.error("❌ SharePoint load failed, using local data", err);
        setSpLoaded(true);
      }
    };
    loadFromSP();
  }, []);

  const setStudents    = useCallback((v) => setStudentsRaw(v),    []);
  const setTeachers    = useCallback((v) => setTeachersRaw(v),    []);
  const setAssignments = useCallback((v) => setAssignmentsRaw(v), []);
  const login          = useCallback((u) => setUser(u), []);
  const logout         = useCallback(() => { setUser(null); setChatOpen(false); }, []);

  const resetData = useCallback(() => {
    if (confirm("Reset all data to original? This cannot be undone.")) {
      setStudentsRaw(INIT_STUDENTS);
      setTeachersRaw(INIT_TEACHERS);
      setAssignmentsRaw(INIT_ASSIGNMENTS);
    }
  }, []);

  // ── Show loading screen while SharePoint loads ──────────────────
  if (!spLoaded) {
    return (
      <div style={{
        fontFamily: F,
        background: "#0f172a",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        gap: 16,
      }}>
        <div style={{ fontSize: 32 }}>⏳</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Loading EduTrack AI...</div>
        <div style={{ fontSize: 13, color: "#94a3b8" }}>Connecting to SharePoint</div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: F, background: theme.BG, minHeight: "100vh", color: theme.TX1 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: ${theme.BG} !important;
          color: ${theme.TX1} !important;
        }

        /* smooth theme transitions */
        *, *::before, *::after {
          transition:
            background-color 0.25s ease,
            border-color     0.25s ease,
            color            0.15s ease,
            box-shadow       0.25s ease !important;
        }

        /* scrollbar */
        ::-webkit-scrollbar       { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: ${theme.BG}; }
        ::-webkit-scrollbar-thumb { background: ${theme.BD2}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: ${theme.TX3}; }

        /* inputs, selects */
        input, select, textarea, button { font-family: ${F}; }
        input[type=range] { accent-color: ${BLU}; }

        /* placeholder color */
        ::placeholder { color: ${theme.TX3}; opacity: 1; }

        /* select option background fix for light mode */
        select option {
          background: ${theme.SRF};
          color: ${theme.TX1};
        }

        /* table row hover */
        tr:hover td { background: ${theme.BD}22 !important; }

        /* focus ring */
        input:focus, select:focus, textarea:focus {
          border-color: ${BLU} !important;
          box-shadow: 0 0 0 3px ${BLU}22 !important;
        }

        /* light mode card shadow */
        ${!isDark ? `
          .card-shadow {
            box-shadow: 0 1px 4px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04);
          }
        ` : ""}
      `}</style>

      {!user && (
        <LoginPage onLogin={login} students={students} teachers={teachers} setStudents={setStudents} />
      )}
      {user?.role === "admin" && (
        <AdminApp user={user} students={students} teachers={teachers} assignments={assignments}
          setStudents={setStudents} setTeachers={setTeachers} setAssignments={setAssignments}
          onLogout={logout} resetData={resetData} />
      )}
      {user?.role === "teacher" && (
        <TeacherApp user={user} students={students} teachers={teachers} assignments={assignments}
          setStudents={setStudents} setAssignments={setAssignments} onLogout={logout} />
      )}
      {user?.role === "student" && (
        <StudentApp user={user} students={students} assignments={assignments}
          setStudents={setStudents} setAssignments={setAssignments} onLogout={logout} />
      )}
      {user && (
        <>
          <ChatButton open={chatOpen} onClick={() => setChatOpen(o => !o)} />
          {chatOpen && (
            <ChatPanel user={user} students={students} teachers={teachers}
              assignments={assignments} onClose={() => setChatOpen(false)} />
          )}
        </>
      )}
    </div>
  );
}