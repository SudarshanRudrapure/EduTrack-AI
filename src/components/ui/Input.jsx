// eslint-disable-next-line no-unused-vars
import { F, BLU } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";

export default function Input({ label, value, onChange, type = "text", placeholder, style = {} }) {
  const { theme } = useTheme();
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 12, color: theme.TX2, marginBottom: 6, fontWeight: 600, fontFamily: F, letterSpacing: 0.3 }}>{label}</div>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: theme.SRF,
          border: `1px solid ${theme.BD}`,
          borderRadius: 8,
          padding: "9px 13px",
          color: theme.TX1,
          fontSize: 13,
          fontFamily: F,
          outline: "none",
          ...style
        }}
      />
    </div>
  );
}