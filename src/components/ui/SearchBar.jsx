import { F } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  const { theme } = useTheme();
  return (
    <div style={{ position: "relative", maxWidth: 300 }}>
      <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: theme.TX3, fontSize: 14 }}>🔍</span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: theme.SRF,
          border: `1px solid ${theme.BD}`,
          borderRadius: 8,
          padding: "8px 12px 8px 34px",
          color: theme.TX1,
          fontSize: 13,
          fontFamily: F,
          outline: "none",
          width: "100%",
        }}
      />
    </div>
  );
}