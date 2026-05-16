import { useState } from "react";
import { BLU, GRN, F } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { BCOL } from "../../constants/branches";
import { gradeColor } from "../../utils/helpers";
import PageHeader from "../../components/layout/PageHeader";
import Btn from "../../components/ui/Btn";
import Badge from "../../components/ui/Badge";
import StatusBadge from "../../components/ui/StatusBadge";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

export default function TeacherAssignments({ teacher, assignments, setAssignments }) {
  const { theme, isDark } = useTheme();
  const [modal,    setModal]    = useState(null);
  const [selAsgn,  setSelAsgn]  = useState(null);
  const [form,     setForm]     = useState({ title: "", subject: teacher.subjects[0] || "", branch: teacher.department, dueDate: "", desc: "" });

  const createAssignment = () => {
    setAssignments(p => [...p, { ...form, id: Date.now(), teacherId: teacher.id, status: "active", submissions: [] }]);
    setModal(null);
    setForm({ title: "", subject: teacher.subjects[0] || "", branch: teacher.department, dueDate: "", desc: "" });
  };

  const gradeSubmission = (asgnId, studentId, grade) => {
    setAssignments(p => p.map(a => a.id === asgnId ? {
      ...a, submissions: a.submissions.map(s => s.studentId === studentId ? { ...s, grade, status: "reviewed" } : s)
    } : a));
  };

  const cardStyle = {
    background: theme.CRD,
    border: `1px solid ${theme.BD}`,
    borderRadius: 12,
    padding: 20,
    boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
  };

  return (
    <>
      <PageHeader
        title="Assignment Management"
        sub="Create assignments and review student submissions"
        actions={[<Btn key="add" onClick={() => setModal("create")}>+ New Assignment</Btn>]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 18 }}>

        {/* Assignment List */}
        <div>
          <div style={{ fontSize: 11, color: theme.TX3, fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1.2, fontFamily: F }}>
            Active Assignments
          </div>
          {assignments.length === 0 && (
            <div style={{ color: theme.TX2, fontSize: 13, fontFamily: F }}>No assignments created yet.</div>
          )}
          {assignments.map(a => (
            <div key={a.id} onClick={() => setSelAsgn(a)} style={{
              background: theme.CRD,
              border: `1px solid ${selAsgn?.id === a.id ? BLU : theme.BD}`,
              borderRadius: 10,
              padding: 16,
              marginBottom: 10,
              cursor: "pointer",
              boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.05)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: theme.TX1, fontFamily: F }}>{a.title}</div>
                <Badge color={GRN} bg={isDark ? GRN + "18" : "#d1fae5"}>{a.status}</Badge>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <Badge color={BLU} bg={isDark ? BLU + "18" : BLU + "12"}>{a.subject}</Badge>
                <Badge color={BCOL[a.branch] || theme.TX2} bg={(BCOL[a.branch] || theme.TX2) + "18"}>{a.branch}</Badge>
              </div>
              <div style={{ fontSize: 11, color: theme.TX2, fontFamily: F }}>
                Due: {a.dueDate} · {a.submissions.length} submission(s)
              </div>
            </div>
          ))}
        </div>

        {/* Submission Detail */}
        <div style={cardStyle}>
          {selAsgn ? (
            <>
              <div style={{ fontSize: 14, fontWeight: 700, color: theme.TX1, marginBottom: 4, fontFamily: F }}>{selAsgn.title}</div>
              <div style={{ fontSize: 12, color: theme.TX2, marginBottom: 16, fontFamily: F }}>{selAsgn.desc}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.TX1, marginBottom: 10, fontFamily: F }}>
                Submissions ({selAsgn.submissions.length})
              </div>
              {selAsgn.submissions.length === 0 ? (
                <div style={{ color: theme.TX2, fontSize: 12, fontFamily: F }}>No submissions yet.</div>
              ) : selAsgn.submissions.map(sub => (
                <div key={sub.studentId} style={{
                  background: isDark ? theme.SRF : theme.BG,
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 10,
                  border: `1px solid ${theme.BD}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: theme.TX1, fontFamily: F }}>{sub.studentName}</span>
                    <StatusBadge status={sub.status} />
                  </div>
                  <div style={{ fontSize: 11, color: theme.TX2, marginBottom: 8, fontFamily: F }}>
                    Submitted: {sub.submittedAt}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: theme.TX2,
                    marginBottom: 10,
                    background: theme.CRD,
                    padding: 8,
                    borderRadius: 6,
                    fontFamily: F,
                    border: `1px solid ${theme.BD}`,
                  }}>
                    {sub.content}
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: theme.TX2, fontFamily: F }}>Grade:</span>
                    {["A","B","C","D","F"].map(g => (
                      <button key={g} onClick={() => gradeSubmission(selAsgn.id, sub.studentId, g)} style={{
                        padding: "3px 10px",
                        borderRadius: 6,
                        background: sub.grade === g ? gradeColor(g) + "22" : isDark ? theme.CRD : theme.BG,
                        border: `1px solid ${sub.grade === g ? gradeColor(g) : theme.BD}`,
                        color: sub.grade === g ? gradeColor(g) : theme.TX2,
                        fontSize: 12,
                        fontFamily: F,
                        cursor: "pointer",
                        fontWeight: 600,
                      }}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 200, color: theme.TX2 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📝</div>
              <div style={{ fontFamily: F }}>Select an assignment to view submissions</div>
            </div>
          )}
        </div>
      </div>

      {modal === "create" && (
        <Modal title="Create New Assignment" onClose={() => setModal(null)}>
          <Input label="Title"    value={form.title}   onChange={v => setForm(p => ({ ...p, title: v }))}   placeholder="Assignment title" />
          <Select label="Subject" value={form.subject} onChange={v => setForm(p => ({ ...p, subject: v }))} options={teacher.subjects} />
          <Input label="Due Date" value={form.dueDate} onChange={v => setForm(p => ({ ...p, dueDate: v }))} type="date" />
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: theme.TX2, marginBottom: 6, fontWeight: 600, fontFamily: F }}>Description</div>
            <textarea value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} rows={4}
              placeholder="Assignment instructions..."
              style={{ width: "100%", background: theme.SRF, border: `1px solid ${theme.BD}`, borderRadius: 8, padding: "9px 13px", color: theme.TX1, fontSize: 13, fontFamily: F, outline: "none", resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn v="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={createAssignment}>Create Assignment</Btn>
          </div>
        </Modal>
      )}
    </>
  );
}