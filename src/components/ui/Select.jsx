import { F } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";

export default function Select({ label, value, onChange, options }) {
  const { theme } = useTheme();
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 12, color: theme.TX2, marginBottom: 6, fontWeight: 600, fontFamily: F, letterSpacing: 0.3 }}>{label}</div>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
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
        }}>
        {options.map(o => (
          <option key={o.value ?? o} value={o.value ?? o} style={{ background: theme.SRF, color: theme.TX1 }}>
            {o.label ?? o}
          </option>
        ))}
      </select>
    </div>
  );
}