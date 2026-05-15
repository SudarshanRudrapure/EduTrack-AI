import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import PageWrap from "../../components/layout/PageWrap";
import AdminOverview from "./AdminOverview";
import AdminStudents from "./AdminStudents";
import AdminTeachers from "./AdminTeachers";
import AdminReports from "./AdminReports";
import AdminSettings from "./AdminSettings";

// eslint-disable-next-line no-unused-vars
export default function AdminApp({ user, students, teachers, assignments, setStudents, setTeachers, setAssignments, onLogout }) {
  const [view, setView] = useState("overview");

  const navItems = [
    { id: "overview",  icon: "📊", label: "Overview"  },
    { id: "students",  icon: "🎓", label: "Students"  },
    { id: "teachers",  icon: "👨‍🏫", label: "Teachers"  },
    { id: "reports",   icon: "📈", label: "Reports"   },
    { id: "settings",  icon: "⚙️", label: "Settings"  },
  ];

  return (
    <>
      <Sidebar items={navItems} active={view} onNav={setView} user={{ ...user, role: "Administrator" }} onLogout={onLogout} />
      <PageWrap>
        {view === "overview" && <AdminOverview students={students} teachers={teachers} assignments={assignments} />}
        {view === "students" && <AdminStudents students={students} teachers={teachers} setStudents={setStudents} />}
        {view === "teachers" && <AdminTeachers teachers={teachers} setTeachers={setTeachers} students={students} />}
        {view === "reports"  && <AdminReports  students={students} assignments={assignments} />}
        {view === "settings" && <AdminSettings />}
      </PageWrap>
    </>
  );
}