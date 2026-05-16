import { GRN, AMB, RED, F, FM } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";

export default function AttBar({ subject, value }) {
  const { theme } = useTheme();
  const color = value >= 85 ? GRN : value >= 75 ? AMB : RED;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: theme.TX2, fontFamily: F }}>{subject}</span>
        <span style={{ fontSize: 12, fontFamily: FM, color, fontWeight: 700 }}>{value}%</span>
      </div>
      <div style={{ height: 6, background: theme.BD, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 3, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}