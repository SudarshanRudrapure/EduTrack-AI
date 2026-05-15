import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import PageWrap from "../../components/layout/PageWrap";
import TeacherOverview    from "./TeacherOverview";
import TeacherStudents    from "./TeacherStudents";
import TeacherApprovals   from "./TeacherApprovals";
import TeacherAttendance  from "./TeacherAttendance";
import TeacherAssignments from "./TeacherAssignments";
import TeacherReports     from "./TeacherReports";

export default function TeacherApp({ user, students, assignments, setStudents, setAssignments, onLogout }) {
  const [view, setView] = useState("overview");
  const myStudents  = students.filter(s => s.teacherId === user.data.id);
  const pendingCount = myStudents.filter(s => s.status === "pending").length;

  const navItems = [
    { id: "overview",    icon: "📊", label: "Overview"    },
    { id: "students",    icon: "🎓", label: "My Students"  },
    { id: "approvals",   icon: "✅", label: "Approvals",   badge: pendingCount || null },
    { id: "attendance",  icon: "📋", label: "Attendance"   },
    { id: "assignments", icon: "📝", label: "Assignments"  },
    { id: "reports",     icon: "📈", label: "Reports"      },
  ];

  return (
    <>
      <Sidebar items={navItems} active={view} onNav={setView} user={{ ...user, role: `${user.data.department} Dept.` }} onLogout={onLogout} />
      <PageWrap>
        {view === "overview"    && <TeacherOverview    teacher={user.data} students={myStudents} assignments={assignments.filter(a => a.teacherId === user.data.id)} />}
        {view === "students"    && <TeacherStudents    students={myStudents} />}
        {view === "approvals"   && <TeacherApprovals   students={myStudents} setStudents={setStudents} />}
        {view === "attendance"  && <TeacherAttendance  students={myStudents} setStudents={setStudents} />}
        {view === "assignments" && <TeacherAssignments teacher={user.data} assignments={assignments.filter(a => a.teacherId === user.data.id)} setAssignments={setAssignments} students={myStudents} />}
        {view === "reports"     && <TeacherReports     students={myStudents} />}
      </PageWrap>
    </>
  );
}