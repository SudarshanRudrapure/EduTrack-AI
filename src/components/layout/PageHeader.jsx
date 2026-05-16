import { F } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";

export default function PageHeader({ title, sub, actions }) {
  const { theme } = useTheme();
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: theme.TX1, letterSpacing: -0.5, fontFamily: F }}>{title}</div>
        {sub && <div style={{ fontSize: 13, color: theme.TX2, marginTop: 3, fontFamily: F }}>{sub}</div>}
      </div>
      {actions && <div style={{ display: "flex", gap: 8 }}>{actions}</div>}
    </div>
  );
}