import { SRF, BD, TX2, TX1, F } from "../../constants/theme";

export default function Select({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 12, color: TX2, marginBottom: 5, fontWeight: 500, fontFamily: F }}>{label}</div>}
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", background: SRF, border: `1px solid ${BD}`, borderRadius: 8, padding: "9px 13px", color: TX1, fontSize: 13, fontFamily: F, outline: "none" }}>
        {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
    </div>
  );
}