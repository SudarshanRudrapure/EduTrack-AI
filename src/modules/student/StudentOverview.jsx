import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
// eslint-disable-next-line no-unused-vars
import { CRD, CRD2, SRF, BD, BLU, GRN, AMB, RED, TX1, TX2, TX3, F } from "../../constants/theme";
import PageHeader from "../../components/layout/PageHeader";
import StatCard from "../../components/ui/StatCard";
import Grid from "../../components/ui/Grid";

export default function StudentOverview({ student, assignments }) {
  const attValues  = Object.values(student.attendance || {});
  const avgAttVal  = attValues.length ? Math.round(attValues.reduce((a, b) => a + b, 0) / attValues.length) : 0;
  const lowSubs    = Object.entries(student.attendance || {}).filter(([, v]) => v < 75);
  const mySubmissions = assignments.map(a => ({ ...a, mySubmission: a.submissions.find(s => s.studentId === student.id) }));
  const pending    = mySubmissions.filter(a => !a.mySubmission);
  const sgpaData   = (student.sgpaHist || []).map((v, i) => ({ sem: `S${i + 1}`, sgpa: v }));

  return (
    <>
      <PageHeader title={`Hello, ${student.name.split(" ")[0]}! 👋`} sub={`${student.branch} · ${student.specialization || "General"} · Semester ${student.semester}`} />
      <Grid cols={4}>
        <StatCard label="CGPA"                value={student.cgpa}         sub={`SGPA: ${student.sgpa}`}                          color={BLU} icon="📊" />
        <StatCard label="Avg Attendance"      value={`${avgAttVal}%`}      sub={avgAttVal >= 75 ? "✓ Good standing" : "⚠ Below threshold"} color={avgAttVal >= 75 ? GRN : RED} icon="📋" />
        <StatCard label="Backlogs"            value={student.backlogs}     sub={student.backlogs === 0 ? "Clear record" : "Active KTs"}    color={student.backlogs === 0 ? GRN : RED} icon="⚠️" />
        <StatCard label="Pending Assignments" value={pending.length}       sub="Require submission"                                color={AMB} icon="📝" />
      </Grid>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18 }}>
        <div style={{ background: CRD, border: `1px solid ${BD}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TX1, marginBottom: 14, fontFamily: F }}>SGPA Progression</div>
          {sgpaData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={sgpaData}>
                <defs>
                  <linearGradient id="sgpaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={BLU} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={BLU} stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={BD} vertical={false} />
                <XAxis dataKey="sem"  tick={{ fill: TX2, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[5, 10]} tick={{ fill: TX2, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: CRD2, border: `1px solid #1e3558`, borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="sgpa" stroke={BLU} strokeWidth={2} fill="url(#sgpaGrad)" dot={{ fill: BLU, r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : <div style={{ color: TX2, fontSize: 13, padding: 20, textAlign: "center", fontFamily: F }}>No SGPA history available.</div>}
        </div>

        <div style={{ background: CRD, border: `1px solid ${BD}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TX1, marginBottom: 14, fontFamily: F }}>Quick Status</div>
          {lowSubs.length > 0 && (
            <div style={{ background: "#450a0a", border: "1px solid #7f1d1d", borderRadius: 8, padding: 10, marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: RED, marginBottom: 6, fontFamily: F }}>⚠ Low Attendance</div>
              {lowSubs.map(([sub, val]) => <div key={sub} style={{ fontSize: 11, color: "#fca5a5", fontFamily: F }}>• {sub}: {val}%</div>)}
            </div>
          )}
          {pending.length > 0 && (
            <div style={{ background: "#451a03", border: "1px solid #78350f", borderRadius: 8, padding: 10, marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: AMB, marginBottom: 6, fontFamily: F }}>📝 Pending Assignments</div>
              {pending.slice(0, 3).map(a => <div key={a.id} style={{ fontSize: 11, color: "#fcd34d", fontFamily: F }}>• {a.title}</div>)}
            </div>
          )}
          {lowSubs.length === 0 && pending.length === 0 && (
            <div style={{ background: "#064e3b", border: "1px solid #065f46", borderRadius: 8, padding: 12, textAlign: "center", color: GRN, fontSize: 13, fontFamily: F }}>
              ✅ All good! Attendance and assignments on track.
            </div>
          )}
          <div style={{ marginTop: 14, padding: 12, background: SRF, borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: TX2, marginBottom: 4, fontFamily: F }}>Academic Standing</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: student.cgpa >= 8.5 ? GRN : student.cgpa >= 6.5 ? AMB : RED, fontFamily: F }}>
              {student.cgpa >= 8.5 ? "🏆 Distinction" : student.cgpa >= 6.5 ? "✅ First Class" : "⚠ Requires Improvement"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}