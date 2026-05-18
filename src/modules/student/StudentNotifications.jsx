import { BLU, GRN, AMB, RED, F } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import PageHeader from "../../components/layout/PageHeader";
import Btn from "../../components/ui/Btn";

export default function StudentNotifications({ student, updateStudent }) {
  const { theme, isDark } = useTheme();

  const notifs    = student.notifications || [];
  const typeColor = { success: GRN, warn: AMB, danger: RED, info: BLU };

  const markRead    = id => updateStudent(s => ({
    ...s, notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  }));
  const markAllRead = () => updateStudent(s => ({
    ...s, notifications: s.notifications.map(n => ({ ...n, read: true }))
  }));

  return (
    <>
      <PageHeader
        title="Notifications"
        sub={`${notifs.filter(n => !n.read).length} unread`}
        actions={[<Btn key="all" v="ghost" onClick={markAllRead} sz="sm">Mark all read</Btn>]}
      />

      {notifs.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: 60,
          color: theme.TX2,
          background: theme.CRD,
          borderRadius: 12,
          border: `1px solid ${theme.BD}`,
          boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔔</div>
          <div style={{ fontFamily: F, fontSize: 14 }}>No notifications yet</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {notifs.map(n => {
            const color = typeColor[n.type] || theme.TX3;
            return (
              <div key={n.id} onClick={() => markRead(n.id)} style={{
                background: n.read
                  ? theme.CRD
                  : isDark ? theme.CRD2 : theme.BG,
                border: `1px solid ${n.read ? theme.BD : color + "44"}`,
                borderLeft: `3px solid ${color}`,
                borderRadius: 10,
                padding: "14px 18px",
                cursor: "pointer",
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.05)",
              }}>
                <div style={{ fontSize: 18, marginTop: 1 }}>
                  {n.type === "success" ? "✅" : n.type === "danger" ? "🚨" : n.type === "warn" ? "⚠️" : "ℹ️"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 13,
                    color: n.read ? theme.TX2 : theme.TX1,
                    fontWeight: n.read ? 400 : 600,
                    fontFamily: F,
                  }}>
                    {n.msg}
                  </div>
                  <div style={{ fontSize: 11, color: theme.TX3, marginTop: 4, fontFamily: F }}>
                    {n.date}
                  </div>
                </div>
                {!n.read && (
                  <div style={{
                    width: 8,
                    height: 8,
                    background: color,
                    borderRadius: "50%",
                    marginTop: 4,
                    flexShrink: 0,
                  }} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}