import { F, BLU, BLU2, GRN, RED, AMB, PRP } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";

export default function Btn({ children, v = "primary", sz = "md", onClick, style = {}, disabled }) {
  const { theme, isDark } = useTheme();

  const vs = {
    primary: { background: BLU,           color: "#fff",      border: `1px solid ${BLU2}` },
    ghost:   { background: "transparent", color: theme.TX2,   border: `1px solid ${theme.BD2}` },
    success: { background: isDark ? "#064e3b" : "#d1fae5", color: isDark ? GRN : "#065f46", border: isDark ? "1px solid #065f46" : "1px solid #6ee7b7" },
    danger:  { background: isDark ? "#450a0a" : "#fee2e2", color: isDark ? RED : "#b91c1c", border: isDark ? "1px solid #7f1d1d" : "1px solid #fca5a5" },
    amber:   { background: isDark ? "#451a03" : "#fef3c7", color: isDark ? AMB : "#92400e", border: isDark ? "1px solid #78350f" : "1px solid #fcd34d" },
    purple:  { background: isDark ? "#2e1065" : "#ede9fe", color: isDark ? PRP : "#6d28d9", border: isDark ? "1px solid #4c1d95" : "1px solid #c4b5fd" },
  };
  const ss = {
    sm: { padding: "3px 10px",  fontSize: 11, borderRadius: 6  },
    md: { padding: "7px 15px",  fontSize: 13, borderRadius: 8  },
    lg: { padding: "11px 22px", fontSize: 14, borderRadius: 10 },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...vs[v], ...ss[sz],
        fontFamily: F,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        ...style
      }}>
      {children}
    </button>
  );
}