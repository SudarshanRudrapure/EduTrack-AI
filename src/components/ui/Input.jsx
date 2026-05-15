import { SRF, BD, TX2, TX1, F } from "../../constants/theme";

export default function Input({ label, value, onChange, type = "text", placeholder, style = {} }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 12, color: TX2, marginBottom: 5, fontWeight: 500, fontFamily: F }}>{label}</div>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", background: SRF, border: `1px solid ${BD}`, borderRadius: 8, padding: "9px 13px", color: TX1, fontSize: 13, fontFamily: F, outline: "none", ...style }} />
    </div>
  );
}