import { useTheme } from "../../context/ThemeContext";

export default function PageWrap({ children }) {
  const { theme } = useTheme();
  return (
    <div style={{ marginLeft: 220, minHeight: "100vh", padding: 28, background: theme.BG }}>
      {children}
    </div>
  );
}