import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { CRD, BD, BD2, BLU, GRN, AMB, RED, TX1, TX2, TX3 } from "../../constants/theme";
import { BRANCHES, BCOL } from "../../constants/branches";
import { avg, avgAtt, lowAttendance } from "../../utils/helpers";
import PageHeader from "../../components/layout/PageHeader";
import Badge from "../../components/ui/Badge";

export default function AdminReports({ students }) {
  const cgpaByBranch = BRANCHES.map(b => {
    const bs = students.filter(s => s.branch === b && s.cgpa > 0);
    return { branch: b, avgCGPA: bs.length ? +avg(bs.map(s => s.cgpa)).toFixed(1) : 0 };
  });
  const attByBranch = BRANCHES.map(b => {
    const bs = students.filter(s => s.branch === b);
    const atts = bs.map(s => avgAtt(s)).filter(Boolean);
    return { branch: b, avgAtt: atts.length ? Math.round(avg(atts)) : 0 };
  });

  return (
    <>
      <PageHeader title="Reports & Analytics" sub="Branch-wise academic performance insights" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 20 }}>
        <div style={{ background: CRD, border: `1px solid ${BD}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TX1, marginBottom: 16 }}>Average CGPA by Branch</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cgpaByBranch} barSize={30}>
              <CartesianGrid strokeDasharray="3 3" stroke={BD} vertical={false} />
              <XAxis dataKey="branch" tick={{ fill: TX2, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fill: TX2, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0f1d35", border: `1px solid ${BD2}`, borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="avgCGPA" radius={[6, 6, 0, 0]}>
                {cgpaByBranch.map((e, i) => <Cell key={i} fill={BCOL[e.branch]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: CRD, border: `1px solid ${BD}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TX1, marginBottom: 16 }}>Average Attendance by Branch</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attByBranch} barSize={30}>
              <CartesianGrid strokeDasharray="3 3" stroke={BD} vertical={false} />
              <XAxis dataKey="branch" tick={{ fill: TX2, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: TX2, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0f1d35", border: `1px solid ${BD2}`, borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="avgAtt" fill={GRN} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: CRD, border: `1px solid ${BD}`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: TX1, marginBottom: 14 }}>Branch-wise Summary Table</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BD2}` }}>
              {["Branch", "Students", "Avg CGPA", "Avg Att%", "Backlogs", "Low Att"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, color: TX3, fontWeight: 700, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BRANCHES.map(b => {
              const bs       = students.filter(s => s.branch === b);
              const approved = bs.filter(s => s.status === "approved");
              return (
                <tr key={b} style={{ borderBottom: `1px solid ${BD}` }}>
                  <td style={{ padding: "10px 12px" }}><Badge color={BCOL[b]} bg={BCOL[b] + "18"}>{b}</Badge></td>
                  <td style={{ padding: "10px 12px", color: TX1, fontFamily: "'JetBrains Mono', monospace" }}>{bs.length}</td>
                  <td style={{ padding: "10px 12px", color: GRN, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{avg(approved.map(s => s.cgpa)) || "—"}</td>
                  <td style={{ padding: "10px 12px", color: BLU, fontFamily: "'JetBrains Mono', monospace" }}>{Math.round(avg(approved.map(s => avgAtt(s)).filter(Boolean))) || "—"}%</td>
                  <td style={{ padding: "10px 12px", color: AMB, fontFamily: "'JetBrains Mono', monospace" }}>{approved.reduce((a, s) => a + s.backlogs, 0)}</td>
                  <td style={{ padding: "10px 12px", color: RED, fontFamily: "'JetBrains Mono', monospace" }}>{approved.filter(lowAttendance).length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}