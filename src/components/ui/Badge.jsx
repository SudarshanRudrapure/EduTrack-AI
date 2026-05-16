import { F } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";

export default function Badge({ children, color, bg }) {
  const { theme } = useTheme();
  const c = color || theme.TX2;
  const b = bg    || theme.BD;
  return (
    <span style={{
      background: b,
      color: c,
      border: `1px solid ${c}44`,
      borderRadius: 20,
      padding: "2px 10px",
      fontSize: 11,
      fontWeight: 600,
      fontFamily: F,
      whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}