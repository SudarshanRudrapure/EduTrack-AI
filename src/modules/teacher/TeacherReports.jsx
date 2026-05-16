import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { BLU, GRN, RED, F } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { avg, avgAtt } from "../../utils/helpers";
import PageHeader from "../../components/layout/PageHeader";
import StatCard from "../../components/ui/StatCard";
import Grid from "../../components/ui/Grid";

export default function TeacherReports({ students }) {
  const { theme, isDark } = useTheme();

  const approved = students.filter(s => s.status === "approved");
  const semData  = Array.from(new Set(approved.map(s => s.semester))).sort().map(sem => ({
    semester: `Sem ${sem}`,
    count:    approved.filter(s => s.semester === sem).length,
    avgCGPA:  +avg(approved.filter(s => s.semester === sem).map(s => s.cgpa)).toFixed(2),
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
      <PageHeader title="My Department Reports" sub="Academic performance analytics for your students" />

      <Grid cols={3}>
        <StatCard label="Avg CGPA"       value={avg(approved.map(s => s.cgpa))}                                    color={BLU} icon="📊" />
        <StatCard label="Avg Attendance" value={`${Math.round(avg(approved.map(s => avgAtt(s)).filter(Boolean)))}%`} color={GRN} icon="📋" />
        <StatCard label="Total Backlogs" value={approved.reduce((a, s) => a + s.backlogs, 0)}                      color={RED} icon="⚠️" />
      </Grid>

      <div style={{
        background: theme.CRD,
        border: `1px solid ${theme.BD}`,
        borderRadius: 12,
        padding: 20,
        boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: theme.TX1, marginBottom: 16, fontFamily: F }}>
          Semester-wise Performance
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={semData} barSize={30}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.BD} vertical={false} />
            <XAxis dataKey="semester" tick={{ fill: theme.TX2, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left"  tick={{ fill: theme.TX2, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 10]} tick={{ fill: theme.TX2, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: theme.TX2 }} cursor={{ fill: theme.BD + "44" }} />
            <Bar yAxisId="left"  dataKey="count"   fill={BLU} radius={[4,4,0,0]} name="Students" />
            <Bar yAxisId="right" dataKey="avgCGPA" fill={GRN} radius={[4,4,0,0]} name="Avg CGPA" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}