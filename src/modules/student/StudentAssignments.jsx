import { useState } from "react";
import { CRD, SRF, BD, BLU, GRN, AMB, TX1, TX2, F } from "../../constants/theme";
import { gradeColor } from "../../utils/helpers";
import PageHeader from "../../components/layout/PageHeader";
import Btn from "../../components/ui/Btn";
import Badge from "../../components/ui/Badge";
import StatusBadge from "../../components/ui/StatusBadge";

export default function StudentAssignments({ student, assignments, setAssignments }) {
  const [content, setContent]     = useState({});
  const [submitted, setSubmitted] = useState({});

  const submit = (asgnId) => {
    if (!content[asgnId]) return;
    setAssignments(prev => prev.map(a => a.id === asgnId ? {
      ...a, submissions: [...a.submissions.filter(s => s.studentId !== student.id),
        { studentId: student.id, studentName: student.name, submittedAt: new Date().toLocaleDateString(), content: content[asgnId], status: "submitted", grade: null }]
    } : a));
    setSubmitted(p => ({ ...p, [asgnId]: true }));
  };

  return (
    <>
      <PageHeader title="Assignments" sub={`${assignments.length} assignments for ${student.branch}`} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {assignments.map(a => {
          const mySub      = a.submissions.find(s => s.studentId === student.id);
          const isSubmitted = !!mySub || submitted[a.id];
          return (
            <div key={a.id} style={{ background: CRD, border: `1px solid ${isSubmitted ? GRN + "33" : BD}`, borderRadius: 12, padding: 20, borderLeft: `3px solid ${isSubmitted ? GRN : mySub?.status === "reviewed" ? BLU : AMB}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: TX1, marginBottom: 4, fontFamily: F }}>{a.title}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Badge color={BLU} bg={BLU + "18"}>{a.subject}</Badge>
                    <Badge color={TX2} bg={BD}>Due: {a.dueDate}</Badge>
                    {mySub?.grade && <Badge color={gradeColor(mySub.grade)} bg={gradeColor(mySub.grade) + "22"}>Grade: {mySub.grade}</Badge>}
                  </div>
                </div>
                <StatusBadge status={isSubmitted ? (mySub?.status || "submitted") : "pending"} />
              </div>
              <div style={{ fontSize: 13, color: TX2, marginBottom: 14, lineHeight: 1.6, fontFamily: F }}>{a.desc}</div>
              {isSubmitted && mySub ? (
                <div style={{ background: SRF, borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 11, color: "#3d5278", marginBottom: 4, fontFamily: F }}>Your submission · {mySub.submittedAt}</div>
                  <div style={{ fontSize: 13, color: TX1, fontFamily: F }}>{mySub.content}</div>
                </div>
              ) : (
                <div>
                  <textarea value={content[a.id] || ""} onChange={e => setContent(p => ({ ...p, [a.id]: e.target.value }))}
                    placeholder="Write your submission here..." rows={3}
                    style={{ width: "100%", background: SRF, border: `1px solid ${BD}`, borderRadius: 8, padding: "10px 12px", color: TX1, fontSize: 13, fontFamily: F, outline: "none", resize: "vertical", marginBottom: 10 }} />
                  <Btn onClick={() => submit(a.id)} disabled={!content[a.id]}>Submit Assignment →</Btn>
                </div>
              )}
            </div>
          );
        })}
        {assignments.length === 0 && <div style={{ color: TX2, fontSize: 14, fontFamily: F }}>No assignments posted for your branch yet.</div>}
      </div>
    </>
  );
}