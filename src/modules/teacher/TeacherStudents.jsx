import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { CRD, BD, BLU, GRN, AMB, RED, TX1, TX2, F } from "../../constants/theme";
import { BRANCHES, BCOL } from "../../constants/branches";
import { avgAtt } from "../../utils/helpers";
import PageHeader from "../../components/layout/PageHeader";
import SearchBar from "../../components/ui/SearchBar";
import Select from "../../components/ui/Select";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import StatusBadge from "../../components/ui/StatusBadge";
import AttBar from "../../components/ui/AttBar";
import Modal from "../../components/ui/Modal";

export default function TeacherStudents({ students }) {
  const [search, setSearch] = useState("");
  const [branchF, setBranchF] = useState("All");
  const [semF, setSemF]       = useState("All");
  const [sel, setSel]         = useState(null);

  const sems     = ["All", ...Array.from(new Set(students.map(s => s.semester))).sort()];
  const filtered = students.filter(s =>
    (!search || s.name.toLowerCase().includes(search.toLowerCase()) || s.usn.toLowerCase().includes(search.toLowerCase()))
    && (branchF === "All" || s.branch === branchF)
    && (semF    === "All" || s.semester === +semF)
  );

  return (
    <>
      <PageHeader title="My Students" sub={`${students.filter(s => s.status === "approved").length} approved students`} />
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, USN, branch..." />
        <Select value={branchF} onChange={setBranchF} options={["All", ...BRANCHES]} />
        <Select value={semF}    onChange={setSemF}    options={sems.map(s => ({ value: s, label: s === "All" ? "All Semesters" : `Sem ${s}` }))} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {filtered.map(s => (
          <div key={s.id} onClick={() => setSel(s)} style={{ background: CRD, border: `1px solid ${sel?.id === s.id ? BLU : BD}`, borderRadius: 12, padding: 16, cursor: "pointer", transition: "border-color 0.15s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Avatar name={s.name} size={38} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: TX1, fontFamily: F }}>{s.name}</div>
                <div style={{ fontSize: 11, color: TX2, fontFamily: "'JetBrains Mono', monospace" }}>{s.usn}</div>
              </div>
              <StatusBadge status={s.status} />
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
              <Badge color={BCOL[s.branch]} bg={BCOL[s.branch] + "18"}>{s.branch}</Badge>
              <Badge color={TX2} bg={BD}>Sem {s.semester}</Badge>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: TX2, fontFamily: F }}>CGPA: <b style={{ color: GRN, fontFamily: "'JetBrains Mono', monospace" }}>{s.cgpa || "—"}</b></span>
              <span style={{ color: avgAtt(s) < 75 ? RED : TX2, fontFamily: F }}>Att: <b style={{ fontFamily: "'JetBrains Mono', monospace" }}>{avgAtt(s) || "—"}%</b></span>
              {s.backlogs > 0 && <Badge color={RED} bg="#450a0a">{s.backlogs} KT</Badge>}
            </div>
          </div>
        ))}
      </div>

      {sel && (
        <Modal title={`${sel.name} — Detailed Profile`} onClose={() => setSel(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            {[["USN", sel.usn || "—"], ["Branch", sel.branch], ["Semester", sel.semester], ["CGPA", sel.cgpa], ["SGPA", sel.sgpa], ["Backlogs", sel.backlogs], ["Section", sel.section || "—"], ["Specialization", sel.specialization || "—"]].map(([k, v]) => (
              <div key={k} style={{ background: "#071020", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, color: "#3d5278", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>{k}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: TX1, fontFamily: "'JetBrains Mono', monospace" }}>{v}</div>
              </div>
            ))}
          </div>
          {Object.keys(sel.attendance).length > 0 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, color: TX1, marginBottom: 10 }}>Subject Attendance</div>
              {Object.entries(sel.attendance).map(([sub, val]) => <AttBar key={sub} subject={sub} value={val} />)}
            </>
          )}
        </Modal>
      )}
    </>
  );
}