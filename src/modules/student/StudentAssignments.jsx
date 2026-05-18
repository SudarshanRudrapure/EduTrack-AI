import { useState } from "react";
import { BLU, GRN, AMB, F } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { gradeColor } from "../../utils/helpers";
import PageHeader from "../../components/layout/PageHeader";
import Btn from "../../components/ui/Btn";
import Badge from "../../components/ui/Badge";
import StatusBadge from "../../components/ui/StatusBadge";

export default function StudentAssignments({ student, assignments, setAssignments }) {
  const { theme, isDark } = useTheme();
  const [content,   setContent]   = useState({});
  const [submitted, setSubmitted] = useState({});

  const submit = (asgnId) => {
    if (!content[asgnId]) return;
    setAssignments(prev => prev.map(a => a.id === asgnId ? {
      ...a,
      submissions: [
        ...a.submissions.filter(s => s.studentId !== student.id),
        { studentId: student.id, studentName: student.name, submittedAt: new Date().toLocaleDateString(), content: content[asgnId], status: "submitted", grade: null }
      ]
    } : a));
    setSubmitted(p => ({ ...p, [asgnId]: true }));
  };

  return (
    <>
      <PageHeader
        title="Assignments"
        sub={`${assignments.length} assignments for ${student.branch}`}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {assignments.map(a => {
          const mySub       = a.submissions.find(s => s.studentId === student.id);
          const isSubmitted = !!mySub || submitted[a.id];
          const leftColor   = isSubmitted ? GRN : mySub?.status === "reviewed" ? BLU : AMB;

          return (
            <div key={a.id} style={{
              background: theme.CRD,
              border: `1px solid ${isSubmitted ? GRN + "44" : theme.BD}`,
              borderRadius: 12,
              padding: 20,
              borderLeft: `3px solid ${leftColor}`,
              boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
            }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: theme.TX1, marginBottom: 6, fontFamily: F }}>
                    {a.title}
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Badge color={BLU} bg={isDark ? BLU + "18" : BLU + "12"}>{a.subject}</Badge>
                    <Badge color={theme.TX2} bg={theme.BD}>Due: {a.dueDate}</Badge>
                    {mySub?.grade && (
                      <Badge color={gradeColor(mySub.grade)} bg={gradeColor(mySub.grade) + "22"}>
                        Grade: {mySub.grade}
                      </Badge>
                    )}
                  </div>
                </div>
                <StatusBadge status={isSubmitted ? (mySub?.status || "submitted") : "pending"} />
              </div>

              {/* Description */}
              <div style={{ fontSize: 13, color: theme.TX2, marginBottom: 14, lineHeight: 1.6, fontFamily: F }}>
                {a.desc}
              </div>

              {/* Submitted view */}
              {isSubmitted && mySub ? (
                <div style={{
                  background: isDark ? theme.SRF : theme.BG,
                  borderRadius: 8,
                  padding: 12,
                  border: `1px solid ${theme.BD}`,
                }}>
                  <div style={{ fontSize: 11, color: theme.TX3, marginBottom: 4, fontFamily: F }}>
                    Your submission · {mySub.submittedAt}
                  </div>
                  <div style={{ fontSize: 13, color: theme.TX1, fontFamily: F }}>
                    {mySub.content}
                  </div>
                </div>
              ) : (
                /* Submit form */
                <div>
                  <textarea
                    value={content[a.id] || ""}
                    onChange={e => setContent(p => ({ ...p, [a.id]: e.target.value }))}
                    placeholder="Write your submission here..."
                    rows={3}
                    style={{
                      width: "100%",
                      background: isDark ? theme.SRF : theme.BG,
                      border: `1px solid ${theme.BD}`,
                      borderRadius: 8,
                      padding: "10px 12px",
                      color: theme.TX1,
                      fontSize: 13,
                      fontFamily: F,
                      outline: "none",
                      resize: "vertical",
                      marginBottom: 10,
                    }}
                  />
                  <Btn onClick={() => submit(a.id)} disabled={!content[a.id]}>
                    Submit Assignment →
                  </Btn>
                </div>
              )}
            </div>
          );
        })}

        {assignments.length === 0 && (
          <div style={{
            color: theme.TX2,
            fontSize: 14,
            fontFamily: F,
            textAlign: "center",
            padding: 40,
            background: theme.CRD,
            borderRadius: 12,
            border: `1px solid ${theme.BD}`,
          }}>
            No assignments posted for your branch yet.
          </div>
        )}
      </div>
    </>
  );
}