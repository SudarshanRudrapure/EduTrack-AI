import { useState, useEffect } from "react";
import { CRD, SRF, BD, GRN, RED, TX1, TX2, F } from "../../constants/theme";
import { lowAttendance, avgAtt } from "../../utils/helpers";
import PageHeader from "../../components/layout/PageHeader";
import Btn from "../../components/ui/Btn";
import Badge from "../../components/ui/Badge";
import Avatar from "../../components/ui/Avatar";

export default function TeacherAttendance({ students, setStudents }) {
  const approved = students.filter(s => s.status === "approved");
  const [selId, setSelId]       = useState(approved[0]?.id || null);
  const [attEdits, setAttEdits] = useState({});
  const [saved, setSaved]       = useState(false);

  const selStudent = approved.find(s => s.id === selId);
  const updateAtt  = (sub, val) => setAttEdits(p => ({ ...p, [sub]: +val }));

  const saveAtt = () => {
    setStudents(p => p.map(s => s.id === selId ? { ...s, attendance: { ...s.attendance, ...attEdits } } : s));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (selStudent) setAttEdits({ ...selStudent.attendance }); }, [selId]);

  const lowStudents = approved.filter(lowAttendance);

  return (
    <>
      <PageHeader title="Attendance Management" sub="Add or update subject-wise attendance for students" />
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>
        <div style={{ background: CRD, border: `1px solid ${BD}`, borderRadius: 12, padding: 20 }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: TX2, display: "block", marginBottom: 6, fontFamily: F }}>Select Student</label>
            <select value={selId} onChange={e => setSelId(+e.target.value)}
              style={{ width: "100%", background: SRF, border: `1px solid ${BD}`, borderRadius: 8, padding: "9px 12px", color: TX1, fontSize: 13, fontFamily: F, outline: "none" }}>
              {approved.map(s => <option key={s.id} value={s.id}>{s.name} — {s.branch}</option>)}
            </select>
          </div>

          {selStudent && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, padding: 12, background: SRF, borderRadius: 8 }}>
                <Avatar name={selStudent.name} size={36} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TX1, fontFamily: F }}>{selStudent.name}</div>
                  <div style={{ fontSize: 11, color: TX2, fontFamily: F }}>{selStudent.usn} · {selStudent.branch} · Sem {selStudent.semester}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: TX2, marginBottom: 12, fontWeight: 500, fontFamily: F }}>Subject-wise Attendance (%)</div>
              {Object.keys(attEdits).length === 0 && <div style={{ color: TX2, fontSize: 12, fontFamily: F }}>No subjects assigned. Add subjects below.</div>}
              {Object.entries(attEdits).map(([sub, val]) => (
                <div key={sub} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 80, fontSize: 12, color: TX2, fontFamily: F }}>{sub}</div>
                  <input type="range" min={0} max={100} value={val} onChange={e => updateAtt(sub, e.target.value)} style={{ flex: 1, accentColor: val >= 75 ? GRN : RED }} />
                  <div style={{ width: 40, textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: val >= 75 ? GRN : RED, fontWeight: 700 }}>{val}%</div>
                </div>
              ))}
              <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                <Btn onClick={saveAtt}>{saved ? "✓ Saved!" : "Save Attendance"}</Btn>
                <Btn v="ghost" onClick={() => { const sub = prompt("Enter subject name:"); if (sub) setAttEdits(p => ({ ...p, [sub]: 80 })); }}>+ Add Subject</Btn>
              </div>
            </>
          )}
        </div>

        <div style={{ background: CRD, border: `1px solid ${BD}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: RED, marginBottom: 14 }}>⚠️ Low Attendance ({lowStudents.length})</div>
          {lowStudents.length === 0
            ? <div style={{ color: TX2, fontSize: 13, fontFamily: F }}>All students above 75%.</div>
            : lowStudents.map(s => (
              <div key={s.id} style={{ padding: "10px 0", borderBottom: `1px solid ${BD}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: TX1, fontWeight: 500, fontFamily: F }}>{s.name}</span>
                  <Badge color={RED} bg="#450a0a">{avgAtt(s)}% avg</Badge>
                </div>
                {Object.entries(s.attendance).filter(([, v]) => v < 75).map(([sub, val]) => (
                  <div key={sub} style={{ fontSize: 11, color: RED, marginBottom: 2, fontFamily: F }}>• {sub}: {val}%</div>
                ))}
              </div>
            ))
          }
        </div>
      </div>
    </>
  );
}