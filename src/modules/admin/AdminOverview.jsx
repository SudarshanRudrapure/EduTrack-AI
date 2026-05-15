import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from "recharts";
// eslint-disable-next-line no-unused-vars
import { CRD, BD, BD2, BLU, GRN, AMB, RED, TX1, TX2, FM } from "../../constants/theme";
import { BRANCHES, BCOL } from "../../constants/branches";
// eslint-disable-next-line no-unused-vars
import { lowAttendance, avgAtt, avg } from "../../utils/helpers";
import PageHeader from "../../components/layout/PageHeader";
import StatCard from "../../components/ui/StatCard";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import Grid from "../../components/ui/Grid";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) return (
    <div style={{ background: "#0f1d35", border: `1px solid #1e3558`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#dde8f8" }}>
      <div>{payload[0].name}: <b style={{ color: payload[0].fill || BLU }}>{payload[0].value}</b></div>
    </div>
  );
  return null;
};

// eslint-disable-next-line no-unused-vars
export default function AdminOverview({ students, teachers, assignments }) {
  const approved = students.filter(s => s.status === "approved");
  const pending  = students.filter(s => s.status === "pending");
  const lowAtt   = approved.filter(lowAttendance);
  const topPerf  = [...approved].sort((a, b) => b.cgpa - a.cgpa).slice(0, 5);

  const branchData = BRANCHES.map(b => ({ name: b, students: students.filter(s => s.branch === b).length, fill: BCOL[b] }));
  const pieData    = BRANCHES.map(b => ({ name: b, value: students.filter(s => s.branch === b).length }));

  return (
    <>
      <PageHeader title="Admin Dashboard" sub="System overview — all branches and departments" />
      <Grid cols={4}>
        <StatCard label="Total Students"    value={students.length}  sub={`${approved.length} approved`}     color={BLU} icon="🎓" />
        <StatCard label="Total Teachers"    value={teachers.length}  sub="5 departments"                    color={GRN} icon="👨‍🏫" />
        <StatCard label="Pending Approvals" value={pending.length}   sub="Awaiting teacher review"          color={AMB} icon="⏳" />
        <StatCard label="Low Attendance"    value={lowAtt.length}    sub="Below 75% threshold"              color={RED} icon="⚠️" />
      </Grid>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 18, marginBottom: 22 }}>
        <div style={{ background: CRD, border: `1px solid ${BD}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TX1, marginBottom: 16 }}>Branch-wise Student Distribution</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={branchData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke={BD} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: TX2, fontSize: 11, fontFamily: FM }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: TX2, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: BD + "66" }} />
              <Bar dataKey="students" radius={[6, 6, 0, 0]}>
                {branchData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: CRD, border: `1px solid ${BD}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TX1, marginBottom: 16 }}>Branch Pie Chart</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {pieData.map((e, i) => <Cell key={i} fill={BCOL[e.name]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div style={{ background: CRD, border: `1px solid ${BD}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TX1, marginBottom: 14 }}>🏆 Top Performers</div>
          {topPerf.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: i < topPerf.length - 1 ? `1px solid ${BD}` : "none" }}>
              <div style={{ fontFamily: FM, color: i < 3 ? AMB : TX2, fontWeight: 700, fontSize: 13, width: 18 }}>#{i + 1}</div>
              <Avatar name={s.name} size={28} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: TX1, fontWeight: 500 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: TX2 }}>{s.branch} · {s.usn}</div>
              </div>
              <div style={{ fontFamily: FM, color: GRN, fontWeight: 700 }}>{s.cgpa}</div>
            </div>
          ))}
        </div>
        <div style={{ background: CRD, border: `1px solid ${BD}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TX1, marginBottom: 14 }}>⚠️ Low Attendance Students</div>
          {lowAtt.length === 0
            ? <div style={{ color: TX2, fontSize: 13 }}>All students above 75% — Great!</div>
            : lowAtt.slice(0, 6).map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < Math.min(lowAtt.length, 6) - 1 ? `1px solid ${BD}` : "none" }}>
                <Avatar name={s.name} size={28} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: TX1 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: TX2 }}>{s.branch}</div>
                </div>
                <Badge color={RED} bg="#450a0a">{avgAtt(s)}% avg</Badge>
              </div>
            ))
          }
        </div>
      </div>
    </>
  );
}