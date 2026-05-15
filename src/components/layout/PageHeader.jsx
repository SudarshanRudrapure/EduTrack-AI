import { TX1, TX2, F } from "../../constants/theme";

export default function PageHeader({ title, sub, actions }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: TX1, letterSpacing: -0.5, fontFamily: F }}>{title}</div>
        {sub && <div style={{ fontSize: 13, color: TX2, marginTop: 3, fontFamily: F }}>{sub}</div>}
      </div>
      {actions && <div style={{ display: "flex", gap: 8 }}>{actions}</div>}
    </div>
  );
}