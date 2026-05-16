import { useState, useCallback, useEffect } from "react";
import { INIT_STUDENTS, INIT_TEACHERS, INIT_ASSIGNMENTS } from "./constants/data";
import LoginPage   from "./modules/auth/LoginPage";
import AdminApp    from "./modules/admin/AdminApp";
import TeacherApp  from "./modules/teacher/TeacherApp";
import StudentApp  from "./modules/student/StudentApp";
import ChatButton  from "./components/chat/ChatButton";
import ChatPanel   from "./components/chat/ChatPanel";
import { useTheme } from "./context/ThemeContext";
import { BLU, F } from "./constants/theme";

const load = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  const { theme } = useTheme();

  const [students,    setStudentsRaw]    = useState(() => load("ams_students",    INIT_STUDENTS));
  const [teachers,    setTeachersRaw]    = useState(() => load("ams_teachers",    INIT_TEACHERS));
  const [assignments, setAssignmentsRaw] = useState(() => load("ams_assignments", INIT_ASSIGNMENTS));
  const [user,        setUser]           = useState(null);
  const [chatOpen,    setChatOpen]       = useState(false);

  useEffect(() => { localStorage.setItem("ams_students",    JSON.stringify(students));    }, [students]);
  useEffect(() => { localStorage.setItem("ams_teachers",    JSON.stringify(teachers));    }, [teachers]);
  useEffect(() => { localStorage.setItem("ams_assignments", JSON.stringify(assignments)); }, [assignments]);

  const setStudents    = useCallback((v) => setStudentsRaw(v),    []);
  const setTeachers    = useCallback((v) => setTeachersRaw(v),    []);
  const setAssignments = useCallback((v) => setAssignmentsRaw(v), []);

  const login  = useCallback((userData) => setUser(userData), []);
  const logout = useCallback(() => { setUser(null); setChatOpen(false); }, []);

  const resetData = useCallback(() => {
    if (confirm("Reset all data to original? This cannot be undone.")) {
      localStorage.removeItem("ams_students");
      localStorage.removeItem("ams_teachers");
      localStorage.removeItem("ams_assignments");
      setStudentsRaw(INIT_STUDENTS);
      setTeachersRaw(INIT_TEACHERS);
      setAssignmentsRaw(INIT_ASSIGNMENTS);
    }
  }, []);

  return (
    <div style={{ fontFamily: F, background: theme.BG, minHeight: "100vh", color: theme.TX1, transition: "background 0.3s, color 0.3s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: ${theme.SRF}; }
        ::-webkit-scrollbar-thumb { background: ${theme.BD2}; border-radius: 2px; }
        input, select, textarea, button { font-family: ${F}; }
        input[type=range] { accent-color: ${BLU}; }
        * { transition: background-color 0.2s, border-color 0.2s, color 0.2s; }
      `}</style>

      {!user && (
        <LoginPage
          onLogin={login}
          students={students}
          teachers={teachers}
          setStudents={setStudents}
        />
      )}

      {user?.role === "admin" && (
        <AdminApp
          user={user}
          students={students}
          teachers={teachers}
          assignments={assignments}
          setStudents={setStudents}
          setTeachers={setTeachers}
          setAssignments={setAssignments}
          onLogout={logout}
          resetData={resetData}
        />
      )}

      {user?.role === "teacher" && (
        <TeacherApp
          user={user}
          students={students}
          teachers={teachers}
          assignments={assignments}
          setStudents={setStudents}
          setAssignments={setAssignments}
          onLogout={logout}
        />
      )}

      {user?.role === "student" && (
        <StudentApp
          user={user}
          students={students}
          assignments={assignments}
          setStudents={setStudents}
          setAssignments={setAssignments}
          onLogout={logout}
        />
      )}

      {user && (
        <>
          <ChatButton open={chatOpen} onClick={() => setChatOpen(o => !o)} />
          {chatOpen && (
            <ChatPanel
              user={user}
              students={students}
              teachers={teachers}
              assignments={assignments}
              onClose={() => setChatOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
}