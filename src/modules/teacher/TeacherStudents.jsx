import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { BLU, GRN, AMB, RED, F, FM } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
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
  const { theme, isDark } = useTheme();
  const [search,  setSearch]  = useState("");
  const [branchF, setBranchF] = useState("All");
  const [semF,    setSemF]    = useState("All");
  const [sel,     setSel]     = useState(null);

  const sems     = ["All", ...Array.from(new Set(students.map(s => s.semester))).sort()];
  const filtered = students.filter(s =>
    (!search || s.name.toLowerCase().includes(search.toLowerCase()) || s.usn.toLowerCase().includes(search.toLowerCase()))
    && (branchF === "All" || s.branch === branchF)
    && (semF    === "All" || s.semester === +semF)
  );

  return (
    <>
      <PageHeader
        title="My Students"
        sub={`${students.filter(s => s.status === "approved").length} approved students`}
      />

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, USN..." />
        <Select value={branchF} onChange={setBranchF} options={["All", ...BRANCHES]} />
        <Select value={semF}    onChange={setSemF}    options={sems.map(s => ({ value: s, label: s === "All" ? "All Semesters" : `Sem ${s}` }))} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {filtered.map(s => (
          <div key={s.id} onClick={() => setSel(s)} style={{
            background: theme.CRD,
            border: `1px solid ${sel?.id === s.id ? BLU : theme.BD}`,
            borderRadius: 12,
            padding: 16,
            cursor: "pointer",
            boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Avatar name={s.name} size={38} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: theme.TX1, fontFamily: F, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                <div style={{ fontSize: 11, color: theme.TX2, fontFamily: FM }}>{s.usn}</div>
              </div>
              <StatusBadge status={s.status} />
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
              <Badge color={BCOL[s.branch]} bg={BCOL[s.branch] + "18"}>{s.branch}</Badge>
              <Badge color={theme.TX2} bg={theme.BD}>Sem {s.semester}</Badge>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: theme.TX2, fontFamily: F }}>
                CGPA: <b style={{ color: GRN, fontFamily: FM }}>{s.cgpa || "—"}</b>
              </span>
              <span style={{ color: avgAtt(s) < 75 ? RED : theme.TX2, fontFamily: F }}>
                Att: <b style={{ fontFamily: FM }}>{avgAtt(s) || "—"}%</b>
              </span>
              {s.backlogs > 0 && (
                <Badge color={RED} bg={isDark ? "#450a0a" : "#fee2e2"}>{s.backlogs} KT</Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      {sel && (
        <Modal title={`${sel.name} — Detailed Profile`} onClose={() => setSel(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[
              ["USN", sel.usn || "—"], ["Branch", sel.branch],
              ["Semester", sel.semester], ["CGPA", sel.cgpa],
              ["SGPA", sel.sgpa], ["Backlogs", sel.backlogs],
              ["Section", sel.section || "—"], ["Specialization", sel.specialization || "—"],
            ].map(([k, v]) => (
              <div key={k} style={{ background: isDark ? theme.SRF : theme.BG, borderRadius: 8, padding: "10px 12px", border: `1px solid ${theme.BD}` }}>
                <div style={{ fontSize: 10, color: theme.TX3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3, fontFamily: F }}>{k}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: theme.TX1, fontFamily: FM }}>{v}</div>
              </div>
            ))}
          </div>
          {Object.keys(sel.attendance).length > 0 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, color: theme.TX1, marginBottom: 10, fontFamily: F }}>
                Subject Attendance
              </div>
              {Object.entries(sel.attendance).map(([sub, val]) => (
                <AttBar key={sub} subject={sub} value={val} />
              ))}
            </>
          )}
        </Modal>
      )}
    </>
  );
}