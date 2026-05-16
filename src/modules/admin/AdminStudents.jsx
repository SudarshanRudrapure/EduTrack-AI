import { useState } from "react";
import { GRN, AMB, RED, F, FM } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { BRANCHES, BCOL } from "../../constants/branches";
import { avgAtt } from "../../utils/helpers";
import PageHeader from "../../components/layout/PageHeader";
import Btn from "../../components/ui/Btn";
import Badge from "../../components/ui/Badge";
import StatusBadge from "../../components/ui/StatusBadge";
import Avatar from "../../components/ui/Avatar";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import SearchBar from "../../components/ui/SearchBar";

// eslint-disable-next-line no-unused-vars
export default function AdminStudents({ students, teachers, setStudents }) {
  const { theme, isDark } = useTheme();

  const [search,       setSearch]       = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modal,        setModal]        = useState(null);
  const [editData,     setEditData]     = useState({});

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    return (
      (!q || s.name.toLowerCase().includes(q) || s.usn.toLowerCase().includes(q) || s.email.toLowerCase().includes(q))
      && (branchFilter === "All" || s.branch === branchFilter)
      && (statusFilter === "All" || s.status === statusFilter)
    );
  });

  const openEdit = s => { setEditData({ ...s }); setModal("edit"); };
  const openAdd  = () => {
    setEditData({ name: "", email: "", usn: "", branch: "CSE", status: "pending", semester: 1, cgpa: 0, backlogs: 0, phone: "", password: "student123", attendance: {}, sgpaHist: [], notifications: [], university: "VTU", college: "SCE", specialization: "", section: "", year: 1, sgpa: 0, teacherId: 1 });
    setModal("add");
  };
  const save   = () => { modal === "edit" ? setStudents(p => p.map(s => s.id === editData.id ? editData : s)) : setStudents(p => [...p, { ...editData, id: Date.now() }]); setModal(null); };
  const remove = id => { if (confirm("Delete this student?")) setStudents(p => p.filter(s => s.id !== id)); };

  const cols = ["Student", "USN", "Branch", "Sem", "CGPA", "Att%", "Status", "Actions"];

  return (
    <>
      <PageHeader
        title="Student Management"
        sub={`${students.length} total students across all branches`}
        actions={[<Btn key="add" onClick={openAdd}>+ Add Student</Btn>]}
      />

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search name, USN, email..." />
        <Select value={branchFilter} onChange={setBranchFilter} options={["All", ...BRANCHES]} />
        <Select value={statusFilter} onChange={setStatusFilter} options={["All", "approved", "pending", "rejected"]} />
      </div>

      <div style={{
        background: theme.CRD,
        border: `1px solid ${theme.BD}`,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: isDark ? theme.CRD2 : theme.BG, borderBottom: `2px solid ${theme.BD}` }}>
                {cols.map(c => (
                  <th key={c} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: theme.TX3, letterSpacing: 0.8, textTransform: "uppercase" }}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} style={{
                  borderBottom: `1px solid ${theme.BD}`,
                  background: i % 2 === 0 ? "transparent" : isDark ? theme.SRF + "55" : theme.BG + "88",
                }}>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={s.name} size={32} />
                      <div>
                        <div style={{ fontSize: 13, color: theme.TX1, fontWeight: 600, fontFamily: F }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: theme.TX3, fontFamily: F }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", fontFamily: FM, fontSize: 12, color: theme.TX2 }}>{s.usn || "—"}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <Badge color={BCOL[s.branch]} bg={BCOL[s.branch] + "18"}>{s.branch}</Badge>
                  </td>
                  <td style={{ padding: "12px 14px", fontFamily: FM, color: theme.TX2, fontSize: 13 }}>{s.semester}</td>
                  <td style={{ padding: "12px 14px", fontFamily: FM, color: s.cgpa >= 8 ? GRN : s.cgpa >= 6 ? AMB : RED, fontWeight: 700 }}>
                    {s.cgpa || "—"}
                  </td>
                  <td style={{ padding: "12px 14px", fontFamily: FM, color: avgAtt(s) >= 75 ? GRN : RED, fontWeight: 600 }}>
                    {avgAtt(s) ? `${avgAtt(s)}%` : "—"}
                  </td>
                  <td style={{ padding: "12px 14px" }}><StatusBadge status={s.status} /></td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn v="ghost" sz="sm" onClick={() => openEdit(s)}>Edit</Btn>
                      <Btn v="danger" sz="sm" onClick={() => remove(s.id)}>Del</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: theme.TX2, fontFamily: F, fontSize: 14 }}>
              No students match your filters.
            </div>
          )}
        </div>
      </div>

      {modal && (
        <Modal title={modal === "edit" ? "Edit Student" : "Add Student"} onClose={() => setModal(null)}>
          <Input label="Full Name" value={editData.name}   onChange={v => setEditData(p => ({ ...p, name: v }))} />
          <Input label="Email"     value={editData.email}  onChange={v => setEditData(p => ({ ...p, email: v }))} />
          <Input label="USN"       value={editData.usn}    onChange={v => setEditData(p => ({ ...p, usn: v }))} />
          <Input label="Phone"     value={editData.phone}  onChange={v => setEditData(p => ({ ...p, phone: v }))} />
          <Select label="Branch"   value={editData.branch} onChange={v => setEditData(p => ({ ...p, branch: v }))} options={BRANCHES} />
          <Select label="Status"   value={editData.status} onChange={v => setEditData(p => ({ ...p, status: v }))} options={["approved", "pending", "rejected"]} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Semester" value={editData.semester} onChange={v => setEditData(p => ({ ...p, semester: +v }))} type="number" />
            <Input label="CGPA"     value={editData.cgpa}     onChange={v => setEditData(p => ({ ...p, cgpa: +v }))}     type="number" />
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 6 }}>
            <Btn v="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={save}>Save Changes</Btn>
          </div>
        </Modal>
      )}
    </>
  );
}