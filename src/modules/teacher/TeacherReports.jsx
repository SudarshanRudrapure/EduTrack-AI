import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { CRD, BD, BD2, BLU, GRN, RED, TX1, TX2 } from "../../constants/theme";
import { avg, avgAtt } from "../../utils/helpers";
import PageHeader from "../../components/layout/PageHeader";
import StatCard from "../../components/ui/StatCard";
import Grid from "../../components/ui/Grid";

export default function TeacherReports({ students }) {
  const approved = students.filter(s => s.status === "approved");
  const semData  = Array.from(new Set(approved.map(s => s.semester))).sort().map(sem => ({
    semester: `Sem ${sem}`,
    count:    approved.filter(s => s.semester === sem).length,
    avgCGPA:  +avg(approved.filter(s => s.semester === sem).map(s => s.cgpa)).toFixed(2),
  }));

  return (
    <>
      <PageHeader title="My Department Reports" sub="Academic performance analytics for your students" />
      <Grid cols={3}>
        <StatCard label="Avg CGPA"       value={avg(approved.map(s => s.cgpa))}                                  color={BLU} icon="📊" />
        <StatCard label="Avg Attendance" value={`${Math.round(avg(approved.map(s => avgAtt(s)).filter(Boolean)))}%`} color={GRN} icon="📋" />
        <StatCard label="Total Backlogs" value={approved.reduce((a, s) => a + s.backlogs, 0)}                    color={RED} icon="⚠️" />
      </Grid>
      <div style={{ background: CRD, border: `1px solid ${BD}`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: TX1, marginBottom: 16 }}>Semester-wise Performance</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={semData} barSize={30}>
            <CartesianGrid strokeDasharray="3 3" stroke={BD} vertical={false} />
            <XAxis dataKey="semester" tick={{ fill: TX2, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left"  tick={{ fill: TX2, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 10]} tick={{ fill: TX2, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0f1d35", border: `1px solid ${BD2}`, borderRadius: 8, fontSize: 12 }} />
            <Bar yAxisId="left"  dataKey="count"   fill={BLU} radius={[4, 4, 0, 0]} name="Students" />
            <Bar yAxisId="right" dataKey="avgCGPA" fill={GRN} radius={[4, 4, 0, 0]} name="Avg CGPA" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}