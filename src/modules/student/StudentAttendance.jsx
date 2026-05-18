import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { GRN, AMB, RED, F, FM } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import PageHeader from "../../components/layout/PageHeader";
import Grid from "../../components/ui/Grid";

export default function StudentAttendance({ student }) {
  const { theme, isDark } = useTheme();

  const att     = student.attendance || {};
  const entries = Object.entries(att);
  const attData = entries.map(([sub, val]) => ({
    subject: sub,
    attendance: val,
    fill: val >= 85 ? GRN : val >= 75 ? AMB : RED,
  }));

  const tooltipStyle = {
    background: theme.CRD2,
    border: `1px solid ${theme.BD2}`,
    borderRadius: 8,
    fontSize: 12,
    color: theme.TX1,
  };

  return (
    <>
      <PageHeader title="My Attendance" sub="Subject-wise attendance tracking" />

      {/* ── Metric Cards ── */}
      <Grid cols={4}>
        {entries.map(([sub, val]) => {
          const color = val >= 85 ? GRN : val >= 75 ? AMB : RED;
          return (
            <div key={sub} style={{
              background: theme.CRD,
              border: `1px solid ${val >= 75 ? theme.BD : RED + "55"}`,
              borderRadius: 10,
              padding: 16,
              borderLeft: `3px solid ${color}`,
              boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
            }}>
              <div style={{ fontSize: 11, color: theme.TX2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8, fontFamily: F }}>
                {sub}
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: FM, color }}>
                {val}%
              </div>
              <div style={{ fontSize: 10, color: theme.TX3, marginTop: 4, fontFamily: F }}>
                {val >= 75 ? "✓ Eligible" : "⚠ Below cutoff"}
              </div>
              <div style={{ height: 4, background: theme.BD, borderRadius: 2, marginTop: 10 }}>
                <div style={{ height: "100%", width: `${val}%`, background: color, borderRadius: 2, transition: "width 0.8s ease" }} />
              </div>
            </div>
          );
        })}
      </Grid>

      {/* ── Bar Chart ── */}
      {entries.length > 0 && (
        <div style={{
          background: theme.CRD,
          border: `1px solid ${theme.BD}`,
          borderRadius: 12,
          padding: 20,
          boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.TX1, marginBottom: 16, fontFamily: F }}>
            Attendance Chart
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={attData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.BD} vertical={false} />
              <XAxis dataKey="subject"  tick={{ fill: theme.TX2, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]}  tick={{ fill: theme.TX2, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{ color: theme.TX2 }}
                cursor={{ fill: theme.BD + "44" }}
              />
              <Bar dataKey="attendance" radius={[6, 6, 0, 0]}>
                {attData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div style={{ display: "flex", gap: 16, marginTop: 12, justifyContent: "center" }}>
            {[[GRN, "≥85% Excellent"], [AMB, "75-84% Good"], [RED, "<75% Low"]].map(([c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: theme.TX2, fontFamily: F }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
                {l}
              </div>
            ))}
          </div>
        </div>
      )}

      {entries.length === 0 && (
        <div style={{
          color: theme.TX2,
          fontSize: 14,
          fontFamily: F,
          textAlign: "center",
          padding: 40,
          background: theme.CRD,
          borderRadius: 12,
          border: `1px solid ${theme.BD}`,
        }}>
          No attendance records available yet.
        </div>
      )}
    </>
  );
}