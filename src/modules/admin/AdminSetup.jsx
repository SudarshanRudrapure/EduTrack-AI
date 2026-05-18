import { useState } from "react";
import { runFullSetup } from "../../services/spSetup";

export default function AdminSetup({ students, teachers, assignments }) {
  const [logs,    setLogs]    = useState([]);
  const [running, setRunning] = useState(false);
  const [result,  setResult]  = useState(null);

  const run = async () => {
    setRunning(true);
    setLogs([]);
    setResult(null);

    const res = await runFullSetup(students, teachers, assignments);
    setLogs(res.logs);
    setResult(res);
    setRunning(false);
  };

  return (
    <div style={{ padding: 24 }}>

      {/* Page Title */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
          SharePoint Setup
        </h2>
        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
          Create lists, columns and seed all data automatically through code
        </p>
      </div>

      {/* Info Card */}
      <div style={{
        background: "#dbeafe",
        border: "1px solid #93c5fd",
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1d4ed8", marginBottom: 10 }}>
          ℹ️ What this will do automatically
        </div>
        {[
          "✅ Create Students list with 19 columns",
          "✅ Create Teachers list with 5 columns",
          "✅ Create Assignments list with 7 columns",
          `✅ Seed ${students?.length || 0} students into SharePoint`,
          `✅ Seed ${teachers?.length || 0} teachers into SharePoint`,
          `✅ Seed ${assignments?.length || 0} assignments into SharePoint`,
        ].map((item, i) => (
          <div key={i} style={{
            fontSize: 13,
            color: "#1e40af",
            marginBottom: 4,
          }}>
            {item}
          </div>
        ))}
      </div>

      {/* Warning Card */}
      <div style={{
        background: "#fef3c7",
        border: "1px solid #fcd34d",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#d97706", marginBottom: 6 }}>
          ⚠️ Before running
        </div>
        <div style={{ fontSize: 12, color: "#92400e", lineHeight: 1.7 }}>
          Make sure you have pasted your <b>SharePoint Proxy Flow URL</b> in{" "}
          <code style={{
            background: "#fde68a",
            padding: "1px 6px",
            borderRadius: 4,
            fontSize: 11,
            margin: "0 4px",
          }}>
            src/services/spSetup.js
          </code>{" "}
          before clicking Run Setup.
        </div>
      </div>

      {/* Run Button */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={run}
          disabled={running}
          style={{
            background: running ? "#93c5fd" : "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 28px",
            fontSize: 15,
            fontWeight: 600,
            cursor: running ? "not-allowed" : "pointer",
          }}
        >
          {running ? "⏳ Running setup..." : "🚀 Run Full Setup"}
        </button>
      </div>

      {/* Logs Terminal */}
      {logs.length > 0 && (
        <div style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 20,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
            📄 Setup Logs
          </div>

          <div style={{
            background: "#f8fafc",
            borderRadius: 8,
            padding: 16,
            maxHeight: 360,
            overflowY: "auto",
            border: "1px solid #e5e7eb",
          }}>
            {logs.map((log, i) => (
              <div key={i} style={{
                fontSize: 12,
                fontFamily: "monospace",
                marginBottom: 3,
                lineHeight: 1.6,
                color: log.includes("❌") ? "#dc2626"
                     : log.includes("🎉") ? "#16a34a"
                     : log.includes("✅") ? "#16a34a"
                     : log.includes("🌱") ? "#d97706"
                     : log.includes("📋") ? "#2563eb"
                     : "#374151",
              }}>
                {log}
              </div>
            ))}
          </div>

          {/* Result Message */}
          {result && (
            <div style={{
              marginTop: 14,
              padding: 14,
              background: result.success ? "#d1fae5" : "#fee2e2",
              border: `1px solid ${result.success ? "#6ee7b7" : "#fca5a5"}`,
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              color: result.success ? "#065f46" : "#dc2626",
            }}>
              {result.success
                ? "🎉 SharePoint setup complete! All lists, columns and data are ready."
                : `❌ Setup failed: ${result.error}`}
            </div>
          )}
        </div>
      )}

    </div>
  );
}