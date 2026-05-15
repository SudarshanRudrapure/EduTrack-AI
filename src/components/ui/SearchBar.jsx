import { SRF, BD, TX1, TX3, F } from "../../constants/theme";

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div style={{ position: "relative", maxWidth: 300 }}>
      <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: TX3 }}>🔍</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ background: SRF, border: `1px solid ${BD}`, borderRadius: 8, padding: "8px 12px 8px 34px", color: TX1, fontSize: 13, fontFamily: F, outline: "none", width: "100%" }} />
    </div>
  );
}