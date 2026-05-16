import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { BLU, GRN, AMB, RED, F } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import PageHeader from "../../components/layout/PageHeader";
import StatCard from "../../components/ui/StatCard";
import Grid from "../../components/ui/Grid";

export default function StudentOverview({ student, assignments }) {
  const { theme, isDark } = useTheme();

  const attValues     = Object.values(student.attendance || {});
  const avgAttVal     = attValues.length ? Math.round(attValues.reduce((a, b) => a + b, 0) / attValues.length) : 0;
  const lowSubs       = Object.entries(student.attendance || {}).filter(([, v]) => v < 75);
  const mySubmissions = assignments.map(a => ({ ...a, mySubmission: a.submissions.find(s => s.studentId === student.id) }));
  const pending       = mySubmissions.filter(a => !a.mySubmission);
  const sgpaData      = (student.sgpaHist || []).map((v, i) => ({ sem: `S${i + 1}`, sgpa: v }));

  return (
    <>
      <PageHeader
        title={`Hello, ${student.name.split(" ")[0]}! 👋`}
        sub={`${student.branch} · ${student.specialization || "General"} · Semester ${student.semester}`}
      />

      <Grid cols={4}>
        <StatCard label="CGPA"                value={student.cgpa}     sub={`SGPA: ${student.sgpa}`}                                        color={BLU} icon="📊" />
        <StatCard label="Avg Attendance"      value={`${avgAttVal}%`}  sub={avgAttVal >= 75 ? "✓ Good standing" : "⚠ Below threshold"}      color={avgAttVal >= 75 ? GRN : RED} icon="📋" />
        <StatCard label="Backlogs"            value={student.backlogs} sub={student.backlogs === 0 ? "Clear record" : "Active KTs"}          color={student.backlogs === 0 ? GRN : RED} icon="⚠️" />
        <StatCard label="Pending Assignments" value={pending.length}   sub="Require submission"                                              color={AMB} icon="📝" />
      </Grid>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18 }}>

        {/* SGPA Chart */}
        <div style={{
          background: theme.CRD,
          border: `1px solid ${theme.BD}`,
          borderRadius: 12,
          padding: 20,
          boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.TX1, marginBottom: 14, fontFamily: F }}>
            SGPA Progression
          </div>
          {sgpaData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={sgpaData}>
                <defs>
                  <linearGradient id="sgpaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={BLU} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={BLU} stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.BD} vertical={false} />
                <XAxis dataKey="sem"    tick={{ fill: theme.TX2, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[5, 10]} tick={{ fill: theme.TX2, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: theme.CRD2,
                    border: `1px solid ${theme.BD2}`,
                    borderRadius: 8,
                    fontSize: 12,
                    color: theme.TX1,
                  }}
                  labelStyle={{ color: theme.TX2 }}
                />
                <Area type="monotone" dataKey="sgpa" stroke={BLU} strokeWidth={2} fill="url(#sgpaGrad)" dot={{ fill: BLU, r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ color: theme.TX2, fontSize: 13, padding: 20, textAlign: "center", fontFamily: F }}>
              No SGPA history available.
            </div>
          )}
        </div>

        {/* Quick Status */}
        <div style={{
          background: theme.CRD,
          border: `1px solid ${theme.BD}`,
          borderRadius: 12,
          padding: 20,
          boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.TX1, marginBottom: 14, fontFamily: F }}>
            Quick Status
          </div>

          {/* Low attendance alert */}
          {lowSubs.length > 0 && (
            <div style={{
              background: isDark ? "#450a0a" : "#fee2e2",
              border: `1px solid ${isDark ? "#7f1d1d" : "#fca5a5"}`,
              borderRadius: 8,
              padding: 10,
              marginBottom: 12,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: RED, marginBottom: 6, fontFamily: F }}>
                ⚠ Low Attendance
              </div>
              {lowSubs.map(([sub, val]) => (
                <div key={sub} style={{ fontSize: 11, color: isDark ? "#fca5a5" : "#b91c1c", fontFamily: F }}>
                  • {sub}: {val}%
                </div>
              ))}
            </div>
          )}

          {/* Pending assignments alert */}
          {pending.length > 0 && (
            <div style={{
              background: isDark ? "#451a03" : "#fef3c7",
              border: `1px solid ${isDark ? "#78350f" : "#fcd34d"}`,
              borderRadius: 8,
              padding: 10,
              marginBottom: 12,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: AMB, marginBottom: 6, fontFamily: F }}>
                📝 Pending Assignments
              </div>
              {pending.slice(0, 3).map(a => (
                <div key={a.id} style={{ fontSize: 11, color: isDark ? "#fcd34d" : "#92400e", fontFamily: F }}>
                  • {a.title}
                </div>
              ))}
            </div>
          )}

          {/* All good */}
          {lowSubs.length === 0 && pending.length === 0 && (
            <div style={{
              background: isDark ? "#064e3b" : "#d1fae5",
              border: `1px solid ${isDark ? "#065f46" : "#6ee7b7"}`,
              borderRadius: 8,
              padding: 12,
              textAlign: "center",
              color: isDark ? GRN : "#065f46",
              fontSize: 13,
              fontFamily: F,
            }}>
              ✅ All good! Attendance and assignments on track.
            </div>
          )}

          {/* Academic Standing */}
          <div style={{
            marginTop: 14,
            padding: 12,
            background: isDark ? theme.SRF : theme.BG,
            borderRadius: 8,
            border: `1px solid ${theme.BD}`,
          }}>
            <div style={{ fontSize: 11, color: theme.TX3, marginBottom: 5, fontFamily: F, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>
              Academic Standing
            </div>
            <div style={{
              fontSize: 15,
              fontWeight: 700,
              color: student.cgpa >= 8.5 ? GRN : student.cgpa >= 6.5 ? AMB : RED,
              fontFamily: F,
            }}>
              {student.cgpa >= 8.5 ? "🏆 Distinction" : student.cgpa >= 6.5 ? "✅ First Class" : "⚠ Requires Improvement"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}