
import { BLU, GRN, AMB, RED, CRD, CRD2, BD, TX1, TX2, TX3, F } from "../../constants/theme";
import PageHeader from "../../components/layout/PageHeader";
import Btn from "../../components/ui/Btn";

export default function StudentNotifications({ student, updateStudent }) {
  const notifs    = student.notifications || [];
  const typeColor = { success: GRN, warn: AMB, danger: RED, info: BLU };

  const markRead    = id => updateStudent(s => ({ ...s, notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n) }));
  const markAllRead = ()  => updateStudent(s => ({ ...s, notifications: s.notifications.map(n => ({ ...n, read: true })) }));

  return (
    <>
      <PageHeader title="Notifications" sub={`${notifs.filter(n => !n.read).length} unread`}
        actions={[<Btn key="all" v="ghost" onClick={markAllRead} sz="sm">Mark all read</Btn>]} />
      {notifs.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: TX2 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔔</div>
          <div style={{ fontFamily: F }}>No notifications yet</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {notifs.map(n => (
            <div key={n.id} onClick={() => markRead(n.id)}
              style={{ background: n.read ? CRD : CRD2, border: `1px solid ${n.read ? BD : (typeColor[n.type] || TX3) + "44"}`, borderRadius: 10, padding: "14px 18px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 14, borderLeft: `3px solid ${typeColor[n.type] || TX3}` }}>
              <div style={{ fontSize: 18, marginTop: 1 }}>
                {n.type === "success" ? "✅" : n.type === "danger" ? "🚨" : n.type === "warn" ? "⚠️" : "ℹ️"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: n.read ? TX2 : TX1, fontWeight: n.read ? 400 : 600, fontFamily: F }}>{n.msg}</div>
                <div style={{ fontSize: 11, color: TX3, marginTop: 4, fontFamily: F }}>{n.date}</div>
              </div>
              {!n.read && <div style={{ width: 8, height: 8, background: typeColor[n.type] || BLU, borderRadius: "50%", marginTop: 4, flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      )}
    </>
  );
}