import { BLU, GRN, PRP, AMB, ORG, RED, FM } from "../../constants/theme";
import { initials } from "../../utils/helpers";

export default function Avatar({ name, size = 36 }) {
  const colors = [BLU, GRN, PRP, AMB, ORG, RED];
  const color  = colors[name.charCodeAt(0) % colors.length];
  return (
    <div style={{
      width: size, height: size,
      borderRadius: "50%",
      background: color + "22",
      border: `2px solid ${color}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35,
      fontWeight: 700,
      color,
      fontFamily: FM,
      flexShrink: 0,
    }}>
      {initials(name)}
    </div>
  );
}