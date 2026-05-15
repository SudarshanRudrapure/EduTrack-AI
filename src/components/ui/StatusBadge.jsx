import Badge from "./Badge";
import { GRN, AMB, RED, TX2, BD } from "../../constants/theme";

export default function StatusBadge({ status }) {
  const map = { approved: [GRN, "#064e3b"], pending: [AMB, "#451a03"], rejected: [RED, "#450a0a"] };
  const [c, bg] = map[status] || [TX2, BD];
  return <Badge color={c} bg={bg}>{status}</Badge>;
}