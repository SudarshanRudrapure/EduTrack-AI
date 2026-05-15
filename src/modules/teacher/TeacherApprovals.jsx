import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { CRD, BD, AMB, RED, GRN, TX1, TX2, F } from "../../constants/theme";
import { BCOL } from "../../constants/branches";
import PageHeader from "../../components/layout/PageHeader";
import Btn from "../../components/ui/Btn";
import Badge from "../../components/ui/Badge";
import Avatar from "../../components/ui/Avatar";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";

export default function TeacherApprovals({ students, setStudents }) {
  const pending = students.filter(s => s.status === "pending");
  const [sel, setSel]         = useState(null);
  const [editData, setEditData] = useState({});

  const approve = id => setStudents(p => p.map(s => s.id === id
    ? { ...s, status: "approved", notifications: [...(s.notifications || []), { id: Date.now(), msg: "Profile approved by teacher! Dashboard is now active.", type: "success", read: false, date: "Today" }] }
    : s));
  const reject  = id => setStudents(p => p.map(s => s.id === id ? { ...s, status: "rejected" } : s));
  const saveEdit = () => { setStudents(p => p.map(s => s.id === editData.id ? { ...editData, status: "approved" } : s)); setSel(null); };

  return (
    <>
      <PageHeader title="Pending Approvals" sub={`${pending.length} student profiles awaiting your review`} />
      {pending.length === 0 ? (
        <div style={{ background: CRD, border: `1px solid ${BD}`, borderRadius: 12, padding: 40, textAlign: "center", color: TX2 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: TX1, fontFamily: F }}>All caught up!</div>
          <div style={{ fontSize: 13, fontFamily: F }}>No pending approvals at this time.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {pending.map(s => (
            <div key={s.id} style={{ background: CRD, border: `1px solid ${AMB}33`, borderRadius: 12, padding: 20, borderLeft: `3px solid ${AMB}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <Avatar name={s.name} size={44} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: TX1, marginBottom: 2, fontFamily: F }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: TX2, marginBottom: 10, fontFamily: F }}>{s.email} · {s.phone} · {s.university}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                    <Badge color={BCOL[s.branch]} bg={BCOL[s.branch] + "18"}>{s.branch}</Badge>
                    <Badge color={TX2} bg={BD}>Sem {s.semester}</Badge>
                    <Badge color={TX2} bg={BD}>{s.specialization || "No specialization"}</Badge>
                    <Badge color={TX2} bg={BD}>CGPA: {s.cgpa}</Badge>
                    {s.backlogs > 0 && <Badge color={RED} bg="#450a0a">{s.backlogs} backlog(s)</Badge>}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn v="success" onClick={() => approve(s.id)}>✓ Approve</Btn>
                    <Btn v="ghost"   onClick={() => { setEditData({ ...s }); setSel("edit"); }}>✏️ Edit & Approve</Btn>
                    <Btn v="danger"  onClick={() => reject(s.id)}>✗ Reject</Btn>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {sel === "edit" && (
        <Modal title="Edit & Approve Student Profile" onClose={() => setSel(null)}>
          <Input label="USN"            value={editData.usn}            onChange={v => setEditData(p => ({ ...p, usn: v }))} />
          <Input label="Specialization" value={editData.specialization} onChange={v => setEditData(p => ({ ...p, specialization: v }))} />
          <Input label="Section"        value={editData.section}        onChange={v => setEditData(p => ({ ...p, section: v }))} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Semester" value={editData.semester} onChange={v => setEditData(p => ({ ...p, semester: +v }))} type="number" />
            <Input label="Year"     value={editData.year}     onChange={v => setEditData(p => ({ ...p, year: +v }))}     type="number" />
            <Input label="SGPA"     value={editData.sgpa}     onChange={v => setEditData(p => ({ ...p, sgpa: +v }))}     type="number" />
            <Input label="CGPA"     value={editData.cgpa}     onChange={v => setEditData(p => ({ ...p, cgpa: +v }))}     type="number" />
          </div>
          <Input label="Backlogs" value={editData.backlogs} onChange={v => setEditData(p => ({ ...p, backlogs: +v }))} type="number" />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn v="ghost" onClick={() => setSel(null)}>Cancel</Btn>
            <Btn v="success" onClick={saveEdit}>✓ Save & Approve</Btn>
          </div>
        </Modal>
      )}
    </>
  );
}