// eslint-disable-next-line no-unused-vars
import { F, BLU, BLU2, RED } from "../../constants/theme";
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
      left: 0, top: 0, bottom: 0,
      zIndex: 100,
      boxShadow: isDark ? "none" : "2px 0 12px rgba(0,0,0,0.06)",
    }}>

      {/* ── Logo ── */}
      <div style={{ padding: "22px 18px 18px", borderBottom: `1px solid ${theme.BD}` }}>
        <div style={{ fontSize: 10, color: theme.TX3, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 6, fontFamily: F }}>
          AMS Portal
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: BLU, letterSpacing: -0.5, fontFamily: F }}>
          EduTrack <span style={{ color: theme.TX1 }}>AI</span>
        </div>
      </div>

      {/* ── Nav Items ── */}
      <div style={{ padding: "12px 10px", flex: 1, overflowY: "auto" }}>
        <div style={{ fontSize: 10, color: theme.TX3, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", padding: "0 8px", marginBottom: 8, fontFamily: F }}>
          Navigation
        </div>
        {items.map(item => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => onNav(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "9px 12px",
                borderRadius: 8,
                background: isActive
                  ? isDark ? BLU + "20" : BLU + "15"
                  : "transparent",
                border: isActive
                  ? `1px solid ${BLU}40`
                  : "1px solid transparent",
                color: isActive ? BLU : theme.TX2,
                fontSize: 13,
                fontFamily: F,
                fontWeight: isActive ? 600 : 500,
                cursor: "pointer",
                textAlign: "left",
                marginBottom: 2,
              }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge ? (
                <span style={{ background: RED, color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* ── Theme Toggle ── */}
      <div style={{ padding: "10px 12px", borderTop: `1px solid ${theme.BD}` }}>
        <button onClick={toggleTheme}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "9px 12px",
            borderRadius: 8,
            background: isDark ? theme.CRD : theme.BG,
            border: `1px solid ${theme.BD}`,
            color: theme.TX2,
            fontSize: 12,
            fontFamily: F,
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: 10,
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>{isDark ? "🌙" : "☀️"}</span>
            <span>{isDark ? "Dark Mode" : "Light Mode"}</span>
          </div>
          {/* Toggle pill */}
          <div style={{
            width: 38,
            height: 22,
            background: isDark ? BLU : theme.BD,
            borderRadius: 11,
            position: "relative",
            flexShrink: 0,
          }}>
            <div style={{
              position: "absolute",
              top: 3,
              left: isDark ? 19 : 3,
              width: 16,
              height: 16,
              background: "#ffffff",
              borderRadius: "50%",
              transition: "left 0.25s ease",
              boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
            }} />
          </div>
        </button>
      </div>

      {/* ── User + Logout ── */}
      <div style={{ padding: "0 12px 16px" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 10,
          padding: "10px 12px",
          background: isDark ? theme.CRD : theme.BG,
          borderRadius: 10,
          border: `1px solid ${theme.BD}`,
        }}>
          <Avatar name={user.name || user.data?.name || "User"} size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: theme.TX1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: F }}>
              {user.name || user.data?.name}
            </div>
            <div style={{ fontSize: 10, color: theme.TX3, fontFamily: F, marginTop: 1 }}>{user.role}</div>
          </div>
        </div>
        <Btn v="ghost" sz="sm" onClick={onLogout} style={{ width: "100%" }}>
          Sign Out
        </Btn>
      </div>
    </div>
  );
}