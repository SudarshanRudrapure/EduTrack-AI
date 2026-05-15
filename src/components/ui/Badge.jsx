import { TX2, BD, F } from "../../constants/theme";

export default function Badge({ children, color = TX2, bg = BD }) {
  return (
    <span style={{ background: bg, color, border: `1px solid ${color}33`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600, fontFamily: F, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}