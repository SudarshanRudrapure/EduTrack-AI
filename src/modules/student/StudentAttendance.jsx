import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { CRD, CRD2, BD, BD2, GRN, AMB, RED, TX1, TX2, TX3, F } from "../../constants/theme";
import PageHeader from "../../components/layout/PageHeader";
import Grid from "../../components/ui/Grid";

export default function StudentAttendance({ student }) {
  const att     = student.attendance || {};
  const entries = Object.entries(att);
  const attData = entries.map(([sub, val]) => ({ subject: sub, attendance: val, fill: val >= 85 ? GRN : val >= 75 ? AMB : RED }));

  return (
    <>
      <PageHeader title="My Attendance" sub="Subject-wise attendance tracking" />
      <Grid cols={4}>
        {entries.map(([sub, val]) => (
          <div key={sub} style={{ background: CRD, border: `1px solid ${val >= 75 ? BD : RED + "44"}`, borderRadius: 10, padding: 16, borderLeft: `3px solid ${val >= 85 ? GRN : val >= 75 ? AMB : RED}` }}>
            <div style={{ fontSize: 11, color: TX2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8, fontFamily: F }}>{sub}</div>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: val >= 85 ? GRN : val >= 75 ? AMB : RED }}>{val}%</div>
            <div style={{ fontSize: 10, color: TX3, marginTop: 4, fontFamily: F }}>{val >= 75 ? "✓ Eligible" : "⚠ Below cutoff"}</div>
            <div style={{ height: 4, background: BD, borderRadius: 2, marginTop: 10 }}>
              <div style={{ height: "100%", width: `${val}%`, background: val >= 85 ? GRN : val >= 75 ? AMB : RED, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </Grid>

      {entries.length > 0 && (
        <div style={{ background: CRD, border: `1px solid ${BD}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TX1, marginBottom: 16, fontFamily: F }}>Attendance Chart</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={attData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke={BD} vertical={false} />
              <XAxis dataKey="subject"    tick={{ fill: TX2, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]}   tick={{ fill: TX2, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: CRD2, border: `1px solid ${BD2}`, borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="attendance" radius={[6, 6, 0, 0]}>
                {attData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, marginTop: 12, justifyContent: "center" }}>
            {[[GRN, "≥85% Excellent"], [AMB, "75-84% Good"], [RED, "<75% Low"]].map(([c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: TX2, fontFamily: F }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />{l}
              </div>
            ))}
          </div>
        </div>
      )}
      {entries.length === 0 && <div style={{ color: TX2, fontSize: 14, fontFamily: F }}>No attendance records available yet.</div>}
    </>
  );
}