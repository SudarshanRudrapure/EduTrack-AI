import { CRD, BD, GRN, TX1, TX2, F } from "../../constants/theme";
import PageHeader from "../../components/layout/PageHeader";

export default function AdminSettings() {
  const cards = [
    { title: "🔔 Power Automate Workflows", items: ["Approval email notifications", "Assignment due date reminders", "Low attendance alerts", "Auto Excel/CSV data sync"] },
    { title: "📊 Data Export",              items: ["Export students to Excel (.xlsx)", "Branch-wise attendance report", "CGPA analysis CSV", "Assignment submission log"] },
    { title: "🤖 AI Chatbot Settings",      items: ["Chatbot data refresh interval", "Role-based query permissions", "Response language: English", "Context window: Full student data"] },
    { title: "🔐 Authentication",           items: ["Admin password policy", "Teacher special key: TEACH2024", "Session timeout: 8 hours", "Two-factor authentication (beta)"] },
  ];
  return (
    <>
      <PageHeader title="System Settings" sub="Configure academic management system" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {cards.map(card => (
          <div key={card.title} style={{ background: CRD, border: `1px solid ${BD}`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: TX1, marginBottom: 14, fontFamily: F }}>{card.title}</div>
            {card.items.map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${BD}`, fontSize: 13, color: TX2, fontFamily: F }}>
                <span style={{ color: GRN }}>✓</span> {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}