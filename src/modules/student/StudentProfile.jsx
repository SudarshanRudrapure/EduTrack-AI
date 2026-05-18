import { BLU, GRN, F, FM } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import PageHeader from "../../components/layout/PageHeader";
import Avatar from "../../components/ui/Avatar";
import StatusBadge from "../../components/ui/StatusBadge";

export default function StudentProfile({ student }) {
  const { theme, isDark } = useTheme();

  const fields = [
    ["USN",            student.usn || "Pending"],
    ["Full Name",      student.name],
    ["Email",          student.email],
    ["Phone",          student.phone],
    ["University",     student.university],
    ["College",        student.college],
    ["Branch",         student.branch],
    ["Specialization", student.specialization || "—"],
    ["Section",        student.section || "—"],
    ["Semester",       student.semester],
    ["Year",           student.year],
    ["SGPA",           student.sgpa],
    ["CGPA",           student.cgpa],
    ["Backlogs",       student.backlogs],
  ];

  const cardStyle = {
    background: theme.CRD,
    border: `1px solid ${theme.BD}`,
    borderRadius: 12,
    boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
  };

  return (
    <>
      <PageHeader title="My Academic Profile" sub="Your registered academic information" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 18 }}>

        {/* Left card — avatar + stats */}
        <div style={{ ...cardStyle, padding: 24, textAlign: "center" }}>
          <Avatar name={student.name} size={72} />
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: theme.TX1, fontFamily: F }}>{student.name}</div>
            <div style={{ fontSize: 12, color: theme.TX2, marginTop: 4, fontFamily: F }}>{student.email}</div>
            <div style={{ marginTop: 12 }}>
              <StatusBadge status={student.status} />
            </div>
          </div>

          <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{
              background: isDark ? theme.SRF : theme.BG,
              borderRadius: 8,
              padding: 12,
              border: `1px solid ${theme.BD}`,
            }}>
              <div style={{ fontSize: 10, color: theme.TX3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontFamily: F }}>CGPA</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: GRN, fontFamily: FM }}>{student.cgpa}</div>
            </div>
            <div style={{
              background: isDark ? theme.SRF : theme.BG,
              borderRadius: 8,
              padding: 12,
              border: `1px solid ${theme.BD}`,
            }}>
              <div style={{ fontSize: 10, color: theme.TX3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontFamily: F }}>SGPA</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: BLU, fontFamily: FM }}>{student.sgpa}</div>
            </div>
          </div>
        </div>

        {/* Right card — details */}
        <div style={{ ...cardStyle, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.TX1, marginBottom: 16, fontFamily: F }}>
            Academic Details
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            {fields.map(([k, v]) => (
              <div key={k} style={{
                padding: "10px 0",
                borderBottom: `1px solid ${theme.BD}`,
                paddingRight: 20,
              }}>
                <div style={{ fontSize: 10, color: theme.TX3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3, fontFamily: F }}>
                  {k}
                </div>
                <div style={{
                  fontSize: 13,
                  color: theme.TX1,
                  fontFamily: ["CGPA","SGPA","Semester","Year","Backlogs"].includes(k) ? FM : F,
                  fontWeight: 500,
                }}>
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}