import { useRef, useState, useEffect } from "react";
import { CRD, SRF, BD, BD2, BLU, GRN, TX1, TX2, F } from "../../constants/theme";
import buildSystemPrompt from "./buildSystemPrompt";

// ─── PASTE YOUR GROQ API KEY HERE ───────────────────────────────────────────
// const GROQ_API_KEY = "YOUR_GROQ_API_KEY_HERE";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
// ─────────────────────────────────────────────────────────────────────────────

export default function ChatPanel({ user, students, teachers, assignments, onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: `Hi ${user.name || user.data?.name || "there"}! 👋 I'm EduTrack AI. I have access to the academic database and can answer questions about ${user.role === "admin" ? "students, teachers, and system analytics" : user.role === "teacher" ? "your students' performance, attendance, and assignments" : "your CGPA, attendance, assignments, and academic progress"}. How can I help?` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const quickPrompts = user.role === "admin"
    ? ["How many students in CSE?", "List low attendance students", "Top 5 performers by CGPA", "Branch-wise summary"]
    : user.role === "teacher"
    ? ["Students below 75% attendance", "Top performers in my class", "Students with backlogs", "List all CSE students"]
    : ["What is my CGPA?", "Show my attendance", "Do I have any backlogs?", "How is my academic progress?"];

  const send = async (msg) => {
    const userMsg = msg || input;
    if (!userMsg.trim() || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const sysPrompt = buildSystemPrompt(user, students, teachers, assignments);

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          // model: "llama3-8b-8192",
          model: "llama-3.3-70b-versatile",
          max_tokens: 1000,
          messages: [
            { role: "system", content: sysPrompt },
            ...newMessages.map(m => ({ role: m.role, content: m.content }))
          ],
        }),
      });

      const data = await response.json();

      if (data.error) {
        console.error("Groq API error:", data.error);
        setMessages(prev => [...prev, { role: "assistant", content: `Error: ${data.error.message || "Something went wrong. Please try again."}` }]);
        return;
      }

      const reply = data.choices?.[0]?.message?.content || "I encountered an issue. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);

    } catch (err) {
      console.error("Network error:", err);
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please check your network and try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const roleIcon = user.role === "admin" ? "🛡️" : user.role === "teacher" ? "👨‍🏫" : "🎓";

  return (
    <div style={{ position: "fixed", right: 20, bottom: 80, width: 380, height: 540, background: CRD, border: `1px solid ${BD2}`, borderRadius: 16, display: "flex", flexDirection: "column", zIndex: 999, boxShadow: "0 20px 60px #00000088" }}>

      {/* Header */}
      <div style={{ padding: "14px 18px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, background: BLU + "22", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, border: `1px solid ${BLU}44` }}>🤖</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TX1, fontFamily: F }}>EduTrack AI</div>
          <div style={{ fontSize: 10, color: GRN, display: "flex", alignItems: "center", gap: 4, fontFamily: F }}>
            <span style={{ width: 6, height: 6, background: GRN, borderRadius: "50%", display: "inline-block" }} />
            Live · {user.role} context {roleIcon}
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: TX2, fontSize: 18, cursor: "pointer" }}>✕</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "82%", padding: "10px 14px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: m.role === "user" ? BLU : SRF, color: m.role === "user" ? "#fff" : TX1, fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap", border: m.role === "assistant" ? `1px solid ${BD}` : "none", fontFamily: F }}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", gap: 5, padding: "10px 14px", background: SRF, border: `1px solid ${BD}`, borderRadius: "14px 14px 14px 4px", width: 60 }}>
            {[0, 0.2, 0.4].map((d, i) => (
              <div key={i} style={{ width: 8, height: 8, background: TX2, borderRadius: "50%", animation: `pulse 1s ${d}s infinite` }} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Prompts */}
      <div style={{ padding: "8px 12px", borderTop: `1px solid ${BD}`, display: "flex", gap: 6, flexWrap: "wrap" }}>
        {quickPrompts.map(q => (
          <button key={q} onClick={() => send(q)}
            style={{ padding: "4px 10px", background: SRF, border: `1px solid ${BD2}`, borderRadius: 20, color: TX2, fontSize: 11, fontFamily: F, cursor: "pointer", whiteSpace: "nowrap" }}>
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: "10px 14px", borderTop: `1px solid ${BD}`, display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Ask anything about academics..."
          style={{ flex: 1, background: SRF, border: `1px solid ${BD}`, borderRadius: 10, padding: "9px 13px", color: TX1, fontSize: 13, fontFamily: F, outline: "none" }}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          style={{ width: 38, height: 38, background: BLU, border: "none", borderRadius: 10, color: "#fff", fontSize: 16, cursor: input.trim() && !loading ? "pointer" : "not-allowed", opacity: input.trim() && !loading ? 1 : 0.5, display: "flex", alignItems: "center", justifyContent: "center" }}>
          ↑
        </button>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:0.3;transform:translateY(0)} 50%{opacity:1;transform:translateY(-3px)} }`}</style>
    </div>
  );
}