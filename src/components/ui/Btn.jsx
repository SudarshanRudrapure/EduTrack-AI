// eslint-disable-next-line no-unused-vars
import { F, BLU } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";



export default function Btn({ children, v = "primary", sz = "md", onClick, style = {}, disabled }) {
  // eslint-disable-next-line no-unused-vars
  const { theme } = useTheme();
  const vs = {
    primary: { background: "#4f84f6", color: "#fff", border: "1px solid #1e4ecf" },
    ghost:   { background: "transparent", color: "#7a94b8", border: "1px solid #1e3558" },
    success: { background: "#064e3b", color: "#10d9a8", border: "1px solid #065f46" },
    danger:  { background: "#450a0a", color: "#f87171", border: "1px solid #7f1d1d" },
    amber:   { background: "#451a03", color: "#f59e0b", border: "1px solid #78350f" },
    purple:  { background: "#2e1065", color: "#a78bfa", border: "1px solid #4c1d95" },
  };
  const ss = {
    sm: { padding: "3px 10px",  fontSize: 11, borderRadius: 6 },
    md: { padding: "7px 15px",  fontSize: 13, borderRadius: 8 },
    lg: { padding: "11px 22px", fontSize: 14, borderRadius: 10 },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...vs[v], ...ss[sz], fontFamily: F, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.15s", opacity: disabled ? 0.5 : 1, ...style }}>
      {children}
    </button>
  );
}