import { SRF, BD2, BLU, BLU2 } from "../../constants/theme";

export default function ChatButton({ open, onClick }) {
  return (
    <button onClick={onClick}
      style={{ position: "fixed", right: 24, bottom: 24, width: 52, height: 52, background: open ? SRF : BLU, border: `1px solid ${open ? BD2 : BLU2}`, borderRadius: "50%", color: "#fff", fontSize: 22, cursor: "pointer", zIndex: 998, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(79,131,246,0.4)", transition: "all 0.2s" }}>
      {open ? "✕" : "🤖"}
    </button>
  );
}