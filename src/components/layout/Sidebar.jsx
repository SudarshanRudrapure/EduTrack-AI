import { F, BLU, RED } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import Avatar from "../ui/Avatar";
import Btn from "../ui/Btn";

export default function Sidebar({ items, active, onNav, user, onLogout }) {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <div style={{
      width: 220,
      minHeight: "100vh",
      background: theme.SRF,
      borderRight: `1px solid ${theme.BD}`,
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: 100,
    }}>

      {/* Logo */}
      <div style={{ padding: "20px 18px 16px", borderBottom: `1px solid ${theme.BD}` }}>
        <div style={{ fontSize: 11, color: theme.TX3, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4, fontFamily: F }}>AMS Portal</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: BLU, letterSpacing: -0.5, fontFamily: F }}>EduTrack AI</div>
      </div>

      {/* Nav Items */}
      <div style={{ padding: "10px 10px", flex: 1, overflowY: "auto" }}>
        {items.map(item => (
          <button key={item.id} onClick={() => onNav(item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "9px 10px",
              borderRadius: 8,
              background: active === item.id ? BLU + "18" : "transparent",
              border: active === item.id ? `1px solid ${BLU}33` : "1px solid transparent",
              color: active === item.id ? BLU : theme.TX2,
              fontSize: 13,
              fontFamily: F,
              fontWeight: active === item.id ? 600 : 400,
              cursor: "pointer",
              textAlign: "left",
              marginBottom: 2,
              transition: "all 0.15s",
            }}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
            {item.badge ? (
              <span style={{ marginLeft: "auto", background: RED, color: "#fff", borderRadius: 10, padding: "0 6px", fontSize: 10, fontWeight: 700 }}>
                {item.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Theme Toggle */}
      <div style={{ padding: "10px 12px", borderTop: `1px solid ${theme.BD}` }}>
        <button onClick={toggleTheme}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 12px",
            borderRadius: 8,
            background: theme.CRD,
            border: `1px solid ${theme.BD}`,
            color: theme.TX2,
            fontSize: 12,
            fontFamily: F,
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: 10,
          }}>
          <span>{isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}</span>
          {/* Toggle pill */}
          <div style={{
            width: 36,
            height: 20,
            background: isDark ? BLU : theme.BD,
            borderRadius: 10,
            position: "relative",
            transition: "background 0.3s",
          }}>
            <div style={{
              position: "absolute",
              top: 2,
              left: isDark ? 18 : 2,
              width: 16,
              height: 16,
              background: "#fff",
              borderRadius: "50%",
              transition: "left 0.3s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }} />
          </div>
        </button>
      </div>

      {/* User + Logout */}
      <div style={{ padding: "0 12px 14px", borderTop: `1px solid ${theme.BD}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, paddingTop: 12 }}>
          <Avatar name={user.name || user.data?.name || "User"} size={32} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: theme.TX1, maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: F }}>
              {user.name || user.data?.name}
            </div>
            <div style={{ fontSize: 10, color: theme.TX3, fontFamily: F }}>{user.role}</div>
          </div>
        </div>
        <Btn v="ghost" sz="sm" onClick={onLogout} style={{ width: "100%" }}>Sign Out</Btn>
      </div>
    </div>
  );
}