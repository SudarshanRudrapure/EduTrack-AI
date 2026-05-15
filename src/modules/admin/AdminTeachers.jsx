import { useState } from "react";
import { CRD, BD, BLU, TX1, TX2, F } from "../../constants/theme";
import { BRANCHES } from "../../constants/branches";
import PageHeader from "../../components/layout/PageHeader";
import Btn from "../../components/ui/Btn";
import Badge from "../../components/ui/Badge";
import Avatar from "../../components/ui/Avatar";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

export default function AdminTeachers({ teachers, setTeachers, students }) {
  const [modal, setModal]       = useState(null);
  const [editData, setEditData] = useState({});

  const openAdd = () => setEditData({ name: "", email: "", password: "teacher123", department: "CSE", phone: "", subjects: [] });
  const save    = () => { modal === "edit" ? setTeachers(p => p.map(t => t.id === editData.id ? editData : t)) : setTeachers(p => [...p, { ...editData, id: Date.now() }]); setModal(null); };

  return (
    <>
      <PageHeader title="Teacher Management" sub={`${teachers.length} faculty members`}
        actions={[<Btn key="add" onClick={() => { openAdd(); setModal("add"); }}>+ Add Teacher</Btn>]} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {teachers.map(t => {
          const myStudents = students.filter(s => s.teacherId === t.id);
          return (
            <div key={t.id} style={{ background: CRD, border: `1px solid ${BD}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <Avatar name={t.name} size={44} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: TX1, fontFamily: F }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: TX2, fontFamily: F }}>{t.department} Dept.</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: TX2, marginBottom: 6 }}>📧 {t.email}</div>
              <div style={{ fontSize: 12, color: TX2, marginBottom: 12 }}>📱 {t.phone}</div>
              <div style={{ marginBottom: 12, display: "flex", gap: 4, flexWrap: "wrap" }}>
                {t.subjects.slice(0, 4).map(s => <Badge key={s} color={BLU} bg={BLU + "15"}>{s}</Badge>)}
              </div>
              <div style={{ display: "flex", gap: 6, justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: TX2 }}>{myStudents.length} students assigned</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn v="ghost" sz="sm" onClick={() => { setEditData({ ...t }); setModal("edit"); }}>Edit</Btn>
                  <Btn v="danger" sz="sm" onClick={() => { if (confirm("Remove teacher?")) setTeachers(p => p.filter(x => x.id !== t.id)); }}>Del</Btn>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <Modal title={modal === "edit" ? "Edit Teacher" : "Add Teacher"} onClose={() => setModal(null)}>
          <Input label="Full Name"   value={editData.name}       onChange={v => setEditData(p => ({ ...p, name: v }))} />
          <Input label="Email"       value={editData.email}      onChange={v => setEditData(p => ({ ...p, email: v }))} />
          <Input label="Password"    value={editData.password}   onChange={v => setEditData(p => ({ ...p, password: v }))} type="password" />
          <Input label="Phone"       value={editData.phone}      onChange={v => setEditData(p => ({ ...p, phone: v }))} />
          <Select label="Department" value={editData.department} onChange={v => setEditData(p => ({ ...p, department: v }))} options={BRANCHES} />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 6 }}>
            <Btn v="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}
    </>
  );
}