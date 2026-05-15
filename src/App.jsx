import { useState, useCallback } from "react";
import { BG, F } from "./constants/theme";
import { INIT_STUDENTS, INIT_TEACHERS, INIT_ASSIGNMENTS } from "./constants/data";
import LoginPage   from "./modules/auth/LoginPage";
import AdminApp    from "./modules/admin/AdminApp";
import TeacherApp  from "./modules/teacher/TeacherApp";
import StudentApp  from "./modules/student/StudentApp";
import ChatButton  from "./components/chat/ChatButton";
import ChatPanel   from "./components/chat/ChatPanel";
import { SRF, BD2, BLU } from "./constants/theme";

export default function App() {
  const [students,    setStudents]    = useState(INIT_STUDENTS);
  const [teachers,    setTeachers]    = useState(INIT_TEACHERS);
  const [assignments, setAssignments] = useState(INIT_ASSIGNMENTS);
  const [user,        setUser]        = useState(null);
  const [chatOpen,    setChatOpen]    = useState(false);

  const login  = useCallback((userData) => setUser(userData), []);
  const logout = useCallback(() => { setUser(null); setChatOpen(false); }, []);

  return (
    <div style={{ fontFamily: F, background: BG, minHeight: "100vh", color: "#dde8f8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: ${SRF}; }
        ::-webkit-scrollbar-thumb { background: ${BD2}; border-radius: 2px; }
        input, select, textarea, button { font-family: ${F}; }
        input[type=range] { accent-color: ${BLU}; }
      `}</style>

      {!user && <LoginPage onLogin={login} students={students} teachers={teachers} setStudents={setStudents} />}

      {user?.role === "admin" && (
        <AdminApp user={user} students={students} teachers={teachers} assignments={assignments}
          setStudents={setStudents} setTeachers={setTeachers} setAssignments={setAssignments} onLogout={logout} />
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
          {chatOpen && <ChatPanel user={user} students={students} teachers={teachers} assignments={assignments} onClose={() => setChatOpen(false)} />}
        </>
      )}
    </div>
  );
}