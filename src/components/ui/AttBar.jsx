import { BD, GRN, AMB, RED, TX2, FM, F } from "../../constants/theme";

export default function AttBar({ subject, value }) {
  const color = value >= 85 ? GRN : value >= 75 ? AMB : RED;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: TX2, fontFamily: F }}>{subject}</span>
        <span style={{ fontSize: 12, fontFamily: FM, color, fontWeight: 600 }}>{value}%</span>
      </div>
      <div style={{ height: 6, background: BD, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 3, transition: "width 0.8s" }} />
      </div>
    </div>
  );
}