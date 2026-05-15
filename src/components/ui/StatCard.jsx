import { CRD, BD, BLU, TX2, TX3, FM, F } from "../../constants/theme";

export default function StatCard({ label, value, sub, color = BLU, icon }) {
  return (
    <div style={{ background: CRD, border: `1px solid ${BD}`, borderRadius: 12, padding: "18px 20px", borderLeft: `3px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 12, color: TX2, fontWeight: 500, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1, fontFamily: F }}>{label}</div>
          <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: FM }}>{value}</div>
          {sub && <div style={{ fontSize: 11, color: TX3, marginTop: 4, fontFamily: F }}>{sub}</div>}
        </div>
        {icon && <div style={{ fontSize: 28, opacity: 0.4 }}>{icon}</div>}
      </div>
    </div>
  );
}