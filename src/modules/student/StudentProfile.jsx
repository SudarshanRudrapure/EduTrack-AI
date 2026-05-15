import { CRD, SRF, BD, BLU, GRN, TX1, TX2, TX3, F, FM } from "../../constants/theme";
import PageHeader from "../../components/layout/PageHeader";
import Avatar from "../../components/ui/Avatar";
import StatusBadge from "../../components/ui/StatusBadge";

export default function StudentProfile({ student }) {
  const fields = [
    ["USN", student.usn || "Pending"], ["Full Name", student.name], ["Email", student.email],
    ["Phone", student.phone], ["University", student.university], ["College", student.college],
    ["Branch", student.branch], ["Specialization", student.specialization || "—"],
    ["Section", student.section || "—"], ["Semester", student.semester], ["Year", student.year],
    ["SGPA", student.sgpa], ["CGPA", student.cgpa], ["Backlogs", student.backlogs],
  ];

  return (
    <>
      <PageHeader title="My Academic Profile" sub="Your registered academic information" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 18 }}>
        <div style={{ background: CRD, border: `1px solid ${BD}`, borderRadius: 12, padding: 24, textAlign: "center" }}>
          <Avatar name={student.name} size={72} />
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: TX1, fontFamily: F }}>{student.name}</div>
            <div style={{ fontSize: 12, color: TX2, marginTop: 4, fontFamily: F }}>{student.email}</div>
            <div style={{ marginTop: 12 }}><StatusBadge status={student.status} /></div>
          </div>
          <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ background: SRF, borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 10, color: TX3, textTransform: "uppercase", letterSpacing: 1 }}>CGPA</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: GRN, fontFamily: FM }}>{student.cgpa}</div>
            </div>
            <div style={{ background: SRF, borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 10, color: TX3, textTransform: "uppercase", letterSpacing: 1 }}>SGPA</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: BLU, fontFamily: FM }}>{student.sgpa}</div>
            </div>
          </div>
        </div>

        <div style={{ background: CRD, border: `1px solid ${BD}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TX1, marginBottom: 16, fontFamily: F }}>Academic Details</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            {fields.map(([k, v]) => (
              <div key={k} style={{ padding: "10px 0", borderBottom: `1px solid ${BD}`, paddingRight: 20 }}>
                <div style={{ fontSize: 10, color: TX3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>{k}</div>
                <div style={{ fontSize: 13, color: TX1, fontFamily: ["CGPA","SGPA","Semester","Year","Backlogs"].includes(k) ? FM : F, fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}