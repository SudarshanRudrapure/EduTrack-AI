import { CRD, BD, BLU, GRN, AMB, RED, TX1, TX2, TX3, FM, F } from "../../constants/theme";
import PageHeader from "../../components/layout/PageHeader";
import StatCard from "../../components/ui/StatCard";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import Grid from "../../components/ui/Grid";
import { lowAttendance } from "../../utils/helpers";

export default function TeacherOverview({ teacher, students, assignments }) {
  const approved = students.filter(s => s.status === "approved");
  const pending  = students.filter(s => s.status === "pending");
  const lowAtt   = approved.filter(lowAttendance);
  const topPerf  = [...approved].sort((a, b) => b.cgpa - a.cgpa).slice(0, 4);

  return (
    <>
      <PageHeader title={`Welcome, ${teacher.name.split(" ")[0]}`} sub={`${teacher.department} Department — ${teacher.subjects.join(", ")}`} />
      <Grid cols={4}>
        <StatCard label="My Students"  value={students.length}    sub={`${approved.length} approved`} color={BLU} icon="🎓" />
        <StatCard label="Pending"      value={pending.length}     sub="Awaiting approval"             color={AMB} icon="⏳" />
        <StatCard label="Low Attendance" value={lowAtt.length}   sub="Below 75%"                     color={RED} icon="⚠️" />
        <StatCard label="Assignments"  value={assignments.length} sub="Active this semester"          color={GRN} icon="📝" />
      </Grid>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>
        <div style={{ background: CRD, border: `1px solid ${BD}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TX1, marginBottom: 14 }}>🏆 Top Students</div>
          {topPerf.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < topPerf.length - 1 ? `1px solid ${BD}` : "none" }}>
              <div style={{ fontFamily: FM, color: i < 3 ? AMB : TX3, fontWeight: 700, width: 20 }}>#{i + 1}</div>
              <Avatar name={s.name} size={32} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: TX1, fontWeight: 500, fontFamily: F }}>{s.name}</div>
                <div style={{ fontSize: 11, color: TX2, fontFamily: F }}>{s.usn} · Sem {s.semester}</div>
              </div>
              <div>
                <div style={{ fontFamily: FM, color: GRN, fontWeight: 700, fontSize: 14 }}>{s.cgpa}</div>
                <div style={{ fontSize: 10, color: TX3, textAlign: "right" }}>CGPA</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: CRD, border: `1px solid ${BD}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TX1, marginBottom: 14 }}>📝 Recent Assignments</div>
          {assignments.slice(0, 4).map(a => (
            <div key={a.id} style={{ padding: "10px 0", borderBottom: `1px solid ${BD}` }}>
              <div style={{ fontSize: 13, color: TX1, fontWeight: 500, marginBottom: 4, fontFamily: F }}>{a.title}</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Badge color={BLU} bg={BLU + "18"}>{a.subject}</Badge>
                <span style={{ fontSize: 11, color: TX2 }}>Due: {a.dueDate}</span>
              </div>
              <div style={{ fontSize: 11, color: TX2, marginTop: 4 }}>{a.submissions.length} submission(s)</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}