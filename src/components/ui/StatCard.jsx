import { BLU, F, FM } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";

export default function StatCard({ label, value, sub, color = BLU, icon }) {
  const { theme, isDark } = useTheme();
  return (
    <div style={{
      background: theme.CRD,
      border: `1px solid ${theme.BD}`,
      borderRadius: 12,
      padding: "18px 20px",
      borderLeft: `3px solid ${color}`,
      boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 11, color: theme.TX3, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1.2, fontFamily: F }}>{label}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: FM }}>{value}</div>
          {sub && <div style={{ fontSize: 11, color: theme.TX2, marginTop: 5, fontFamily: F }}>{sub}</div>}
        </div>
        {icon && <div style={{ fontSize: 26, opacity: isDark ? 0.35 : 0.5 }}>{icon}</div>}
      </div>
    </div>
  );
}