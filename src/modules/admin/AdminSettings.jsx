import { GRN, RED, F } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import PageHeader from "../../components/layout/PageHeader";
import Btn from "../../components/ui/Btn";

export default function AdminSettings({ resetData }) {
  const { theme, isDark } = useTheme();

  const cards = [
    {
      title: "🔔 Power Automate Workflows",
      items: [
        "Approval email notifications",
        "Assignment due date reminders",
        "Low attendance alerts",
        "Auto Excel/CSV data sync",
      ],
    },
    {
      title: "📊 Data Export",
      items: [
        "Export students to Excel (.xlsx)",
        "Branch-wise attendance report",
        "CGPA analysis CSV",
        "Assignment submission log",
      ],
    },
    {
      title: "🤖 AI Chatbot Settings",
      items: [
        "Chatbot data refresh interval",
        "Role-based query permissions",
        "Response language: English",
        "Context window: Full student data",
      ],
    },
    {
      title: "🔐 Authentication",
      items: [
        "Admin password policy",
        "Teacher special key: TEACH2024",
        "Session timeout: 8 hours",
        "Two-factor authentication (beta)",
      ],
    },
  ];

  return (
    <>
      <PageHeader title="System Settings" sub="Configure academic management system" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {cards.map(card => (
          <div key={card.title} style={{
            background: theme.CRD,
            border: `1px solid ${theme.BD}`,
            borderRadius: 12,
            padding: 20,
            boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: theme.TX1, marginBottom: 14, fontFamily: F }}>
              {card.title}
            </div>
            {card.items.map((item, idx) => (
              <div key={item} style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 0",
                borderBottom: idx < card.items.length - 1 ? `1px solid ${theme.BD}` : "none",
                fontSize: 13,
                color: theme.TX2,
                fontFamily: F,
              }}>
                <span style={{ color: GRN, fontWeight: 700 }}>✓</span>
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div style={{
        marginTop: 18,
        background: isDark ? "#1a0a0a" : "#fff5f5",
        border: `1px solid ${isDark ? "#7f1d1d" : "#fca5a5"}`,
        borderRadius: 12,
        padding: 20,
        boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: RED, marginBottom: 8, fontFamily: F }}>
          ⚠️ Danger Zone
        </div>
        <div style={{ fontSize: 13, color: theme.TX2, marginBottom: 14, fontFamily: F }}>
          Reset all students, teachers and assignments back to original data. This will permanently clear all changes made during this session.
        </div>
        <Btn v="danger" onClick={resetData}>
          Reset All Data to Default
        </Btn>
      </div>
    </>
  );
}