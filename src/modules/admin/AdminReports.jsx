import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { BLU, GRN, AMB, RED, FM } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { BRANCHES, BCOL } from "../../constants/branches";
import { avg, avgAtt, lowAttendance } from "../../utils/helpers";
import PageHeader from "../../components/layout/PageHeader";
import Badge from "../../components/ui/Badge";

export default function AdminReports({ students }) {
  const { theme, isDark } = useTheme();

  const cgpaByBranch = BRANCHES.map(b => {
    const bs = students.filter(s => s.branch === b && s.cgpa > 0);
    return { branch: b, avgCGPA: bs.length ? +avg(bs.map(s => s.cgpa)).toFixed(1) : 0 };
  });

  const attByBranch = BRANCHES.map(b => {
    const bs   = students.filter(s => s.branch === b);
    const atts = bs.map(s => avgAtt(s)).filter(Boolean);
    return { branch: b, avgAtt: atts.length ? Math.round(avg(atts)) : 0 };
  });

  const cardStyle = {
    background: theme.CRD,
    border: `1px solid ${theme.BD}`,
    borderRadius: 12,
    padding: 20,
    boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
  };

  const tooltipStyle = {
    background: theme.CRD2,
    border: `1px solid ${theme.BD2}`,
    borderRadius: 8,
    fontSize: 12,
    color: theme.TX1,
  };

  return (
    <>
      <PageHeader title="Reports & Analytics" sub="Branch-wise academic performance insights" />

      {/* ── Charts Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 20 }}>

        {/* CGPA Chart */}
        <div style={cardStyle}>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.TX1, marginBottom: 16 }}>
            Average CGPA by Branch
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cgpaByBranch} barSize={30}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.BD} vertical={false} />
              <XAxis dataKey="branch" tick={{ fill: theme.TX2, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fill: theme.TX2, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{ color: theme.TX2 }}
                cursor={{ fill: theme.BD + "44" }}
              />
              <Bar dataKey="avgCGPA" radius={[6, 6, 0, 0]}>
                {cgpaByBranch.map((e, i) => <Cell key={i} fill={BCOL[e.branch]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Chart */}
        <div style={cardStyle}>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.TX1, marginBottom: 16 }}>
            Average Attendance by Branch
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attByBranch} barSize={30}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.BD} vertical={false} />
              <XAxis dataKey="branch" tick={{ fill: theme.TX2, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: theme.TX2, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{ color: theme.TX2 }}
                cursor={{ fill: theme.BD + "44" }}
              />
              <Bar dataKey="avgAtt" fill={GRN} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Summary Table ── */}
      <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${theme.BD}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.TX1 }}>
            Branch-wise Summary Table
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: isDark ? theme.CRD2 : theme.BG, borderBottom: `2px solid ${theme.BD}` }}>
              {["Branch", "Students", "Avg CGPA", "Avg Att%", "Backlogs", "Low Att"].map(h => (
                <th key={h} style={{
                  padding: "12px 14px",
                  textAlign: "left",
                  fontSize: 11,
                  color: theme.TX3,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BRANCHES.map((b, i) => {
              const bs       = students.filter(s => s.branch === b);
              const approved = bs.filter(s => s.status === "approved");
              return (
                <tr key={b} style={{
                  borderBottom: `1px solid ${theme.BD}`,
                  background: i % 2 === 0 ? "transparent" : isDark ? theme.SRF + "55" : theme.BG,
                }}>
                  <td style={{ padding: "12px 14px" }}>
                    <Badge color={BCOL[b]} bg={BCOL[b] + "18"}>{b}</Badge>
                  </td>
                  <td style={{ padding: "12px 14px", color: theme.TX1, fontFamily: FM }}>
                    {bs.length}
                  </td>
                  <td style={{ padding: "12px 14px", color: GRN, fontFamily: FM, fontWeight: 700 }}>
                    {avg(approved.map(s => s.cgpa)) || "—"}
                  </td>
                  <td style={{ padding: "12px 14px", color: BLU, fontFamily: FM }}>
                    {Math.round(avg(approved.map(s => avgAtt(s)).filter(Boolean))) || "—"}%
                  </td>
                  <td style={{ padding: "12px 14px", color: AMB, fontFamily: FM }}>
                    {approved.reduce((a, s) => a + s.backlogs, 0)}
                  </td>
                  <td style={{ padding: "12px 14px", color: RED, fontFamily: FM }}>
                    {approved.filter(lowAttendance).length}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}