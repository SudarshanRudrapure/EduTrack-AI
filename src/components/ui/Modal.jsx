import { F } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";

export default function Modal({ title, children, onClose }) {
  const { theme, isDark } = useTheme();
  return (
    <div style={{ position: "fixed", inset: 0, background: isDark ? "#00000099" : "#00000044", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(2px)" }}>
      <div style={{
        background: theme.CRD,
        border: `1px solid ${theme.BD2}`,
        borderRadius: 16,
        width: "100%",
        maxWidth: 560,
        maxHeight: "90vh",
        overflow: "auto",
        boxShadow: isDark ? "0 24px 60px #00000066" : "0 24px 60px rgba(0,0,0,0.15)",
      }}>
        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${theme.BD}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: theme.TX1, fontFamily: F }}>{title}</span>
          <button onClick={onClose} style={{ background: theme.BG, border: `1px solid ${theme.BD}`, borderRadius: 6, color: theme.TX2, fontSize: 16, cursor: "pointer", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        <div style={{ padding: 22 }}>{children}</div>
      </div>
    </div>
  );
}